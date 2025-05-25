import { TemplateService } from "@shared/template/template.service";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.notFound((c) => {
	return c.text("404-NotFound", 404);
});
app.onError((err, c) => {
	console.log(err);
	if (err instanceof HTTPException) {
		return c.text(` ${err.status} - custom err-  ${err}`, err.status);
	}
	return c.text("Internal Server Error", 500);
});

app.get("/", async (c) => {
	try {
		const res = await TemplateService.instance.render("demo", { name: "mj" });
		return c.html(`Hello Hono! <br/> ${res}`);
	} catch (error) {
		throw new HTTPException(500, {
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default app;
