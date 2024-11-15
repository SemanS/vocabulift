import { ConfigFile } from "@rtk-query/codegen-openapi";
import * as path from "path";
import * as fs from "fs";

// Define the base OpenAPI schema location
const swaggerFilePath = path.resolve(__dirname, "./modifiedSchema.json");

// Check if the target directory exists; create it if not
const outputDir = path.resolve(__dirname, "generated");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const schema = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

const paths = schema.paths;
const outputFiles: Record<string, any> = {};

for (const apiPath of Object.keys(paths)) {
  // Split the path and get the first segment after the '/'
  const firstSegment = apiPath.split("/")[1];
  if (!firstSegment) continue; // Skip if the path is not valid

  const outputFileName = `./generated/${firstSegment}.ts`;

  // Initialize the output file configuration if it doesn't exist
  if (!outputFiles[outputFileName]) {
    outputFiles[outputFileName] = {
      filterEndpoints: (endpointName: string, definition: any) => {
        // Filter endpoints that start with the current first segment
        return definition.path.startsWith(`/${firstSegment}`);
      },
      exportName: `${firstSegment}Api`,
      hooks: true,
    };
  }
}

const config: ConfigFile = {
  schemaFile: swaggerFilePath, // Use your local OpenAPI schema file
  apiFile: "./baseApi.ts", // The base RTK Query API slice
  apiImport: "baseApi", // Import the base API, typically exported from baseApi.ts
  outputFiles,
  hooks: true, // Generate hooks for simple integration into React components
};

export default config;
