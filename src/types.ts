import {
  ValidationSchema,
  ValidatorConstructorOptions,
} from "fastest-validator";

export type ValidationConfig = {
  bodySchema?: ValidationSchema;
  requestSchema?: ValidationSchema;
  querySchema?: ValidationSchema;
  paramSchema?: ValidationSchema;
};

export type PluginOptions = {
  validatorOptions?: ValidatorConstructorOptions;
};

declare module "fastify" {
  interface FastifyContextConfig {
    validationConfig?: ValidationConfig;
  }
}
