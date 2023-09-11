import Validator, { ValidationError } from "fastest-validator";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  preValidationHookHandler,
} from "fastify";
import fp from "fastify-plugin-ts";
import { PluginOptions } from "./types";

function fastifyFastestValidator(
  fastify: FastifyInstance,
  config: FastifyPluginOptions & PluginOptions,
  done: (err?: Error) => void,
): void {
  const validator = new Validator(config.validatorOptions);

  fastify.addHook("onRoute", (routeOptions) => {
    const validationConfig = routeOptions.config?.validationConfig;

    if (!validationConfig) {
      return;
    }

    const bodyChecker = validationConfig.bodySchema
      ? validator.compile(validationConfig.bodySchema)
      : undefined;

    const queryChecker = validationConfig.querySchema
      ? validator.compile(validationConfig.querySchema)
      : undefined;

    const paramChecker = validationConfig.paramSchema
      ? validator.compile(validationConfig.paramSchema)
      : undefined;

    function validateSchema(
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void,
    ): void {
      const errors: ValidationError[] = [];

      const bodyResult = bodyChecker?.(request.body);
      const queryResult = queryChecker?.(request.query);
      const paramsResult = paramChecker?.(request.params);

      for (const result of [bodyResult, queryResult, paramsResult]) {
        if (Array.isArray(result)) {
          errors.push(...result);
        }
      }

      if (errors.length) {
        reply.status(400).send({
          message: "Bad Request",
          errors,
        });
      }

      done();
    }

    const existingPreValidationHooks =
      (routeOptions.preValidation as preValidationHookHandler[]) || [];

    routeOptions.preValidation = [
      ...existingPreValidationHooks,
      validateSchema,
    ];
  });

  done();
}

export default fp(fastifyFastestValidator);
module.exports = fp(fastifyFastestValidator);
module.exports.default = fp(fastifyFastestValidator);
