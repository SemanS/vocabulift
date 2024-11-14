"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var fs = require("fs");
var directoryPath = path.resolve(__dirname, "generated");
var outputFile = path.resolve(__dirname, "generated/types.ts");
var extractedTypes = new Set();
function visitNode(node, sourceFilename, typesInFile) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
        var typeName = node.name.getText();
        typesInFile.push(typeName);
        extractedTypes.add(node.getText());
    }
    ts.forEachChild(node, function (childNode) {
        return visitNode(childNode, sourceFilename, typesInFile);
    });
}
// Extract types from each file
fs.readdirSync(directoryPath).forEach(function (file) {
    if (path.extname(file) === ".ts" && path.basename(file) !== "types.ts") {
        var filePath = path.join(directoryPath, file);
        var content = fs.readFileSync(filePath, "utf8");
        var sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
        var typesInFile = [];
        visitNode(sourceFile, file, typesInFile);
        // Remove extracted types from the original file
        var modifiedContent = content;
        if (typesInFile.length) {
            var importTypes = typesInFile.map(function (type) { return type; });
            var importStatement = "import { ".concat(importTypes.join(", "), " } from './types';\n");
            modifiedContent = importStatement + modifiedContent;
        }
        fs.writeFileSync(filePath, modifiedContent);
    }
});
function removeTypeDefinitions(content) {
    // The regex starts capturing from "export type" and goes up until (but not including) the next "export".
    // Positive lookahead is used to ensure the next "export" isn't consumed by the regex match.
    var typePattern = /(export type[\s\S]*)/;
    return content.replace(typePattern, "");
}
fs.readdirSync(directoryPath).forEach(function (file) {
    if (path.extname(file) === ".ts" && path.basename(file) !== "types.ts") {
        var filePath = path.join(directoryPath, file);
        var content = fs.readFileSync(filePath, "utf8");
        content = removeTypeDefinitions(content);
        fs.writeFileSync(filePath, content);
    }
});
// Write all extracted types to types.ts
fs.writeFileSync(outputFile, Array.from(extractedTypes).join("\n"));
