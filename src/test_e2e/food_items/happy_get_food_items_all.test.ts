import request from "supertest";
import { app, pool } from "../../app";

afterAll(() => {
	pool.end();
});

test("should create fooditems success 15 item", async () => {
	const response = await request(app)
		.get("/food_items")
		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(15);
});

test("should create fooditems category:Main Courses success 2 item", async () => {
	const response = await request(app)
		.get("/food_items")
		.query({ category: "Main Courses" })

		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(2);
});
