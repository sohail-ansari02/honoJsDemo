import { EmailService } from "@shared/email/email.service";
import { TemplateService } from "@shared/template/template.service";
import { Hono } from "hono";

const app = new Hono();

app.notFound((c) => {
	return c.text("404-NotFound", 404);
});
app.onError((err, c) => {
	console.error(err);
	return c.text(`${err}`, 500);
});

app.get("/", async (c) => {
	try {
		const res = await TemplateService.instance.render("demo", { name: "mj" });
		return c.html(`Hello Hono! <br/> ${res}`);
	} catch (error) {
		return c.text(`${error}`, 500);
	}
});

export default app;
