import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

router.get(
	"/foods",
	(req, _res, next) => {
		const reqQueryFoodItems = z.object({
			category: z.coerce.string().optional(),
		});

		const { success } = reqQueryFoodItems.safeParse(req.query);

		if (success) {
			next();
		} else {
			next(badRequest("invalid query"));
		}
	},
	async (req, res, next) => {
		try {
			const connection = await pool.getConnection();

			try {
				const sqlSelect = "SELECT * FROM food_items ";
				const sqlWhere = req.query.category
					? `WHERE food_items.category = "${req.query.category}"`
					: "";

				const result = await connection.query(sqlSelect + sqlWhere);
				res.status(200).json({ result });
			} catch (error) {
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
