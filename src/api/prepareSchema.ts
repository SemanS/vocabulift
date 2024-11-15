import axios from "axios";
import * as fs from "fs";
import * as path from "path";

// Remove __dirname and __filename
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Use process.cwd() instead
const outputDir = path.resolve(process.cwd(), "generated");
// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// URL of your OpenAPI schema
const schemaUrl = "http://localhost:3000/json";

// Function to fetch the schema from the URL
async function fetchSchema(): Promise<any> {
  try {
    const response = await axios.get(schemaUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching schema from ${schemaUrl}:`, error);
    throw new Error("Failed to fetch schema");
  }
}

// Function to get the first word in the path
function getFirstWord(path: string): string {
  const match = path.match(/^\/([^\/]+)/);
  return match ? match[1] : "default";
}

(async () => {
  // Fetch the OpenAPI schema
  const schema = await fetchSchema();

  // Add tags to each operation based on the first word in the path
  for (const pathKey of Object.keys(schema.paths)) {
    const pathItem = schema.paths[pathKey];
    const tag = getFirstWord(pathKey);

    // For each HTTP method in the path
    for (const method of Object.keys(pathItem)) {
      const operation = pathItem[method];
      if (operation && typeof operation === "object") {
        if (!operation.tags) {
          operation.tags = [];
        }
        // Add the tag if it's not already present
        if (!operation.tags.includes(tag)) {
          operation.tags.push(tag);
        }
      }
    }
  }

  // Ensure the output directory exists
  const outputDir = path.resolve(__dirname, "../generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save the modified schema to a local file
  const outputPath = path.resolve(__dirname, "./modifiedSchema.json");
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2), "utf-8");

  console.log(`Modified schema with tags saved to ${outputPath}`);
})();
