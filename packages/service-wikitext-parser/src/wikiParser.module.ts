import { Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport
} from '@nestjs/microservices';
import { WikiParserProcessor } from './wikiParser.processor';
import { GET_REDIS_URL } from '@dumpster-fire/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({

      name: 'dumpster',
      redis: GET_REDIS_URL()
    })
  ],
  providers: [ WikiParserProcessor ]
})
export class WikiParserModule { }
