import request from "supertest";
import { app, pool } from "../../app";

afterEach(() => {
	pool.end();
});

test("get customer with id 1", async () => {
	const response = await request(app)
		.get("/customers/1")
		.expect("Content-Type", /json/)
		.expect(200);

	const data: Array<{ id: number }> = response.body.result;
	expect(data.every(({ id }) => id === 1)).toBe(true);
	expect(data.length === 1).toBe(true);
});
