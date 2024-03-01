import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

const orderItems = z.object({ food_item_id: z.number(), quantity: z.number() });
const reqBodyTransactions = z.object({
	customer_id: z.number(),
	items: z.array(orderItems).min(1),
});

type OrderItems = z.infer<typeof orderItems>;

router.post(
	"/transactions",
	(req, _res, next) => {
		const { success } = reqBodyTransactions.safeParse(req.body);

		if (success) {
			next();
		} else {
			next(badRequest("invalid body"));
		}
	},

	async (req, res, next) => {
		try {
			const connection = await pool.getConnection();

			try {
				await connection.beginTransaction();
				const [row] = await connection.query<ResultSetHeader>(
					`INSERT INTO transactions (customer_id) VALUES (${connection.escape(
						req.body.customer_id,
					)});`,
				);

				req.body.items.map(async (item: OrderItems) => {
					await connection.query(
						`INSERT INTO order_items  VALUES ( ${connection.escape(
							row.insertId,
						)},${connection.escape(item.food_item_id)},${connection.escape(
							item.quantity,
						)});`,
					);
				});

				await connection.commit();
				res.status(200).json({ result: "ok" });
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
