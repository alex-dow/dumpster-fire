import { Module } from '@nestjs/common';
import { XmlParserProcessor } from './xmlParser.processor';
import { BullModule } from '@nestjs/bull';
import { GET_REDIS_URL } from '@dumpster-fire/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'dumpster',
      redis: GET_REDIS_URL()
    })
  ],
  providers: [ XmlParserProcessor ]
})
export class XmlParserModule { }
