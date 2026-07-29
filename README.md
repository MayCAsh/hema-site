# HEMA and NAIROBABA

This package contains the complete HEMA website and its NAIROBABA section.

## GitHub structure

Upload the contents of this folder to the root of the existing GitHub repository.
The repository should show `app` and `public` as folders beside `package.json`.

Do not upload the ZIP itself.

## Netlify settings

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `22`

The included `netlify.toml` supplies these settings automatically.

## Routes

- HEMA: `/`
- NAIROBABA: `/nairobaba/`

The signup forms remain connected to the existing HEMA Google Apps Script.
