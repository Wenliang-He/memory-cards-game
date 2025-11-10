# Memory Card Game

A web-based memory card matching game with history tracking and statistics.

## Features

- Memory card matching game with emoji cards
- Customizable grid sizes (4x4, 6x6, 8x8)
- Timer and move counter
- Pause/Resume functionality
- User statistics and history tracking
- Download game history as CSV or JSON
- Backend server for persistent storage

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

3. Open `index.html` in your browser or navigate to `http://localhost:3000`

## File Structure

- `index.html` - Main game interface
- `style.css` - Game styling
- `script.js` - Game logic and API integration
- `server.js` - Backend server for history storage
- `package.json` - Node.js dependencies
- `game_history/` - Directory where game history files are stored (created automatically)

## Game History Storage

Game history is stored in two places:

1. **Browser localStorage** - For quick access and offline functionality
2. **Backend server** - Files saved in `game_history/` folder:
   - `{username}.json` - JSON format
   - `{username}.csv` - CSV format

### Download History

Users can download their game history:
1. Go to the Statistics tab
2. Select a user
3. Click "Load Statistics"
4. Choose format (CSV or JSON, CSV is default)
5. Click "Download History"

Files are saved in the `game_history/` folder on the server and can be downloaded to the user's computer.

## API Endpoints

- `POST /api/save-history` - Save game history
- `GET /api/get-history/:username` - Get game history for a user
- `GET /api/users` - Get all usernames
- `GET /api/download/:username/:format` - Download history file (csv or json)

## Usage

1. Enter a username (required)
2. Select grid size (default: 4x4)
3. Click "Start Game"
4. Click cards to find matching pairs
5. Use "Pause" button to pause/resume the timer
6. View statistics in the Statistics tab
7. Download history files as needed

## Deployment to GitHub Pages

This app can be deployed to GitHub Pages for free hosting. The app works as a static site using localStorage for data storage.

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Enter a repository name (e.g., `memory-card-game`)
5. Choose Public or Private (Public is required for free GitHub Pages)
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

1. Open terminal/command prompt in the project directory
2. Add the GitHub remote (replace `YOUR_USERNAME` and `REPO_NAME` with your values):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   ```
3. Push your code to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```
4. If prompted, enter your GitHub username and password (or use a personal access token)

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"
6. Wait a few minutes for GitHub to build and deploy your site
7. Your site will be available at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Notes

- The app works entirely client-side using localStorage
- No server is needed when deployed to GitHub Pages
- Game history is stored in each user's browser localStorage
- The app automatically detects static hosting and skips server API calls

