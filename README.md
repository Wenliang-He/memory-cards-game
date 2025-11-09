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

