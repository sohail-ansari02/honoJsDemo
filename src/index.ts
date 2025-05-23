import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text(`Hello Hono! ${Bun.env.PORTT}`);
});

export default app;
