import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import z from "zod";

const app = new Hono().basePath("/api");

app.get(
  "/hello",
  zValidator("query", z.object({ name: z.string().optional() })),
  (c) => {
    const { name } = c.req.valid("query");
    return c.json({
      message: `Hello ${name ?? "World"} from faktuur.io API!`,
    });
  }
);

export const GET = handle(app);

export const POST = handle(app);
