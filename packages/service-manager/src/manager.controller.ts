import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from '@nestjs/microservices';
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";


@Controller()
export class ManagerController {
  private readonly logger = new Logger(ManagerController.name);
  constructor(
    @InjectQueue('dumpster') private queue: Queue
  ) { }

  @EventPattern('start-wiki-job')
  async startWikiJob(wikitype: string) {
    try {
      const job = await this.queue.add('parse-xml', 'wikinews');
      this.logger.log('Starting a wiki processing job. Job id: ' + job.id);
      await job.finished();
      this.logger.log('parse-xml finished');
    } catch (err) {
      this.logger.error(err);
    }
  }
}