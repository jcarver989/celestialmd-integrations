import { mkdirSync, rmSync, writeFileSync } from "fs";
import { generateTemplateFile } from "./generateTemplateFile.js";
const templatePath = "./celestial/template.astro";
const templateRoute = "/dev/celestial/template";
export default function celestial({ templateComponentPath, props = {}, }) {
    return {
        name: "celestial",
        hooks: {
            "astro:config:setup": async ({ command, config, injectRoute, updateConfig, }) => {
                if (command !== "dev")
                    return;
                const template = generateTemplateFile(templatePath, templateComponentPath, props);
                mkdirSync("./celestial", { recursive: true });
                writeFileSync(templatePath, template, {
                    encoding: "utf-8",
                });
                injectRoute({
                    pattern: templateRoute,
                    entrypoint: templatePath,
                });
            },
            "astro:server:start": async ({ address }) => {
                try {
                    const response = await fetch(`${getServerUrl(address)}${templateRoute}`);
                    if (response.ok) {
                        const html = await response.text();
                        mkdirSync("./celestial", { recursive: true });
                        writeFileSync("./celestial/template.html", html, {
                            encoding: "utf-8",
                        });
                    }
                    else {
                        console.error(`Failed to fetch template: ${response.status} ${response.statusText}`);
                    }
                }
                catch (error) {
                    console.error("Error fetching template:", error);
                }
            },
            "astro:server:done": async () => {
                rmSync(templatePath);
            },
        },
    };
}
function getServerUrl({ address, port, family }) {
    const host = family === "IPv6" ? `[${address}]` : address;
    return `http://${host}:${port}`;
}
//# sourceMappingURL=index.js.map