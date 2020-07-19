import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: "values.env"
  });
}

import { ManagerModule } from './manager.module';
import { bootstrap } from '@dumpster-fire/common';

bootstrap("manager", ManagerModule);
