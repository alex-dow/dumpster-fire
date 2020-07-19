FROM node:14.5.0-alpine

RUN mkdir -p /opt/dumpster-fire/packages/service-manager
COPY ../common /opt/dumpster-fire/packages
COPY ../../package.json /opt/dumpster-fire

WORKDIR /opt/dumpster-fire/packages/service-manager
COPY package.json .
COPY src .
COPY tsconfig.json .

RUN yarn install

CMD ["yarn", "start:dev"]

