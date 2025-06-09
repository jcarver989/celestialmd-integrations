import { dirname, relative } from "path";

/** Given a templateFilePath (path to the template file we're going to generate) and
 * a templateComponentPath (path to the template component -- e.g. Foo.astro),
 * generate a template file that imports the template component and passes the props to it.
 */
export function generateTemplateFile(
  templateFilePath: string,
  templateComponentPath: string,
  props: Record<string, any>
) {
  const relativePath = relative(
    dirname(templateFilePath),
    templateComponentPath
  );
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

function mapObjectToPropString(object: Record<string, any>): string {
  return Object.entries(object)
    .map(([key, value]) => `${key}=${mapValueToPropString(value)}`)
    .join(" ");
}

function mapValueToPropString(value: any): string {
  if (typeof value === "string") {
    return `"${value.replace(/"/g, '\\"')}"`;
  } else if (typeof value === "number" || typeof value === "boolean") {
    return `{${value}}`;
  } else if (value === null || value === undefined) {
    return `{${value}}`;
  } else if (value instanceof Date) {
    return `{new Date("${value.toISOString()}")}`;
  } else if (typeof value === "object") {
    return `{${JSON.stringify(value)}}`;
  } else {
    return `{${JSON.stringify(value)}}`;
  }
}
