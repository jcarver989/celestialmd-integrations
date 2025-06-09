import { defineConfig } from "astro/config";
import celestial from "@celestialmd/astro";

export default defineConfig({
  integrations: [
    celestial({
      templateComponentPath: "./src/components/TestLayout.astro",
      props: {
        title: "Integration Test",
        description: "Testing the Celestial integration",
      },
    }),
  ],
});
