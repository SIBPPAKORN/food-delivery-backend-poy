import request from "supertest";
import { app, pool } from "../../../lib/app";

afterAll(() => {
	pool.end();
});

test("Test query string validation", async () => {
	const response = await request(app)
		.get("/food_items")
		.query({ a: "invalid_value" })
		.expect("Content-Type", /json/)
		.expect(400);

	const { errors } = response.body;
	expect(errors[0].message).toContain("invalid query");
});
