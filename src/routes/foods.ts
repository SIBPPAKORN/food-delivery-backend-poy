import { badRequest } from "@hapi/boom";
import { Router } from "express";
import mysql from "mysql2/promise";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

const schema = z.object({
	category: z.coerce.string().optional(),
	searchText: z.coerce.string().optional(),
	searchAz: z.string().min(3).max(4).optional(),
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
			const searchText =
				typeof req.query.searchText === "string" ? req.query.searchText : null;
			const searchAz = typeof req.query.searchAz === "string" ? req.query.searchAz : null;

			function categoryConnition(category: string | null): string {
				return category
					? `AND food_items.category = ${mysql.escape(req.query.category)}`
					: "";
			}

			function searchAzConnition(name: string | null): string {
				return searchAz
					? `ORDER BY food_items.name ${searchAz} `
					: "ORDER BY food_items.name ASC";
			}

			function searchTexthConnition(search: string | null): string {
				return search ? `AND food_items.name LIKE ${mysql.escape(`%${search}%`)} ` : "";
			}

			try {
				const sqlSelect = "SELECT *";
				const sqlFrom = "FROM food_items";
				const sqlWhere = `WHERE 1=1 ${categoryConnition(category)}  ${searchTexthConnition(
					searchText,
				)}`;
				const sqlOrderBy = searchAzConnition(searchAz);

				const sqlCommand = `${sqlSelect} ${sqlFrom} ${sqlWhere} ${sqlOrderBy}`;

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
