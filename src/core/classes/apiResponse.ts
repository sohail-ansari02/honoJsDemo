import { HttpStatus } from "@core/enums/http-status.enum";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
export type Pagination = {
	page: number;
	limit: number;
	total: number;
};
export type Meta = {
	timestamp?: number;
	version?: string;
	pagination?: Pagination;
};

export class ApiResponse<T> {
	private constructor(
		public readonly success: boolean,
		public readonly status: ContentfulStatusCode,
		public readonly message: string,
		public readonly data: T | null = null,
		public readonly meta: Meta = {},
		public readonly errors: string[] = [],
	) {
		throw new Error(
			"ApiResponse: for best pratces I made constructor private, so developer will always use statis method `success` and `error`",
		);
	}

	static success<T>(
		data: T,
		message = "Success",
		status: ContentfulStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
		meta?: Meta,
	): ApiResponse<T> {
		return new ApiResponse(true, status, message, data, {
			timestamp: Date.now(),
			...meta,
		});
	}

	static error(
		message: string,
		status: ContentfulStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
		meta?: Meta,
	): ApiResponse<null> {
		return new ApiResponse(false, status, message, null, {
			timestamp: Date.now(),
			...meta,
		});
	}

	toResponse(c: Context): Response {
		return c.json(this, this.status);
	}
}
