import { badRequest } from "@hapi/boom";
import { Router } from "express";
import mysql from "mysql2/promise";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

const schema = z.object({
	category: z.coerce.string().optional(),
});

router.get(
	"/foods",
	(req, _res, next) => {
		const { success } = schema.safeParse(req.query);

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
				const sqlSelect = "SELECT *";
				const sqlFrom = " FROM food_items";
				const sqlWhere = req.query.category
					? `WHERE food_items.category = ${mysql.escape(req.query.category)}`
					: "";
				const sqlCommand = `${sqlSelect} ${sqlFrom} ${sqlWhere}`;

				const [data, _metaData] = await connection.query(sqlCommand);
				res.status(200).json({ data });
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
