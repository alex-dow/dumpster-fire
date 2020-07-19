import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WikiPage } from '@dumpster-fire/common';
import wtf from 'wtf_wikipedia';
import { Logger } from '@nestjs/common';
import fs from 'fs';

@Processor('dumpster')
export class WikiParserProcessor {

  private readonly logger = new Logger(WikiParserProcessor.name);

  @Process('parse-wiki')
  async process(job: Job<WikiPage>) {
    this.logger.log('Start job #' + job.id);
    const page = job.data;
    const doc = wtf(page.text);

    if (fs.existsSync('output/' + job.id)) {
      this.logger.error('!! Job id ' + job.id + ' worked on more than once!!');
    } else {
      fs.writeFileSync('output/' + job.id, '' + job.id);
    }
  }
}