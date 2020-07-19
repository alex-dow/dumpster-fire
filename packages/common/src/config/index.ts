export function GET_REDIS_URL(): string | undefined {
  return process.env['DUMPSTER_REDIS_URL'];
}

export function GET_PORT(): number | undefined {
  return 9000;
}