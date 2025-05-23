import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { EmailService } from "./shared/email/email.service";

const app = new Hono();

app.get("/", async (c) => {
	const es = EmailService.instance;
	await es.sendEmail({
		subject: "test",
		to: "syansari02@gmail.com",
		html: "hi",
	});
	return c.text(`Hello Hono! ${Bun.env.PORT}`);
});

app.notFound((c) => {
	return c.text("404-NotFound", 404);
});
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("500-ServerError", 500);
});

if (process.env.ENV === "DEV") {
	// Serve OpenAPI JSON at /doc
	app.get("/doc", {
		openapi: "3.1.0",
		info: {
			title: "My API",
			version: "1.0.0",
		},
	});
	app.get("/ui", swaggerUI({ url: "/doc" }));
}

export default app;
