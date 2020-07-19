import expat from 'node-expat';
import fs from 'fs';
import { EventEmitter } from 'events';
import { WikiPage } from '@dumpster-fire/common';

export class WikiReader extends EventEmitter {


  /**
   * Flags to determine which tag we're currently in
   */
  private in_page     = false;
  private in_ns       = false;
  private in_text     = false;
  private in_title    = false;
  private in_id       = false;
  private in_revision = false;

  /**
   * Page attributes
   */
  private redirect   = false;
  private title      = '';
  private text       = '';
  private id         = -1;
  private namespace  = -1;

  /**
   * Control flags
   */
  private collectText = false;

  private on_start_element(name: string) {

    if (name == "page") {
      this.in_page = true;
    } else if (name == "ns") {
      this.in_ns = true;
    } else if (name == "id") {
      this.in_id = true;
    } else if (name == "text") {
      this.in_text = true;
    } else if (name == "title") {
      this.in_title = true;
    } else if (name == "revision") {
      this.in_revision = true;
    } else if (name == "redirect") {
      this.redirect = true;
    }
  }

  private process_page() {
    const page: WikiPage = {
      categories: [],
      id: this.id,
      text: this.text,
      title: this.title
    }

    this.emit('wikipage', page);
  }

  private can_process_page(): boolean {
    if (this.redirect === true || this.namespace !== 0) {
      return false;
    }
    return true;
  }

  private on_end_element(name: string) {
    if (name == "page") {
      this.in_page = false;
      if (this.can_process_page()) {
        this.process_page();
      }

      this.id = -1;
      this.title = '';
      this.text = '';
      this.namespace = -1;
      this.redirect = false;

    } else if (name == "ns") {
      this.in_ns = false;
    } else if (name == "id") {
      this.in_id = false;
    } else if (name == "text") {
      this.in_text = false;
      this.collectText = false;
    } else if (name == "title") {
      this.in_title = false;
    } else if (name == "revision") {
      this.in_revision = false;
    }
  }

  private on_text(text: string) {
    if (this.in_title) {
      this.title = text;
    } else if (this.in_id && !this.in_revision) {
      this.id = parseInt(text);
    } else if (this.in_ns) {
      this.namespace = parseInt(text);

      if (this.namespace === 0) {
        this.collectText = true;
      }
    } else if (this.in_text && this.collectText) {
      this.text = this.text + text;
    }
  }

  async parse(xmlFile: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const parser = expat.createParser();
      const f = fs.createReadStream(xmlFile);
      parser.on('startElement', (name: string) => this.on_start_element(name));
      parser.on('endElement', (name: string) => this.on_end_element(name));
      parser.on('text', (text: string) => this.on_text(text));
      parser.on('close', () => resolve());
      parser.on('error', (err) => reject(err));
      f.pipe(parser);
    });
  }
}

export function init_wikireader(): WikiReader {
  return new WikiReader();
}
