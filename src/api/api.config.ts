import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "http://localhost:3000/json",
  apiFile: "./baseApi.ts",
  apiImport: "baseApi",
  outputFiles: {
    "./generated.ts": {
      // Optionally filter endpoints
      filterEndpoints: (endpointName, definition) => true,
      exportName: "generatedApi",
      hooks: true,
    },
  },
  hooks: true,
};

export default config;
