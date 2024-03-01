import { execSync } from "child_process";
import path from "path";

export const isUsingWindows = process.platform === "win32";

export function isCommandExist(command: string): boolean {
	try {
		return !!execSync(`${isUsingWindows ? "where" : "which"} ${command}`);
	} catch (error) {
		return false;
	}
}

export function execSingleSqlScript(absPath: string): void {
	if (!isCommandExist("mysql")) {
		console.error("mysql-cli not found. please install mysql-cli.");

		return;
	}

	execSync(
		`mysql --user=poy --password=poy --host=127.0.0.1 --port=3306 < ${absPath} 2> /dev/null`,
	);
}

export function execSqlScript(absPathList: string[]): void {
	absPathList.forEach(execSingleSqlScript);
}

export function restoreDb(): void {
	execSqlScript([
		path.join(__dirname, "../../../../devbc-fooddb-mysql/database/0_fooddb.structure.sql"),
		path.join(__dirname, "../../../../devbc-fooddb-mysql/database/1_fooddb.seed.sql"),
	]);
}
