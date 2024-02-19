import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../app";
const router = Router();

router.post(
	"/transactions",
	(req, _res, next) => {
		const reqBodyTransactions = z.object({
			customers_id: z.number(),
			food_item_id: z.number(),
			quantity: z.number(),
		});

		const { success } = reqBodyTransactions.safeParse(req.body);

		if (success) {
			next();
		} else {
			next(badRequest("invalid body"));
		}
	},

	async (req, res, next) => {
		try {
			const valueInsert: {
				customers_id: number;
				food_item_id: number;
				quantity: number;
			} = req.body;
			const connection = await pool.getConnection();

			try {
				await connection.beginTransaction();
				const [row] = await connection.query<ResultSetHeader>(
					`INSERT INTO transactions (customer_id) VALUES ("${valueInsert.customers_id}");`,
				);

				const result = await connection.query(
					`INSERT INTO order_items (transaction.id, food_item_id, quantity) VALUES "${row.insertId}","${valueInsert.food_item_id}","${valueInsert.quantity}");`,
				);
				await connection.commit();
				res.status(200).json({ result: result.at(0) });
			} catch (error) {
				await connection.rollback();
				next(error);
			} finally {
				connection.release();
			}
		} catch (error) {
			next(error);
		}
	},
);

export default router;
