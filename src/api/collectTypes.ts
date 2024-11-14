import ts from "typescript";
import * as path from "path";
import * as fs from "fs";

const directoryPath = path.resolve(__dirname, "generated");
const outputFile = path.resolve(__dirname, "generated/types.ts");
const extractedTypes = new Set();
function visitNode(node: ts.Node, sourceFilename: string, typesInFile: any[]) {
  if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
    const typeName = node.name.getText();
    typesInFile.push(typeName);
    extractedTypes.add(node.getText());
  }
  ts.forEachChild(node, (childNode) =>
    visitNode(childNode, sourceFilename, typesInFile)
  );
}
// Extract types from each file
fs.readdirSync(directoryPath).forEach((file) => {
  if (path.extname(file) === ".ts" && path.basename(file) !== "types.ts") {
    const filePath = path.join(directoryPath, file);
    const content = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    const typesInFile: any[] = [];
    visitNode(sourceFile, file, typesInFile);
    // Remove extracted types from the original file
    let modifiedContent = content;
    if (typesInFile.length) {
      const importTypes = typesInFile.map((type) => type);
      const importStatement = `import { ${importTypes.join(
        ", "
      )} } from './types';\n`;
      modifiedContent = importStatement + modifiedContent;
    }
    fs.writeFileSync(filePath, modifiedContent);
  }
});
function removeTypeDefinitions(content: string) {
  // The regex starts capturing from "export type" and goes up until (but not including) the next "export".
  // Positive lookahead is used to ensure the next "export" isn't consumed by the regex match.
  const typePattern = /(export type[\s\S]*)/;
  return content.replace(typePattern, "");
}
fs.readdirSync(directoryPath).forEach((file) => {
  if (path.extname(file) === ".ts" && path.basename(file) !== "types.ts") {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, "utf8");
    content = removeTypeDefinitions(content);
    fs.writeFileSync(filePath, content);
  }
});
// Write all extracted types to types.ts
fs.writeFileSync(outputFile, Array.from(extractedTypes).join("\n"));
