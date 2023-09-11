import assert from "node:assert";
import { describe, test } from "node:test";
import fastify from "fastify";
import plugin from "../src";

describe("body validation", () => {
  test("should return an error message when the a field is missing", async () => {
    const fastifyInstance = fastify();
    await fastifyInstance.register(plugin);

    const validationConfig = {
      bodySchema: {
        username: {
          type: "string",
          min: 2,
          max: 32,
          trim: true,
          lowercase: true,
          pattern: /^[a-z0-9_\-.]+$/,
          messages: {
            stringPattern: `username can only contain: letters, numbers '-', '.' and '_'`,
          },
        },
        email: { type: "email" },
        $$strict: "remove",
      },
    } as const;

    fastifyInstance.post("/test", { config: { validationConfig } }, () => {
      return { hello: "world" };
    });

    const reply = await fastifyInstance.inject({
      url: "/test",
      method: "post",
      body: {
        username: "anderson",
        email: "not-email",
      },
    });
    const JSONResponse = reply.json();

    assert.equal(reply.statusCode, 400, "status is 400");
    assert.ok(Array.isArray(JSONResponse.errors), "error is an array");
    assert.notEqual(
      JSONResponse.errors.length,
      0,
      "error array contains errors",
    );
  });
});

describe("query validation", () => {
  test("should return an error message when the a field is missing", async () => {
    const fastifyInstance = fastify();
    await fastifyInstance.register(plugin);

    const validationConfig = {
      querySchema: {
        username: {
          type: "string",
          min: 2,
          max: 32,
          trim: true,
          lowercase: true,
          pattern: /^[a-z0-9_\-.]+$/,
          messages: {
            stringPattern: `username can only contain: letters, numbers '-', '.' and '_'`,
          },
        },
        email: { type: "email" },
        $$strict: "remove",
      },
    } as const;

    fastifyInstance.get("/test", { config: { validationConfig } }, () => {
      return { hello: "world" };
    });

    const reply = await fastifyInstance.inject({
      url: "/test",
      method: "get",
      query: {
        email: "not-email",
      },
    });
    const JSONResponse = reply.json();

    assert.equal(reply.statusCode, 400, "status is 400");
    assert.ok(Array.isArray(JSONResponse.errors), "error is an array");
    assert.notEqual(
      JSONResponse.errors.length,
      0,
      "error array contains errors",
    );
  });
});

describe("param validation", () => {
  test("should return an error message when the a field is missing", async () => {
    const fastifyInstance = fastify();
    await fastifyInstance.register(plugin);

    const validationConfig = {
      paramSchema: {
        id: { type: "number", max: 3, convert: true },
        $$strict: "remove",
      },
    } as const;

    fastifyInstance.get("/test/:id", { config: { validationConfig } }, () => {
      return { hello: "world" };
    });

    const reply = await fastifyInstance.inject({
      url: "/test/10",
      method: "get",
    });
    const JSONResponse = reply.json();

    assert.equal(reply.statusCode, 400, "status is 400");
    assert.ok(Array.isArray(JSONResponse.errors), "error is an array");
    assert.notEqual(
      JSONResponse.errors.length,
      0,
      "error array contains errors",
    );
  });
});
