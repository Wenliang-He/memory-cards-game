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

---

## Latest Improvements (Current Session)
**Date**: 2025-11-09

### 20. Grid Size Selection and Emoji Persistence in Settings
**Date**: 2025-11-09  
**Request**: Add grid-size selector in Settings panel. Add random selection button. Highlight selected emojis for grid-size. Persist selected emojis per grid-size+theme combination.

**Implementation**:
- **Grid Size Selector**: Added grid-size dropdown next to theme selector in Settings panel
  - Options: 3x3 through 9x9 (matches game grid size options)
  - Syncs with game grid size selector
  - Updates preview when changed
- **Random Selection Button**: Added "Random Selection" button next to "Theme Preview" heading
  - Generates new random emoji selection for current grid-size and theme
  - Saves selection automatically
  - Updates preview to highlight new selection
- **Emoji Selection System**: Implemented selection storage per grid-size+theme combination
  - `selectedEmojisByGridSize` object stores selections (key format: `"gridSize_theme"`)
  - `getSelectedEmojisForGridSize()` retrieves saved selection or generates new one
  - `generateRandomEmojiSelection()` creates random selection for a grid size
  - Selections saved to localStorage with key `memoryGameSelectedEmojis`
- **Visual Highlighting**: Selected emojis highlighted in preview grid
  - `.selected-emoji` CSS class with green background (#c8e6c9), green border, and shadow
  - Tooltip shows "(Selected)" for highlighted emojis
  - Preview shows all theme emojis with selected ones highlighted
- **Persistence**: Selected emojis persist across sessions
  - Same grid-size+theme combination always uses same emojis
  - Only changes when user clicks "Random Selection" button
  - Automatically generates new selection if none exists for a combination
- **Game Integration**: `generateCards()` uses selected emojis instead of just slicing theme array
  - Ensures consistent emoji sets for same grid-size+theme
  - Multiple games with same settings use identical emoji sets

**Technical Details**:
- Storage key format: `${gridSize}_${currentTheme}` (e.g., "4_animals", "3_food")
- `loadSelectedEmojis()` and `saveSelectedEmojis()` handle localStorage persistence
- `updateEmojiPreview()` displays all emojis with selected ones highlighted
- Settings grid-size selector syncs with game grid-size selector
- Tab switching syncs grid-size selectors
- Event listeners for settings grid-size change and random selection button

### 21. Settings Panel Label Styling
**Date**: 2025-11-09  
**Request**: Make "Select Grid Size" label match "Select Theme" label styling. Align to left. Add spacing between theme dropdown and grid size label.

**Implementation**:
- Updated `.theme-selection` CSS to use flexbox layout
  - `display: flex`, `align-items: center`, `gap: 10px`
  - Allows labels and selects to appear on same line
- Updated `.theme-selection label` styling
  - Changed from `display: block` to `display: inline-block`
  - Removed `margin-bottom: 10px`, set to `0`
  - Added `white-space: nowrap` to prevent label wrapping
- Updated `.theme-selection select` styling
  - Changed from `width: 100%` to `width: auto`
  - Added `min-width: 200px` for consistent sizing
  - Kept `max-width: 300px` for responsiveness
- Removed inline `margin-left` style from grid size label
- Both labels now have identical styling and alignment

### 22. Matched Pairs Display Layout and List Functionality
**Date**: 2025-11-09  
**Request**: Move matched pairs display to the right of the game board. Display matched pairs as a list that accumulates (doesn't replace previous matches). Allow users to review results after game completion.

**Implementation**:
- **Layout Change**: Restructured HTML to use flexbox layout
  - Game board on the left, matched pairs display on the right
  - Matched pairs display has fixed width (250px) with flex: 0 0 250px
  - Responsive layout maintains side-by-side arrangement
- **List Display**: Changed from single message to accumulating list
  - Added `<div id="matched-pairs-list">` container for list items
  - Each matched pair added as a new list item (doesn't replace previous)
  - List items styled with white background, green left border, padding
  - Header "Pairs to be found" with border separator
  - List displays vertically from top to bottom
- **Review Result Button**: Added "Review" button next to "Play Again" in win modal
  - "Review" button closes modal but keeps game state and matched pairs list visible
  - "Play Again" button clears everything and resets game
  - Both buttons styled with equal width (flex: 1, max-width: 200px)
  - Buttons arranged side-by-side with flexbox
- **Initialization**: List clears when new game starts
  - `initGame()` clears matched pairs list
  - Default message "Pairs to be found" shown before game starts

**Technical Details**:
- Flexbox container wraps game board and matched pairs display
- Each matched pair item created dynamically with `createElement('div')`
- Items appended to list using `appendChild()` (no replacement)
- CSS styling for list items includes hover effects and transitions

### 23. Editable Emoji Names in Matched Pairs List
**Date**: 2025-11-09  
**Request**: Allow users to click on matched emoji names in the list to edit/rename them if they believe the name is inappropriate.

**Implementation**:
- **Custom Name Storage**: Added `customEmojiNames` object to store user-defined names
  - Stored in localStorage with key `memoryGameCustomEmojiNames`
  - Persists across sessions
  - Custom names override default names when set
- **Editable List Items**: Each matched pair item is clickable
  - Clicking an item converts the name to an editable input field
  - Input field has green border and focus styling
  - Press Enter to save, Escape to cancel
  - If name is cleared, reverts to default name
- **Name Display**: Updated `getEmojiName()` function
  - Checks custom names first, then falls back to default names
  - Custom names take precedence over default names
- **Visual Feedback**: Added edit icon (✏️) to each list item
  - Tooltip indicates "Click to edit name"
  - Hover effects show items are clickable
  - CSS transitions for smooth interactions

**Technical Details**:
- `setCustomEmojiName()` function saves custom names to localStorage
- `loadCustomEmojiNames()` loads custom names on page initialization
- `editEmojiName()` function handles inline editing with input field replacement
- Custom names stored as `{ emoji: "customName" }` object in localStorage
- Editing updates both the display and localStorage immediately

### 24. Manual Emoji Selection in Settings Panel
**Date**: 2025-11-09  
**Request**: Allow users to manually select/deselect emojis in Settings panel by clicking on them. If user doesn't select enough emojis, auto-fill remaining slots when starting game.

**Implementation**:
- **Click-to-Select**: Added click handlers to all emojis in preview grid
  - Clicking a selected emoji deselects it
  - Clicking an unselected emoji selects it (up to required number)
  - Selection state saved to localStorage immediately
  - Visual feedback shows selected state with green highlighting
- **Auto-Fill Logic**: Updated `getSelectedEmojisForGridSize()` function
  - If fewer emojis selected than needed, auto-fills remaining slots randomly
  - Auto-fill only occurs when starting a game (not in preview)
  - No error messages - silently fills missing slots
  - Uses available emojis from theme (excludes already selected ones)
- **Visual Indicators**: Enhanced tooltips and cursor
  - Tooltips show "(Selected - Click to deselect)" or "(Click to select)"
  - Cursor changes to pointer on hover
  - Selected emojis highlighted with green background and border
- **Selection Management**: Added `toggleEmojiSelection()` function
  - Handles selection/deselection logic
  - Prevents selecting more than required number
  - Updates preview immediately after selection change
  - Saves selection to localStorage automatically

**Technical Details**:
- Selection stored per grid-size+theme combination (same as before)
- `updateEmojiPreview()` shows current selection state without auto-filling
- Preview displays all emojis with selected ones highlighted
- Selection persists across sessions and theme changes
- Auto-fill happens in `getSelectedEmojisForGridSize()` when game starts

### 25. Tab Buttons Equal Width
**Date**: 2025-11-09  
**Request**: Make Settings, Game, and Statistics tab buttons the same width for aesthetic purposes.

**Implementation**:
- Updated `.tab-btn` CSS class
  - Added `flex: 1` to make buttons take equal space
  - Added `max-width: 200px` to prevent buttons from getting too wide
  - Added `text-align: center` to center text within buttons
  - Buttons now have consistent width and alignment

**Technical Details**:
- Flexbox container (`.tabs`) distributes space equally among buttons
- Max-width ensures buttons don't stretch excessively on large screens
- All three buttons (Settings, Game, Statistics) have identical width

### 26. Remove Load Statistics Button
**Date**: 2025-11-09  
**Request**: Remove "Load Statistics" button if it's redundant since statistics update automatically based on username, grid-size, and theme selections.

**Implementation**:
- **Removed Button**: Deleted `<button id="load-stats-btn">` from HTML
- **Removed Event Listener**: Deleted entire event listener for loadStatsBtn
- **Removed DOM Reference**: Removed `const loadStatsBtn = document.getElementById('load-stats-btn');`

**Rationale**:
- Statistics automatically load when username is selected (via `statsUsernameSelect` change event)
- Grid size filter updates statistics immediately (via `chartGridSizeSelect` change event)
- Theme filter updates statistics immediately (via `chartThemeSelect` change event)
- Button was redundant and added unnecessary UI clutter
- All functionality preserved through automatic event listeners

**Technical Details**:
- No functionality lost - all features work automatically
- Statistics load when username dropdown changes
- Filters update statistics immediately when changed
- Cleaner UI with one less button

### 27. Theme Tracking Fixes and Auto-Selection
**Date**: 2025-11-09  
**Request**: Fix issues where themes were always being recorded as "Animals" in game history and theme filter. After completing a game, when switching to Statistics tab, the theme filter should default to the theme that was just played.

**Implementation**:
- **Theme Preservation in `initGame()`**: Added protection to preserve `gameState.theme` if already set
  - Only sets default theme if `gameState.theme` is not set
  - Prevents theme from being reset when `initGame()` is called from other places
- **Theme Validation in `saveGameHistory()`**: Added validation to ensure 'random' is never saved
  - Converts 'random' or invalid themes to 'animals' before saving
  - Ensures only valid theme names are stored in history
- **Enhanced Theme Setting**: Improved theme capture logic in `startBtn` event listener
  - Validates theme exists in `emojiThemes` object before using
  - Handles 'random' theme selection correctly by resolving to actual theme
  - Added comprehensive logging to track theme throughout game lifecycle
- **Theme Auto-Selection in Statistics**: Added `lastPlayedTheme` variable to track last played theme
  - Set in `endGame()` when a game completes
  - Used in `displayStatistics()` to auto-select theme filter
  - Theme filter defaults to last played theme instead of "All Themes"
  - Clears `lastPlayedTheme` after using it
- **Debugging**: Added extensive console logging on both client and server
  - Client-side logs track theme selection, setting, and saving
  - Server-side logs track theme received and saved
  - Helps identify where theme might be lost in the data flow

**Technical Details**:
- `gameState.theme` is set before `initGame()` is called to ensure it's preserved
- Theme is validated to ensure it exists in `emojiThemes` object
- `lastPlayedTheme` follows same pattern as `lastPlayedUsername` and `lastPlayedGridSize`
- Theme filter auto-selection works in both `displayStatistics()` and tab switching handler
- Theme merging logic in `getGameHistory()` preserves themes from localStorage when server games don't have them

**Issues Fixed**:
- Themes were being recorded as "Animals" regardless of actual theme selected
- Theme filter dropdown only showed "Animals" option
- Theme filter defaulted to "All Themes" instead of last played theme
- Theme was not being preserved when `initGame()` was called multiple times

