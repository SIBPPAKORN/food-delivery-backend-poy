import request from "supertest";
import { app, pool } from "../../../lib/app";

afterEach(() => {
	pool.end();
});

test("get customer and reject status 400", async () => {
	const response = await request(app)
		.get("/customers/xxx")
		.expect("Content-Type", /json/)
		.expect(400);

	const { errors } = response.body;
	expect(errors[0].message).toContain("invalid param");
});
