import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../app";
const router = Router();

router.post(
	"/transactions",
	(req, _res, next) => {
		const reqParamCustomer = z.object({
			customers_id: z.number(),
			food_item_id: z.number(),
			quantity: z.number(),
		});

		const { success } = reqParamCustomer.safeParse(req.params);

		if (success) {
			next();
		} else {
			next(badRequest("invalid param"));
		}
	},

	async (req, res, next) => {
		try {
			const {
				customers_id: reqBodyCustomerId,
				food_item_id: reqBodyFoodItemId,
				quantity: reqBodyQuantity,
			} = req.body;
			const connection = await pool.getConnection();

			try {
				await connection.beginTransaction();
				const [row] = await connection.query<ResultSetHeader>(
					`INSERT INTO transactions (customers_id) VALUES ("${reqBodyCustomerId}");`,
				);
				const result = await connection.query(
					`INSERT INTO order_items (transactions_id, food_items_id, quantity) VALUES "${row.insertId}","${reqBodyFoodItemId}","${reqBodyQuantity}")`,
				);
				await connection.commit();
				res.status(200).json({ result: "INSERT transactions success" });
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
