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

export default app;
