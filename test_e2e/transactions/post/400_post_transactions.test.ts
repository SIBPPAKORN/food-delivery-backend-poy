import { RowDataPacket } from "mysql2";
import supertest from "supertest";
import { app, pool } from "../../../src/app";

afterAll(() => {
	pool.end();
});

test("check data before create transactions", async () => {
	const connection = await pool.getConnection();

	const [data, _metaData] = await connection.query<RowDataPacket[]>("SELECT * FROM transactions");
	expect(data).toHaveLength(2);
	connection.release();
});

test("create transactions By entering a data string", async () => {
	const response = await supertest(app)
		.post("/transactions")
		.send({
			customer_id: "p",
			items: [
				{
					food_item_id: "6",
					quantity: "i",
				},
			],
		})
		.expect("Content-Type", /json/)
		.expect(400);

	const { errors } = response.body;
	expect(errors[0].message).toContain("invalid body");
});

test("check data after create transactions", async () => {
	const connection = await pool.getConnection();

	const [data, _metaData] = await connection.query<RowDataPacket[]>("SELECT * FROM transactions");
	expect(data).toHaveLength(2);

	connection.release();
});
