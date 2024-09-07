import { type LoggerOptions, destination, pino, stdTimeFunctions } from "pino";

const options: LoggerOptions = {
  enabled: true,
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    bindings: () => ({}),
  },
  transport: {
    target: "pino-pretty",
  },
};

const KiB = 2 ** 10;

const stream = destination({
  sync: false,
  minLength: 8 * KiB,
});

export const logger = pino(options, stream);
