<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component file naming

- Component files should be named `index.tsx`, unless the folder already holds a lot of other unrelated files — this keeps imports shorter (`import Foo from './Foo'` instead of `'./Foo/Foo'`).
- The corresponding stylesheet should be named `styles.module.css`.
- Don't create a nested `ui` folder if `ui` would be the only thing inside its parent folder — skip the redundant level of nesting.
