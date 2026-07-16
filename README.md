# HEMA

HEMA is an interactive community website for new mums, new dads, co-parents and parents arriving together.

## Deploy to Netlify

### Recommended method

1. Unzip this package.
2. Upload the folder to a new GitHub repository.
3. In Netlify, select **Add new project** and then **Import an existing project**.
4. Connect the repository.
5. Netlify should detect Next.js automatically. Confirm:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `22`
6. Select **Deploy**.

Netlify automatically applies its maintained OpenNext adapter. Do not install or pin the legacy `@netlify/plugin-nextjs` package.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included

- Responsive desktop and mobile layouts.
- Reduced-motion accessibility support.
- Interactive Mum, Dad and Both frequencies.
- Night-to-morning scroll journey.
- Interactive 3AM neighbourhood wall.
- Original HEMA parent photography.
- Parent activity signals and micro-messages.
- Optional ambient room tone.
- Pulsing HEMA signal mark.

## Notes

- The email form currently shows an on-page confirmation and does not send data to a mailing platform.
- The 3AM Wall notes are stored only for the visitor's current browser session and are not saved to a database.
- Connect these forms to your preferred email and community platforms before launch.
