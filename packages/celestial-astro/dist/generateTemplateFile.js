import { dirname, relative } from "path";
export function generateTemplateFile(templateFilePath, templateComponentPath, props) {
    const relativePath = relative(dirname(templateFilePath), templateComponentPath);
    const importPath = relativePath.startsWith(".")
        ? relativePath
        : `./${relativePath}`;
    const jsxProps = mapObjectToPropString(props);
    return `
---
import Component from "${importPath}";
---

<Component ${jsxProps}>
    <div id="slot"></div>
</Component>
  `;
}
function mapObjectToPropString(object) {
    return Object.entries(object)
        .map(([key, value]) => `${key}=${mapValueToPropString(value)}`)
        .join(" ");
}
function mapValueToPropString(value) {
    if (typeof value === "string") {
        return `"${value.replace(/"/g, '\\"')}"`;
    }
    else if (typeof value === "number" || typeof value === "boolean") {
        return `{${value}}`;
    }
    else if (value === null || value === undefined) {
        return `{${value}}`;
    }
    else if (value instanceof Date) {
        return `{new Date("${value.toISOString()}")}`;
    }
    else if (typeof value === "object") {
        return `{${JSON.stringify(value)}}`;
    }
    else {
        return `{${JSON.stringify(value)}}`;
    }
}
//# sourceMappingURL=generateTemplateFile.js.map