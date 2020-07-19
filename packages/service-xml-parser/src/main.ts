
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: "values.env"
  });
}

import { XmlParserModule } from './xmlParser.module';
import { bootstrap } from '@dumpster-fire/common';

bootstrap("xml-parser", XmlParserModule);
