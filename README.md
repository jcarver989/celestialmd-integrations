# Celestial Editor Integrations

This repository contains integrations for the [Celestial editor](https://celestialmd.com), a markdown editor that's tailor-made for engineers.

## Available Integrations

### 🚀 Astro (`@celestialmd/astro`)

The Astro integration allows Celestial to provide a WYSIWYG editing experience for your Markdown and MDX content -- e.g. you can edit `blogPost.md` in Celestial and it will look just like it does on your website, use the same CSS styles etc.

That's the goal at least, this integration is currently "alpha" status.

#### Installation

```bash
npm install @celestialmd/astro
```

#### Usage:

Add the integration to your `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import celestial from "@celestialmd/astro";

export default defineConfig({
  integrations: [
    celestial({
      templateComponentPath: "./src/components/BlogPost.astro",
      // Optional: Pass any props your template component needs
      props: {
        title: "Preview Post",
        date: new Date().toISOString(),
      },
    }),
  ],
});
```

Then run `npm run dev` to start your dev server and the integration will generate the template.

#### Configuration

`templateComponentPath` is a path to an Astro component (`.astro` file), relative to your project's root, that represents the HTML/CSS "wrapper" you want to put around Celestial's editing environment.

For example we might have a `BlogPost.astro` component we want to use to make Celestial's editor match what our published posts look like:

```mdx
---
import "../styles/blog.css";
import BaseLayout from "../layouts/BaseLayout.astro";

interface Props {
  title: string;
  publishDate: Date;
}

const { title, publishDate } = Astro.props;
---

<header>
  <h1>{title}</h1>
  <p>{publishDate.toDateString()}</p>
  <hr />
</header>

<article class="content">
  <slot />
</article>
```

This component _must_ have a `<slot />` in it.

#### How it works:

This integration:

1. Generates `.celestial` directory in your workspace
2. Hooks into the Astro dev server and renders the configured Astro template component to `.celestial/template.html`

Celestial can be configured to automatically load your template by placing a `settings.json` file in `.celestial/settings.json`). Celestial automatically loads this file (if present) when you tell it to open a directory see [docs](https://celestialmd.com/docs) for more info.

## Development

This is a monorepo managed with npm workspaces.

### Setup

```bash
npm install
```

### Building packages

```bash
npx tsc -b
```

### Testing

```bash
cd packages/celestial-astro
npm test
```

## Links

- [Celestial Editor](https://celestialmd.com)
- [Astro Integration on npm](https://www.npmjs.com/package/@celestialmd/astro)
