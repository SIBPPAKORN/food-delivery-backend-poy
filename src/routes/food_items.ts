import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../app";
const router = Router();

router.get(
	"/food_items",
	(req, _res, next) => {
		const reqQueryFoodTtems = z.object({
			category: z.coerce.string().optional(),
		});

		const { success } = reqQueryFoodTtems.safeParse(req.query);

		if (success) {
			next();
		} else {
			next(badRequest("invalid param"));
		}
	},
	async (req, res, next) => {
		try {
			const connection = await pool.getConnection();

			try {
				const result = await connection.query(
					`SELECT * FROM food_items WHERE food_items.category = "${req.query.category}"`,
				);
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
