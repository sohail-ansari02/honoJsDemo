import { ApiResponse } from "@core/classes/apiResponse";
import { HttpStatus } from "@core/enums/http-status.enum";
import { templateService } from "@core/services/template/template.service";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.notFound((c) => {
	return ApiResponse.error("NOT FOUND", HttpStatus.NOT_FOUND).toResponse(c);
});
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return ApiResponse.error(err.message, err.status).toResponse(c);
	}

	return ApiResponse.error(
		err instanceof Error ? err.message : "Internal Server Error",
		HttpStatus.INTERNAL_SERVER_ERROR,
	).toResponse(c);
});

app.get("/", async (c) => {
	// return ApiResponse.success({}).toResponse(c);
	try {
		const res = await templateService.render("order-recieved", "email", {
			name: "abcd",
		});
		return c.html(`Hello Hono! <br/> ${res}`);
	} catch (error) {
		throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default app;
