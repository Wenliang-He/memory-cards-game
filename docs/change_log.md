# Memory Card Game - Change Log

This document tracks all important feature requests and modifications made to the Memory Card Game project.

## Initial Requirements
**Date**: 2025-11-09 (Initial Implementation)

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
**Date**: 2025-11-09  
**Request**: When matched pairs are found, display emojis permanently instead of hiding them with question marks.

**Implementation**:
- Matched cards stay flipped showing the emoji
- Background color changed to grey (instead of green)
- Cards remain in original orientation (no rotation animation)
- Empty placeholder card for odd grid sizes placed at center position for symmetry

### 2. Username Requirement
**Date**: 2025-11-09  
**Request**: Users must enter a username before starting a game.

**Implementation**:
- Username field marked as required with red asterisk
- Validation prevents game start without username
- Error message displayed if username is empty
- Username field disabled during gameplay

### 3. Timer and Pause Functionality
**Date**: 2025-11-09  
**Request**: Add pause button for timer. Timer should not auto-start after "Play Again".

**Implementation**:
- Pause button appears next to timer when game starts
- Timer only starts on first card flip
- Timer does not auto-start after "Play Again" button
- Pause/Resume functionality to stop timer and disable card clicks

### 4. Grid Size Management
**Date**: 2025-11-09  
**Request**: Allow users to change grid size without hitting Reset button. Default to 4x4.

**Implementation**:
- Grid size selector remains enabled during gameplay
- Changing grid size automatically resets game with new size
- Default grid size set to 4x4
- Grid size options expanded from 3x3 to 9x9
- For odd grid sizes (3x3, 5x5, 7x7, 9x9), empty placeholder card placed at center for symmetry

### 5. Game Restart Behavior
**Date**: 2025-11-09  
**Request**: After clicking "Play Again", do not automatically start the game - allow different user to try.

**Implementation**:
- "Play Again" resets game but doesn't auto-start
- User must click "Start Game" to begin new game
- Username and grid size fields re-enabled after "Play Again"

---

## Statistics and History Features

### 6. User History Tracking
**Date**: 2025-11-09  
**Request**: Record time and moves after game finished. Allow users to enter username. Store complete play history.

**Implementation**:
- Game history saved to both localStorage and backend server
- History includes: time, moves, grid size, and date
- Files stored in `game_history/` folder in project directory
- Both JSON and CSV formats created for each user

### 7. Statistics and Plots
**Date**: 2025-11-09  
**Request**: Show statistics and plots for specific user. Use tabs to switch between playing and statistics.

**Implementation**:
- Tab navigation: "Game" and "Statistics" tabs
- Statistics view includes:
  - Summary cards: Total Games, Best Time, Best Moves, Average Time, Average Moves
  - Line charts: Time Over Games, Moves Over Games
  - Game history table with all games
- User selection dropdown to view different users' statistics

### 8. Grid Size Filtering in Statistics
**Date**: 2025-11-09  
**Request**: Charts should distinguish between grid sizes. Default to most frequently played grid size. Statistics should update immediately when grid size filter changes.

**Implementation**:
- Grid size filter dropdown in Statistics tab
- Filter options: "All Grid Sizes" and individual grid sizes (3x3, 4x4, etc.)
- Default selection: Most frequently played grid size
- Charts and statistics update immediately when filter changes (no delay)
- Chart titles show selected grid size
- Statistics cards and history table filtered by grid size

### 9. Download History
**Date**: 2025-11-09  
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

---

## Recent Improvements (Latest Session)
**Date**: 2025-11-09

### 10. Statistics Username List Management
**Date**: 2025-11-09  
**Request**: After playing a game, username should appear in statistics dropdown. Username selection should be preserved when switching tabs.

**Implementation**:
- Username list updates immediately after a game is saved
- Username selection is preserved when switching between Game and Statistics tabs
- Statistics automatically load when returning to Statistics tab if a user was previously selected
- Username list prioritizes localStorage (most reliable) and merges with server data
- Username list refreshes when switching to Statistics tab

### 11. Auto-Load Statistics and Grid Size Default
**Date**: 2025-11-09  
**Request**: When a user is selected, automatically load statistics. Default to most frequently played grid size (biggest if tied).

**Implementation**:
- Statistics automatically load when a user is selected from dropdown (no need to click "Load Statistics")
- Default grid size filter set to most frequently played grid size
- If there's a tie in frequency, defaults to the biggest grid size
- Grid size filter selection is preserved when loading statistics
- Statistics update immediately when grid size filter changes

