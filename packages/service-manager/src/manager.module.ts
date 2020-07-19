import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ManagerController } from './manager.controller';
import { GET_REDIS_URL } from '@dumpster-fire/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'dumpster',
      redis: GET_REDIS_URL()
    })
  ],
  controllers: [ ManagerController ]
})
export class ManagerModule { }