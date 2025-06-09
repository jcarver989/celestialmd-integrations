import type { AstroIntegration } from "astro";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { AddressInfo } from "net";
import { generateTemplateFile } from "./generateTemplateFile.js";

/** This plugin is used to generate an HTML template file in .celestial/template.html
 *  This file is automatically used by the Celestial editor (https://celestialmd.com)
 *  to create a live preview (e.g. make Markdown files in Astro content collections look
 *  just like your real blog posts when editing in Celestial).
 *
 *  The current implementation is a bit hacky, in that we:
 *
 * 1. Generate a template file in .celestial/template.astro
 * 2. Inject a route into the dev server that serves up the template HTML
 * 3. Fetch the HTML from the dev server and save it to .celestial/template.html
 * 4. Delete the template file from the dev server when it shuts down
 *
 */

export interface Props {
  templateComponentPath: string;
  props?: Record<string, any>;
}

// Path to the generated template file (in celestial directory since it's ephemeral)
const templatePath = "./celestial/template.astro";

// Route that serves up the generated template file
const templateRoute = "/dev/celestial/template";

export default function celestial({
  templateComponentPath,
  props = {},
}: Props): AstroIntegration {
  return {
    name: "celestial",
    hooks: {
      "astro:config:setup": async ({
        command,
        config,
        injectRoute,
        updateConfig,
      }) => {
        if (command !== "dev") return;

        // This is fairly hacky, but we generate a "template file"
        // as an Astro page and inject it into the server.
        const template = generateTemplateFile(
          templatePath,
          templateComponentPath,
          props
        );

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
          const response = await fetch(
            `${getServerUrl(address)}${templateRoute}`
          );
          if (response.ok) {
            const html = await response.text();
            mkdirSync("./celestial", { recursive: true });
            writeFileSync("./celestial/template.html", html, {
              encoding: "utf-8",
            });
          } else {
            console.error(
              `Failed to fetch template: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Error fetching template:", error);
        }
      },

      "astro:server:done": async () => {
        rmSync(templatePath);
      },
    },
  };
}

function getServerUrl({ address, port, family }: AddressInfo): string {
  const host = family === "IPv6" ? `[${address}]` : address;
  return `http://${host}:${port}`;
}
