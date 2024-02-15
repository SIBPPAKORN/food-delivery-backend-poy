import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../app";
const router = Router();

router.get(
	"/food_items",
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
				const query = "SELECT * FROM food_items ";
				// const value = `WHERE food_items.category = "${req.query.category}"`;
				const connition = query.concat(
					"",
					`WHERE food_items.category = "${req.query.category}"`,
				);
				console.log(connition);
				const result = await connection.query(query, connition);
				res.status(200).json({ result: result.at(0) });
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
