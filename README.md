# Fastify Fastest Validator

This plugin provides a simple way to validate incoming requests using the [fastest-validator](https://www.npmjs.com/package/fastest-validator) library.

## Installation

```sh
pnpm install fastify-fastest-validator
```

## Usage

```ts
import fastify from 'fastify';
import fastifyFastestValidator from 'fastify-fastest-validator';

const app = fastify();

app.register(fastifyFastestValidator, {
  validatorOptions: {
    // fastest-validator options
  },
});

app.get('/hello', {
  validationConfig: {
    querySchema: {
      name: { type: 'string' },
    },
  },
}, async (request, reply) => {
  return `Hello, ${request.query.name}!`;
});
```

The sample code above demonstrates how to use the `fastify-fastest-validator` plugin to validate incoming requests. The `validationConfig` object is used to specify the schema for validating the request parameters. If any validation errors occur, a `400 Bad Request` response is returned with an array of error messages.

## Options

The plugin accepts the following options:

- `validatorOptions`: Options to pass to the fastest-validator constructor.
