import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { GET_REDIS_URL, GET_PORT } from '../config';
const pkg = require('../../package.json');

export async function bootstrap(serviceName: string, module: any): Promise<INestMicroservice> {

  const app = await NestFactory.createMicroservice(module, {
    transport: Transport.REDIS,
    options: {
      url: GET_REDIS_URL()
    }
  });

  return new Promise((resolve, reject) => {
    app.listen(() => {
      resolve(app);
    });
  })

}