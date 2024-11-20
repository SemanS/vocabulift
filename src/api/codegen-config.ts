import { ConfigFile } from "@rtk-query/codegen-openapi";
import * as path from "path";
import { fileURLToPath } from "url";

// Define __dirname in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: ConfigFile = {
  schemaFile: path.resolve(
    __dirname,
    "./src/api/generated/modifiedSchema.json"
  ),
  apiFile: "./baseApi.ts",
  apiImport: "baseApi",
  outputFiles: {
    [path.resolve(__dirname, "./generated/endpoints.ts")]: {
      exportName: "generatedApi",
      hooks: true,
      splitByTags: true,
    },
  },
  hooks: true,
};

export default config;
