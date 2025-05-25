import { HTTPException } from "hono/http-exception";

export class FileUtil {
	static async readFile(filePath: string) {
		try {
			const file = Bun.file(filePath);
			const content = await file.text();
			return content;
		} catch {
			throw new HTTPException(500, {
				message: `Failed to read file: ${filePath}}`,
			});
		}
	}
}
