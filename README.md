# 📝 TakeNote

> Work in progress

A web-based note-taking app with GitHub sync and Markdown support.

## Setup

### Install

```bash
git clone git@github.com:kevinlin-crypto/takenote-working.git
cd takenote-working
npm i
```

### Run

```bash
npm start
```

### Run in Docker

```bash
docker build -t takenote .
docker run -p 80:80 takenote
```

## Features

- [x] Plain text notes with Markdown highlighting and frontmatter metadata
- [x] Add, update, download, temporarily delete and delete notes
- [x] Add, update, and delete categories
- [x] Add notes to categories or mark note as favorite
- [x] Keybinding shortcuts for common actions
- [x] Settings for light/dark mode, sync frequency, and Vim mode
- [ ] Search notes
- [ ] Sync and store notes in GitHub gist (currently local storage)

### Seed data

To seed the app with some test data, paste the contents of `seed.js` into your browser console and refresh.
