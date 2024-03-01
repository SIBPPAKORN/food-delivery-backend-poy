import { RowDataPacket } from "mysql2";
import supertest from "supertest";
import { app, pool } from "../../../src/app";
import { restoreDb } from "../../utils/database";

beforeAll(() => {
	restoreDb();
});

afterAll(() => {
	pool.end();
});

test("check data before create transactions", async () => {
	const connection = await pool.getConnection();

	const [data, _metaData] = await connection.query<RowDataPacket[]>("SELECT * FROM transactions");
	expect(data).toHaveLength(0);
	connection.release();
});

test("create transactions", async () => {
	const response = await supertest(app)
		.post("/transactions")
		.send({
			customer_id: 1,
			items: [
				{
					food_item_id: 1,
					quantity: 1,
				},
			],
		})
		.expect("Content-Type", /json/)
		.expect(200);

	expect(response.body.result).toEqual("ok");
});

test("check data after create transactions", async () => {
	const connection = await pool.getConnection();

	const [data, _metaData] = await connection.query<RowDataPacket[]>("SELECT * FROM transactions");
	expect(data).toHaveLength(1);

	connection.release();
});
