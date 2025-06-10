# Celestial Editor Integrations

This repository contains integrations for the [Celestial editor](https://celestialmd.com), a markdown editor designed specifically for engineers that provides a WYSIWYG editing experience.

## Available Integrations

### 🚀 Astro (`@celestialmd/astro`)

The Astro integration allows Celestial to provide a WYSIWYG editing experience for your Markdown and MDX content. This means you can edit files like `blogPost.md` in Celestial and see them rendered exactly as they appear on your website, using the same CSS styles and layout.

> **Note:** This integration is currently in "alpha" status and under active development.

#### Prerequisites

- Node.js and npm installed
- An existing Astro project
- Basic familiarity with Astro components

#### Installation

```bash
npm install @celestialmd/astro
```

#### Basic Setup

1. **Add the integration to your `astro.config.mjs`:**

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

2. **Start your development server:**

```bash
npm run dev
```

The integration will automatically generate the necessary template files.

#### Configuration

The `templateComponentPath` option specifies the path to an Astro component (`.astro` file) that serves as the HTML/CSS "wrapper" for Celestial's editing environment. This component determines how your content looks in the editor.

**Example template component (`BlogPost.astro`):**

```astro
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

**Important:** Your template component must include a `<slot />` element where the markdown content will be rendered.

#### Celestial Editor Configuration

To complete the setup, create a configuration file at `.celestial/settings.json` in your project root:

```json
{
  "appearance": {
    "template": "template.html"
  },
  "assets": {
    "previewBaseUrl": "http://localhost:4321"
  }
}
```

**Configuration options:**

- `appearance.template`: Tells Celestial to use your custom HTML/CSS template for the editor
- `assets.previewBaseUrl`: Prefixes image URLs in the live preview (e.g., transforms `/foo.png` to `http://localhost:4321/foo.png` for preview only - your markdown files remain unchanged)

Celestial will automatically load this configuration when you open your project directory.

For more detailed configuration options, see the [official documentation](https://celestialmd.com/docs/settings).

#### How It Works

Behind the scenes, this integration:

1. Creates a `.celestial` directory in your project workspace
2. Integrates with the Astro development server
3. Renders your specified template component to `.celestial/template.html`
4. Provides Celestial with the necessary files to match your website's appearance

## Development

This repository is a monorepo managed with npm workspaces.

### Setup

```bash
npm install
```

### Building Packages

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
- [Official Documentation](https://celestialmd.com/docs)
- [Astro Integration on npm](https://www.npmjs.com/package/@celestialmd/astro)
