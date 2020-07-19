import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { WikiPage } from '@dumpster-fire/common';
import { init_wikireader } from './wikireader';
import { download, decompress } from './wikidump';
import fs from 'fs';
import { Logger } from '@nestjs/common';

@Processor('dumpster')
export class XmlParserProcessor {

  private readonly logger = new Logger(XmlParserProcessor.name);

  constructor(
    @InjectQueue('dumpster') private readonly queue: Queue,
  ) { }

  @Process('parse-xml')
  async process(job: Job<void>) {

    this.logger.log('Job started: ' + job.id);

    if (!fs.existsSync("wikinews.xml")) {
      this.logger.log('Downloading xml');
      await download('wikinews.xml.bz2');
      this.logger.log('Decompressing xml');
      await decompress('wikinews.xml.bz2', 'wikinews.xml');
      this.logger.log('XML ready for use');
    }

    const reader = init_wikireader();
    const xmlfile = 'wikinews.xml';

    var counter = 0;

    reader.on('wikipage', (page: WikiPage) => {
      counter++;
      this.logger.log('Queing wiki page #' + counter);
      this.queue.add('parse-wiki', page);
    });

    this.logger.log('Start parsing of xml');
    reader.parse(xmlfile);

  }
}