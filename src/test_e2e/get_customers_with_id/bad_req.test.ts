import request from "supertest";
import { app, pool } from "../../app";

afterEach(() => {
	pool.end();
});

test("get customer and reject status 400", async () => {
	const response = await request(app)
		.get("/customers/xxx")
		.expect("Content-Type", /json/)
		.expect(400);
});
