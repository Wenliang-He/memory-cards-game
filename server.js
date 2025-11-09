const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'game_history');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to encode case in filename
// On Windows, filenames are case-insensitive, so we encode case using a simple scheme
function encodeCaseInFilename(username) {
    // Encode uppercase letters as lowercase + underscore prefix
    // e.g., "Wen" becomes "w_en", "wen" stays "wen"
    return username.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            return '_' + char.toLowerCase();
        } else if (char === '_') {
            return '__'; // Escape underscore
        } else {
            return char;
        }
    }).join('');
}

// Helper function to decode case from filename
function decodeCaseFromFilename(encoded) {
    // Decode: _x becomes uppercase X, __ becomes _
    let result = '';
    let i = 0;
    while (i < encoded.length) {
        if (encoded[i] === '_' && i + 1 < encoded.length) {
            if (encoded[i + 1] === '_') {
                result += '_';
                i += 2;
            } else {
                result += encoded[i + 1].toUpperCase();
                i += 2;
            }
        } else {
            result += encoded[i];
            i++;
        }
    }
    return result;
}

// Helper function to sanitize filename (preserves case using encoding)
function sanitizeFilename(username) {
    // First replace special characters (except underscore) with underscore
    const sanitized = username.replace(/[^a-zA-Z0-9_]/g, '_');
    // Then encode case
    return encodeCaseInFilename(sanitized);
}

// Save game history to file
app.post('/api/save-history', (req, res) => {
    try {
        const { username, time, moves, gridSize, theme, date } = req.body;
        
        console.log('=== SERVER: Save History Request ===');
        console.log('Received theme:', theme);
        console.log('Full request body:', req.body);
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Use original username (case-sensitive) for filename
        // On Windows, we need to ensure case-sensitive filenames
        const filename = sanitizeFilename(username);
        const jsonFile = path.join(DATA_DIR, `${filename}.json`);
        const csvFile = path.join(DATA_DIR, `${filename}.csv`);

        // Read existing data or create new
        let fileData = { username: username, games: [] };
        if (fs.existsSync(jsonFile)) {
            const data = fs.readFileSync(jsonFile, 'utf8');
            const parsed = JSON.parse(data);
            // Handle both old format (array) and new format (object with username)
            if (Array.isArray(parsed)) {
                fileData = { username: username, games: parsed };
            } else {
                fileData = parsed;
                // Ensure username matches (case-sensitive)
                if (fileData.username !== username) {
                    // If username case doesn't match, this is a different user
                    // Create a new file with case-sensitive filename
                    fileData = { username: username, games: [] };
                }
            }
        } else {
            fileData = { username: username, games: [] };
        }

        // Add new game (set default theme to 'animals' if not provided)
        const gameToAdd = { time, moves, gridSize, theme: theme || 'animals', date };
        console.log('Game to add:', gameToAdd);
        fileData.games.push(gameToAdd);

        // Save JSON file with original username stored
        fs.writeFileSync(jsonFile, JSON.stringify(fileData, null, 2), 'utf8');
        console.log('Saved to file:', jsonFile);
        console.log('Last game in file:', fileData.games[fileData.games.length - 1]);

        // Save CSV file
        const csvHeader = 'Date,Time (seconds),Moves,Grid Size,Theme\n';
        const csvRows = fileData.games.map(game => {
            const dateStr = new Date(game.date).toISOString();
            const theme = game.theme || 'animals'; // Default to animals for old records
            return `${dateStr},${game.time},${game.moves},${game.gridSize}x${game.gridSize},${theme}`;
        }).join('\n');
        fs.writeFileSync(csvFile, csvHeader + csvRows, 'utf8');

        res.json({ success: true, message: 'Game history saved' });
    } catch (error) {
        console.error('Error saving history:', error);
        res.status(500).json({ error: 'Failed to save game history' });
    }
});

// Get game history for a user
app.get('/api/get-history/:username', (req, res) => {
    try {
        const username = req.params.username;
        const filename = sanitizeFilename(username);
        const jsonFile = path.join(DATA_DIR, `${filename}.json`);

        if (fs.existsSync(jsonFile)) {
            const data = fs.readFileSync(jsonFile, 'utf8');
            const parsed = JSON.parse(data);
            
            // Handle both old format (array) and new format (object with username)
            let games = [];
            let fileUsername = username;
            
            if (Array.isArray(parsed)) {
                // Old format - verify username from filename matches
                const encodedFilename = filename;
                const decodedUsername = decodeCaseFromFilename(encodedFilename);
                if (decodedUsername !== username) {
                    // Username case doesn't match - return empty games
                    res.json({ success: true, games: [] });
                    return;
                }
                games = parsed;
            } else if (parsed.username && parsed.games) {
                // New format - object with username and games
                fileUsername = parsed.username;
                games = parsed.games;
            } else {
                games = parsed;
            }
            
            // Verify username matches (case-sensitive)
            if (fileUsername !== username) {
                // Username case doesn't match - return empty games
                res.json({ success: true, games: [] });
                return;
            }
            
            res.json({ success: true, games });
        } else {
            res.json({ success: true, games: [] });
        }
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: 'Failed to get game history' });
    }
});

