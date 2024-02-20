import request from "supertest";
import { app, pool } from "../../../src/app";

afterAll(() => {
	pool.end();
});

test("should create fooditems success 15 item", async () => {
	const response = await request(app).get("/foods").expect("Content-Type", /json/).expect(200);

	expect(response.body.result.length).toBe(15);
});

test("should create fooditems category:Main Courses success 2 item", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ category: "Main Courses" })
		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(2);
});

test("should create fooditems search: t Courses success 2 item", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ search: "t" })

		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(9);
});

test("should create fooditems search: t Courses success 2 item", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ name: "ASC" })

		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(15);
});
