# AICoffeeChat

A demo student ambassador portal inspired by university chat platforms. Prospective students browse ambassador profiles and book **Virtual Coffee Chats** via [Calendly](https://calendly.com/hansu).

## Demo school

**Harborview University** — fictional program with 8 student ambassadors across engineering, CS, design, and health sciences.

## Features

- Student profile cards with photo, degree, languages, interests, and bio
- Filters by country, degree level, and area of study
- **Virtual Coffee Chat** buttons that open a Calendly scheduling popup
- **Content** page with Instagram & TikTok videos reposted from ambassadors
- All scheduling links point to `https://calendly.com/hansu`

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (or the port shown).

## Customize

- Edit ambassador data in `students.js`
- Add or edit reposted videos in `videos.js` (set `platform`, `thumbnail`, `externalUrl`)
- Change branding colors in `styles.css` (`--brand` variables)
- Update the Calendly URL in `students.js` and `app.js` (`CALENDLY_URL`)
