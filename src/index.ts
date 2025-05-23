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
	return c.text(
		"404 - Sorry, the resource you're looking for was not found. Maybe it never existed?",
		404,
	);
});
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(
		"🔥 Server Error 500: The server caught fire! (Not literally... yet.) Please stand by while we call the digital firefighters.",
		500,
	);
});

export default app;
