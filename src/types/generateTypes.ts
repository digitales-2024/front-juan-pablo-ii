import { execSync } from "child_process";
import * as path from "path";

const SWAGGER_URL = "http://localhost:5000/api-json"; // Ajusta esto a la URL de tu backend
const OUTPUT_PATH = path.join(process.cwd(), "src/types/api.ts");

async function generateTypes() {
	try {
		execSync(`pnpx openapi-typescript ${SWAGGER_URL} -o ${OUTPUT_PATH}`, {
			stdio: "inherit",
		});
		console.log("✅ Tipos generados exitosamente");
	} catch (error) {
		console.error("❌ Error generando tipos:", error);
		process.exit(1);
	}
}

generateTypes();