### 12. Delete Account Functionality
**Date**: 2025-11-09  
**Request**: Add Delete Account button to allow deleting a selected username and all their game history.

**Implementation**:
- Delete Account button appears next to Load Statistics button when a user is selected
- Confirmation dialog prevents accidental deletion
- Deletes user data from both localStorage and server files
- Removes username from dropdown after deletion
- Clears statistics display after deletion
- Button styled with red danger color scheme

### 13. Case-Sensitive Username Support
**Date**: 2025-11-09  
**Request**: Usernames should distinguish between uppercase and lowercase letters (e.g., "Wen" and "wen" should be different users).

**Implementation**:
- **Filename Encoding**: Implemented case encoding for filenames on Windows (case-insensitive filesystem)
  - Uppercase letters encoded as `_` + lowercase (e.g., "W" → "_w")
  - "Wen" becomes `w_en.json`, "wen" becomes `wen.json`
  - These are treated as separate files even on Windows
- **Server-Side Verification**: Server verifies username matches exactly (case-sensitive) before returning data
- **Username Storage**: Original username stored in JSON file for verification
- **Client-Side**: localStorage already case-sensitive, prioritized for username storage
- **File Format**: JSON files now store `{ username: "Wen", games: [...] }` format

### 14. Complete File Deletion
**Date**: 2025-11-09  
**Request**: Ensure all user-related files (JSON and CSV) are completely deleted when deleting an account.

**Implementation**:
- **Multi-Strategy Deletion**: Uses three strategies to find and delete all user files:
  1. Delete files with encoded filename (new format)
  2. Scan all JSON files and check if they belong to the user (by reading contents or matching filename)
  3. Scan all CSV files directly (in case JSON was deleted but CSV remains)
- **Handles Different Formats**: Works with both new format (with stored username) and old format (array only)
- **Case-Insensitive Matching**: On Windows, matches filenames case-insensitively for old files
- **Verification**: After deletion, verifies no files remain for the user
- **Error Handling**: Returns error if any files still exist after deletion attempt
- **Comprehensive Logging**: Detailed console logs for debugging deletion process

### Technical Updates

**Server Endpoints**:
- `DELETE /api/delete-user/:username` - Enhanced to handle multiple file formats and case variations
- `GET /api/get-history/:username` - Now verifies username case matches before returning data
- `GET /api/users` - Reads original username from files (case-sensitive)

**Filename Encoding**:
- `encodeCaseInFilename()` - Encodes uppercase letters in filenames
- `decodeCaseFromFilename()` - Decodes filenames back to original username
- `sanitizeFilename()` - Sanitizes and encodes usernames for file storage

**Client-Side Improvements**:
- `getGameHistory()` - Prioritizes localStorage and only merges server data if username matches exactly
- `getAllUsernames()` - Merges localStorage and server usernames, prioritizing localStorage
- `updateStatsUsernameList()` - Preserves selection when updating list
- Auto-load statistics when user is selected
- Preserve username and grid size filter selections when switching tabs

---

## Latest Improvements (Current Session)
**Date**: 2025-11-09

### 15. Theme Tracking Fix
**Date**: 2025-11-09  
**Request**: Theme column in game history should correctly reflect the theme selected for each game. All values were showing "Animals" regardless of actual theme used.

**Implementation**:
- Enhanced theme capture logic in `startBtn` event listener to read theme directly from selector when game starts
- Theme is captured and stored in `gameState.theme` before `initGame()` is called
- Added comprehensive debugging logs to track theme throughout game lifecycle
- `endGame()` function uses `gameState.theme` (captured at game start) to ensure correct theme is saved
- Theme is resolved from selector value, handling "random" theme by picking actual random theme
- Added console logging at key points: game start, game end, and save history

**Technical Details**:
- Theme is read from `emojiThemeSelect.value` when "Start Game" is clicked
- If "random" is selected, a random theme is picked and stored in `gameState.theme`
- Theme is saved with game history in both localStorage and server
- History table displays theme using `getThemeDisplayName()` helper function

### 16. Username and Grid Size Persistence
**Date**: 2025-11-09  
**Request**: Username and grid size should persist across page refreshes. Values should not reset to empty and 4x4.

**Implementation**:
- Added `saveLastUsername()` and `saveLastGridSize()` functions to save values to localStorage
- Added `loadLastUsername()` and `loadLastGridSize()` functions to restore saved values
- Username is saved when:
  - User types in the username input field (real-time)
  - User starts a game
- Grid size is saved when:
  - User changes the grid size selector
- On page load, saved values are automatically restored to input fields
- Default grid size remains 4x4 if no previous value was saved