// Get all usernames
app.get('/api/users', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR);
        const usernames = new Set();
        
        files
            .filter(file => file.endsWith('.json'))
            .forEach(file => {
                const filePath = path.join(DATA_DIR, file);
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const parsed = JSON.parse(data);
                    
                    // Get original username from file (case-sensitive)
                    if (parsed.username) {
                        // New format - use stored username
                        usernames.add(parsed.username);
                    } else {
                        // Old format - decode from filename
                        const encodedFilename = file.replace('.json', '');
                        const decodedUsername = decodeCaseFromFilename(encodedFilename);
                        usernames.add(decodedUsername);
                    }
                } catch (error) {
                    // If file can't be read, decode from filename
                    const encodedFilename = file.replace('.json', '');
                    try {
                        const decodedUsername = decodeCaseFromFilename(encodedFilename);
                        usernames.add(decodedUsername);
                    } catch (e) {
                        // If decoding fails, use filename as-is
                        usernames.add(encodedFilename);
                    }
                }
            });
        
        res.json({ success: true, usernames: Array.from(usernames).sort() });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Delete user endpoint
app.delete('/api/delete-user/:username', (req, res) => {
    try {
        const username = req.params.username;
        const filename = sanitizeFilename(username);
        
        // Get all files in the directory to find matching files
        const allFiles = fs.readdirSync(DATA_DIR);
        const deletedFiles = [];
        const filesToDelete = [];
        
        // Strategy 1: Try to delete files with encoded filename (new format)
        const jsonFile = path.join(DATA_DIR, `${filename}.json`);
        const csvFile = path.join(DATA_DIR, `${filename}.csv`);
        
        if (fs.existsSync(jsonFile)) {
            filesToDelete.push({ path: jsonFile, type: 'JSON', name: `${filename}.json` });
        }
        
        if (fs.existsSync(csvFile)) {
            filesToDelete.push({ path: csvFile, type: 'CSV', name: `${filename}.csv` });
        }
        
        // Strategy 2: Check all JSON files to see if they belong to this user
        allFiles.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(DATA_DIR, file);
                const baseFilename = file.replace('.json', '');
                
                try {
                    // Try to read and parse the file
                    const data = fs.readFileSync(filePath, 'utf8');
                    const parsed = JSON.parse(data);
                    
                    let fileUsername = null;
                    if (parsed.username) {
                        // New format - check stored username
                        fileUsername = parsed.username;
                    } else if (Array.isArray(parsed)) {
                        // Old format - decode from filename
                        try {
                            fileUsername = decodeCaseFromFilename(baseFilename);
                        } catch (e) {
                            // If decoding fails, try direct match (for old files without encoding)
                            // Also check if filename matches username directly (case-insensitive on Windows)
                            if (baseFilename.toLowerCase() === username.toLowerCase()) {
                                fileUsername = username; // Treat as match
                            }
                        }
                    }
                    
                    // If this file belongs to the user (case-sensitive match), mark for deletion
                    if (fileUsername === username) {
                        filesToDelete.push({ path: filePath, type: 'JSON', name: file });
                        
                        // Also mark corresponding CSV file
                        const csvFileName = file.replace('.json', '.csv');
                        const csvFilePath = path.join(DATA_DIR, csvFileName);
                        if (fs.existsSync(csvFilePath)) {
                            filesToDelete.push({ path: csvFilePath, type: 'CSV', name: csvFileName });
                        }
                    }
                } catch (error) {
                    // If file can't be read, check if filename matches (for corrupted files)
                    // On Windows, filenames are case-insensitive, so check both
                    const baseFilenameLower = baseFilename.toLowerCase();
                    const usernameLower = username.toLowerCase();
                    const encodedFilename = sanitizeFilename(username);
                    
                    if (baseFilenameLower === usernameLower || baseFilename === encodedFilename) {
                        // Likely belongs to this user - delete it
                        filesToDelete.push({ path: filePath, type: 'JSON', name: file });
                        
                        const csvFileName = file.replace('.json', '.csv');
                        const csvFilePath = path.join(DATA_DIR, csvFileName);
                        if (fs.existsSync(csvFilePath)) {
                            filesToDelete.push({ path: csvFilePath, type: 'CSV', name: csvFileName });
                        }
                    }
                }
            }
        });
        
        // Strategy 3: Also check CSV files directly (in case JSON was deleted but CSV remains)
        allFiles.forEach(file => {
            if (file.endsWith('.csv')) {
                const baseFilename = file.replace('.csv', '');
                const baseFilenameLower = baseFilename.toLowerCase();
                const usernameLower = username.toLowerCase();
                const encodedFilename = sanitizeFilename(username);
                
                // Check if filename matches (case-insensitive on Windows)
                if (baseFilenameLower === usernameLower || baseFilename === encodedFilename) {
                    const filePath = path.join(DATA_DIR, file);
                    if (fs.existsSync(filePath)) {
                        // Check if we already have this file in the delete list
                        const alreadyAdded = filesToDelete.some(f => f.path === filePath);
                        if (!alreadyAdded) {
                            filesToDelete.push({ path: filePath, type: 'CSV', name: file });
                        }
                    }
                }
            }
        });
        
        // Now delete all identified files
        filesToDelete.forEach(fileInfo => {
            try {
                if (fs.existsSync(fileInfo.path)) {
                    fs.unlinkSync(fileInfo.path);
                    if (!deletedFiles.includes(fileInfo.type)) {
                        deletedFiles.push(fileInfo.type);
                    }
                    console.log(`Deleted ${fileInfo.type} file: ${fileInfo.name} for user: ${username}`);
                }
            } catch (error) {
                console.error(`Error deleting file ${fileInfo.name}:`, error.message);
            }
        });
        
        // Final verification - check if any files still exist for this user
        const remainingFiles = fs.readdirSync(DATA_DIR);
        const userFiles = remainingFiles.filter(file => {
            const baseFilename = file.replace(/\.(json|csv)$/, '');
            const baseFilenameLower = baseFilename.toLowerCase();
            const usernameLower = username.toLowerCase();
            const encodedFilename = sanitizeFilename(username);
            
            // Check if filename matches (case-insensitive on Windows)
            if (baseFilenameLower === usernameLower || baseFilename === encodedFilename) {
                return true;
            }
            
            // Also check file contents if it's a JSON file
            if (file.endsWith('.json')) {
                const filePath = path.join(DATA_DIR, file);
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const parsed = JSON.parse(data);
                    if (parsed.username === username) {
                        return true;
                    }
                } catch (e) {
                    // Ignore read errors
                }
            }
            
            return false;
        });
        
        if (userFiles.length > 0) {
            console.error(`Warning: Some files still exist for user: ${username}`, userFiles);
            return res.status(500).json({ 
                error: 'Failed to delete all files',
                remainingFiles: userFiles
            });
        }
        
        res.json({ 
            success: true, 
            message: `User "${username}" and all game history deleted successfully`,
            deletedFiles: deletedFiles
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Download file endpoint
app.get('/api/download/:username/:format', (req, res) => {
    try {
        const username = req.params.username;
        const format = req.params.format || 'csv';
        const filename = sanitizeFilename(username);
        const jsonFile = path.join(DATA_DIR, `${filename}.json`);

        // Read from JSON file (most up-to-date) and generate download file
        if (fs.existsSync(jsonFile)) {
            const data = fs.readFileSync(jsonFile, 'utf8');
            const parsed = JSON.parse(data);
            
            // Handle both old format (array) and new format (object with username)
            let games = [];
            if (Array.isArray(parsed)) {
                games = parsed;
            } else if (parsed.games) {
                games = parsed.games;
            }
            
            // Verify username matches (case-sensitive)
            const fileUsername = parsed.username || decodeCaseFromFilename(filename);
            if (fileUsername !== username) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            if (format === 'csv') {
                // Generate CSV with theme column
                const csvHeader = 'Date,Time (seconds),Moves,Grid Size,Theme\n';
                const csvRows = games.map(game => {
                    const dateStr = new Date(game.date).toISOString();
                    const theme = game.theme || 'animals'; // Default to animals for old records
                    return `${dateStr},${game.time},${game.moves},${game.gridSize}x${game.gridSize},${theme}`;
                }).join('\n');
                const csvContent = csvHeader + csvRows;
                
                res.setHeader('Content-Type', 'text/csv;charset=utf-8');
                res.setHeader('Content-Disposition', `attachment; filename="${username}_history.csv"`);
                res.send(csvContent);
            } else if (format === 'json') {
                // Send JSON directly
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `attachment; filename="${username}_history.json"`);
                res.json(games);
            } else {
                res.status(400).json({ error: 'Invalid format. Use csv or json' });
            }
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Game history files will be saved in: ${DATA_DIR}`);
});

