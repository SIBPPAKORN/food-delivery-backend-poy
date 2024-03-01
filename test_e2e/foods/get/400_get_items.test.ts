import request from "supertest";
import { app, pool } from "../../../src/app";

afterAll(() => {
	pool.end();
});

test("the case of searchAz values that do not pass min(3) and max(4)", async () => {
	const response = await request(app)
		.get("/foods")
		.query({ searchAz: "ascppoo" })
		.expect("Content-Type", /json/)
		.expect(400);
	const { errors } = response.body;
	expect(errors[0].message).toContain("invalid query");
});
