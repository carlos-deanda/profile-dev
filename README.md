# Carlos de Anda — Portfolio

My personal site: projects, experience and how to reach me.

**Stack:** React 19 · Vite · Tailwind CSS v4 · deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Editing content

All the text lives in [`src/data/profile.js`](src/data/profile.js), not in the components.

- **Add a project:** add an object to `projects` with `group: 'software'` or `'hardware'`.
  For a screenshot, import the image at the top of the file and set `image` and `imageAlt`
  on the project. Without them the card shows a gray placeholder.
- **Experience, stats, skills, contact links:** the arrays and objects in the same file.
- **Accent color:** `--color-accent` in [`src/index.css`](src/index.css).

## Structure

```
src/
  data/profile.js      # all site content
  components/          # one component per section + shared ui.jsx
  assets/              # optimized images (webp)
api/server.js          # Vercel function for a contact form (not used by the current design)
```
