# Memory Card Game - Change Log

This document tracks all important feature requests and modifications made to the Memory Card Game project.

## Initial Requirements

### Core Game Features
- **Tech Stack**: HTML/CSS/JavaScript (web-based application)
- **Card Content**: Emoji cards for matching pairs
- **Default Grid Size**: 4x4 (originally requested 6x6, later changed to 4x4)
- **Grid Size Options**: Allow users to choose from 3x3 to 9x9
- **Game Mechanics**: Flip cards to find matching pairs
- **Timer**: Start on first card flip, display in MM:SS format
- **Move Counter**: Track number of pair attempts
- **Win Condition**: Show final score (time + moves) with restart option

### Visual Design
- **Grid Layout**: CSS Grid for responsive card board
- **Animations**: Card flip animations using CSS 3D transforms
- **State Management**: JavaScript object for game state
- **Kid-Friendly**: Color scheme and design suitable for children

---

## Feature Modifications

### 1. Matched Cards Display
**Request**: When matched pairs are found, display emojis permanently instead of hiding them with question marks.

**Implementation**:
- Matched cards stay flipped showing the emoji
- Background color changed to grey (instead of green)
- Cards remain in original orientation (no rotation animation)
- Empty placeholder card for odd grid sizes placed at center position for symmetry

### 2. Username Requirement
**Request**: Users must enter a username before starting a game.

**Implementation**:
- Username field marked as required with red asterisk
- Validation prevents game start without username
- Error message displayed if username is empty
- Username field disabled during gameplay

### 3. Timer and Pause Functionality
**Request**: Add pause button for timer. Timer should not auto-start after "Play Again".

**Implementation**:
- Pause button appears next to timer when game starts
- Timer only starts on first card flip
- Timer does not auto-start after "Play Again" button
- Pause/Resume functionality to stop timer and disable card clicks

### 4. Grid Size Management
**Request**: Allow users to change grid size without hitting Reset button. Default to 4x4.

**Implementation**:
- Grid size selector remains enabled during gameplay
- Changing grid size automatically resets game with new size
- Default grid size set to 4x4
- Grid size options expanded from 3x3 to 9x9
- For odd grid sizes (3x3, 5x5, 7x7, 9x9), empty placeholder card placed at center for symmetry

### 5. Game Restart Behavior
**Request**: After clicking "Play Again", do not automatically start the game - allow different user to try.

**Implementation**:
- "Play Again" resets game but doesn't auto-start
- User must click "Start Game" to begin new game
- Username and grid size fields re-enabled after "Play Again"

---

## Statistics and History Features

### 6. User History Tracking
**Request**: Record time and moves after game finished. Allow users to enter username. Store complete play history.

**Implementation**:
- Game history saved to both localStorage and backend server
- History includes: time, moves, grid size, and date
- Files stored in `game_history/` folder in project directory
- Both JSON and CSV formats created for each user

### 7. Statistics and Plots
**Request**: Show statistics and plots for specific user. Use tabs to switch between playing and statistics.

**Implementation**:
- Tab navigation: "Game" and "Statistics" tabs
- Statistics view includes:
  - Summary cards: Total Games, Best Time, Best Moves, Average Time, Average Moves
  - Line charts: Time Over Games, Moves Over Games
  - Game history table with all games
- User selection dropdown to view different users' statistics

### 8. Grid Size Filtering in Statistics
**Request**: Charts should distinguish between grid sizes. Default to most frequently played grid size. Statistics should update immediately when grid size filter changes.

**Implementation**:
- Grid size filter dropdown in Statistics tab
- Filter options: "All Grid Sizes" and individual grid sizes (3x3, 4x4, etc.)
- Default selection: Most frequently played grid size
- Charts and statistics update immediately when filter changes (no delay)
- Chart titles show selected grid size
- Statistics cards and history table filtered by grid size

### 9. Download History
**Request**: Allow users to download history files. Use hybrid approach (download and backend storage). Default format CSV, allow JSON option.

**Implementation**:
- Download button next to Format selector
- Format options: CSV (default) and JSON
- Files downloaded from server or created from localStorage as fallback
- Files saved in `game_history/` folder on server
- Success message displayed after download

---

## Technical Implementation Details

### File Storage
- **Location**: `game_history/` folder in project root
- **Format**: Both JSON and CSV files for each user
- **Naming**: `{username}.json` and `{username}.csv`
- **Storage**: Hybrid approach - localStorage for quick access, backend server for persistent files

### Server Setup
- **Port**: 3000
- **Start Command**: `npm start`
- **Dependencies**: Express, CORS
- **API Endpoints**: 
  - POST `/api/save-history` - Save game history
  - GET `/api/get-history/:username` - Get user history
  - GET `/api/users` - Get all usernames
  - GET `/api/download/:username/:format` - Download history file

### Code Structure
- **HTML**: `index.html` - Game structure with tabs, controls, and modals
- **CSS**: `style.css` - Styling with CSS Grid, animations, and responsive design
- **JavaScript**: `script.js` - Game logic, state management, API integration (~900+ lines)
- **Server**: `server.js` - Express server for history storage
- **Documentation**: `docs/planning.md` and `docs/change_log.md`

---

## Future Modifications

_This section will be updated as new feature requests are made._

---

## Notes

- All game history is stored both in browser localStorage and on the backend server
- The game works offline (localStorage) but requires server for file storage
- Grid size changes during gameplay automatically reset the game
- Statistics update immediately when grid size filter changes (no refresh needed)
- Empty placeholder cards maintain grid symmetry for odd-sized grids