**Technical Details**:
- localStorage keys: `memoryGameLastUsername` and `memoryGameLastGridSize`
- Values persist across browser sessions
- Grid size validation ensures only valid options are restored

### 17. Auto-Selection After Playing Game
**Date**: 2025-11-09  
**Request**: After playing a game, when switching to Statistics tab, automatically select the username who just played and set grid size filter to the grid size that was just played.

**Implementation**:
- Added `lastPlayedUsername` and `lastPlayedGridSize` variables to track most recent game
- When a game ends (`endGame()`), these variables are set with current game's username and grid size
- When switching to Statistics tab:
  - If a game was just played, automatically select that username and grid size filter
  - Otherwise, use previously selected username or last saved username
  - Grid size filter is only auto-set if a game was just played
- Statistics automatically load when username is auto-selected
- Variables are cleared after being used to prevent stale selections

**Technical Details**:
- Priority order for username selection:
  1. Username from game just played (if available)
  2. Previously selected username (if switching tabs)
  3. Last saved username from localStorage
- Grid size filter auto-selection only occurs when `lastPlayedGridSize` is set
- Statistics display updates immediately after auto-selection

### 18. Theme Filter in Statistics Tab
**Date**: 2025-11-09  
**Request**: Add a theme filter dropdown under the grid size filter in Statistics tab to allow filtering games by theme.

**Implementation**:
- Added theme filter dropdown in HTML under grid size filter
- Added `filterGamesByTheme()` function to filter games by theme value
- Added `getUniqueThemes()` function to extract unique themes from user's games
- Updated `updateStatisticsDisplay()` to apply both grid size and theme filters simultaneously
- Theme filter populates with unique themes from user's game history
- Filter descriptions in chart titles show both filters when active (e.g., "Time Over Games (3x3, Food & Drinks)")
- Statistics, charts, and history table update immediately when theme filter changes
- Theme filter selection is preserved when reloading statistics
- Added event listener for theme filter changes

**Technical Details**:
- Theme filter uses same filtering pattern as grid size filter
- Both filters work together (AND logic) - games must match both selected grid size and theme
- Filter options include "All Themes" plus individual themes found in user's history
- Theme display names use `getThemeDisplayName()` helper for consistent formatting
    - Filter descriptions dynamically show active filters in chart and table titles

---

## Latest Improvements (Current Session)
**Date**: 2025-11-09

### 19. Emoji Name Display and Tooltips
**Date**: 2025-11-09  
**Request**: Show emoji names when hovering over emojis in Settings panel. Display matched emoji names above game board when pairs are found. Show default message before game starts.

**Implementation**:
- **Emoji Name Mapping**: Created comprehensive `emojiNames` object mapping all emojis (400+ entries) across all 8 themes to their descriptive names
  - Animals: Dog, Cat, Mouse, etc.
  - Food & Drinks: Red Apple, Banana, Grapes, etc.
  - Nature: Tree, Evergreen Tree, Palm Tree, etc.
  - Sports & Activities: Soccer Ball, Basketball, etc.
  - Objects & Items: Package, Mobile Phone, Laptop, etc.
  - Faces & Emotions: Grinning Face, Smiling Face, etc.
  - Vehicles: Car, Taxi, Bus, etc.
  - Symbols & Shapes: Star, Glowing Star, etc.
- **Settings Panel Tooltips**: Updated `updateEmojiPreview()` to set `title` attribute on each emoji span
  - Hovering over any emoji in the preview grid shows its descriptive name in a tooltip
  - Uses `getEmojiName()` helper function to retrieve names
- **Matched Pair Display**: Added `<div id="matched-pair-display">` above game board
  - Styled with green background (#e8f5e9), centered text, bold font, rounded corners
  - Visible by default with message "Pairs to be found"
  - Updates to "Match Found: [emoji] [Name]" when a pair is matched (e.g., "Match Found: 🐱 Cat")
  - Message stays visible throughout the game (does not auto-hide)
  - Resets to "Pairs to be found" when game is reset or initialized
- **Display Logic**: Updated `checkMatch()` function to display matched emoji name
  - Shows emoji and its name when a match is found
  - Message persists until game reset
  - Updated `initGame()` to set default message and ensure display is visible

**Technical Details**:
- `getEmojiName(emoji)` function returns descriptive name for any emoji, defaults to "Unknown" if not found
- `emojiNames` object contains all emoji-to-name mappings organized by theme
- Matched pair display uses same styling as success messages (green background)
- Display updates dynamically as matches are found during gameplay

