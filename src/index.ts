import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

// Simple recursive Fibonacci (not efficient for large numbers)
function fibonacci(n: number): number {
	if (n < 0) return 0;
	if (n === 0) return 0;
	if (n === 1) return 1;
	return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/fibonacci/:n", (c) => {
	const n = Number.parseInt(c.req.param("n"));

	if (Number.isNaN(n) || n < 0) {
		return c.json(
			{ error: "Please provide a valid non-negative integer." },
			400,
		);
	}

	const result = fibonacci(n);
	return c.json({ input: n, fibonacci: result });
});

export default app;
