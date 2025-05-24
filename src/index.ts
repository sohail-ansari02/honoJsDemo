import { EmailService } from "@shared/email/email.service";
import { Hono } from "hono";

const app = new Hono();

app.notFound((c) => {
	return c.text("404-NotFound", 404);
});
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(`${err}`, 500);
});

app.get("/", async (c) => {
	try {
		const es = EmailService.instance;
		// await es.getTemplate("", {});

		await es.sendEmail({
			subject: "test",
			to: "syansari02@gmail.com",
			html: "hi",
		});
		return c.text(`Hello Hono! ${Bun.env.PORT}`);
	} catch (error) {
		return c.text(`${error}`, 500);
	}
});

export default app;
