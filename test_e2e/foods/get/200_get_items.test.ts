import request from "supertest";
import { app, pool } from "../../../src/app";

afterAll(() => {
	pool.end();
});

test("should return all foods", async () => {
	const response = await request(app).get("/foods").expect("Content-Type", /json/).expect(200);

	expect(response.body.result.length).toBe(15);
});

test("should return only Main Courses", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ category: "Main Courses" })
		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(2);
});

test("should return  Everything with the letter t ", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ search: "t" })

		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(9);
});

test("should return initials a-z", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ name: "ASC" })

		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result.length).toBe(15);
});
