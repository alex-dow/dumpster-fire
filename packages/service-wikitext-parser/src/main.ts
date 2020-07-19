import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: "values.env"
  });
}

import { WikiParserModule } from './wikiParser.module';
import { bootstrap } from '@dumpster-fire/common';

bootstrap("wikitext-parser", WikiParserModule);
