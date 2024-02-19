import request from "supertest";
import { app, pool } from "../../../app";

afterAll(() => {
	pool.end();
});

test("get food_items and reject status 400 for invalid category", async () => {
	const response = await request(app)
		.get("/food_items")
		.query({ a: "f" })
		.expect("Content-Type", /json/)
		.expect(400);
	const { errors } = response.body;
	expect(errors[0].message).toContain("invalid query");
});
