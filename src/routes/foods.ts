import { badRequest } from "@hapi/boom";
import { Router } from "express";
import mysql from "mysql2/promise";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

const schema = z.object({
	category: z.coerce.string().optional(),
	search: z.coerce.string().optional(),
	name: z.string().min(3).max(4).optional(),
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
			const category = typeof req.query.category === "string" ? req.query.category : null;
			const search = typeof req.query.search === "string" ? req.query.search : null;
			const name = typeof req.query.name === "string" ? req.query.name : null;

			function categoryConnition(category: string | null): string {
				return category
					? `AND food_items.category = ${mysql.escape(req.query.category)}`
					: "";
			}

			function nameConnition(name: string | null): string {
				return name ? `ORDER BY food_items.name ${name} ` : "ORDER BY food_items.name ASC";
			}

			function searchConnition(search: string | null): string {
				return search ? `AND food_items.name LIKE ${mysql.escape(`%${search}%`)} ` : "";
			}

			try {
				const sqlSelect = "SELECT *";
				const sqlFrom = "FROM food_items";
				const sqlWhere = `WHERE 1=1 ${categoryConnition(category)}  ${searchConnition(
					search,
				)}`;
				const sqlOrderBy = nameConnition(name);

				const sqlCommand = `${sqlSelect} ${sqlFrom} ${sqlWhere} ${sqlOrderBy}`;
				console.log(sqlCommand);
				const [data, _metaData] = await connection.query(sqlCommand);
				res.status(200).json({ result: data });
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
