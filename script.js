// Game state management
const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    isGameStarted: false,
    isProcessing: false,
    isPaused: false,
    gridSize: 4  // Default 4x4
};

// Emoji pool for cards
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
                '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
                '⭐', '🌟', '💫', '✨', '🎈', '🎉', '🎊', '🎁', '🎀', '🎂',
                '🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍊', '🍋', '🍉', '🍐'];

// DOM elements
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const gridSizeSelect = document.getElementById('grid-size');
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const winModal = document.getElementById('win-modal');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const gameTab = document.getElementById('game-tab');
const statisticsTab = document.getElementById('statistics-tab');
const statsUsernameSelect = document.getElementById('stats-username');
const loadStatsBtn = document.getElementById('load-stats-btn');
const statisticsContent = document.getElementById('statistics-content');
const usernameError = document.getElementById('username-error');
const downloadControls = document.querySelector('.download-controls');
const downloadFormat = document.getElementById('download-format');
const downloadBtn = document.getElementById('download-btn');
const downloadStatus = document.getElementById('download-status');
const gridSizeFilterControls = document.getElementById('grid-size-filter-controls');
const chartGridSizeSelect = document.getElementById('chart-grid-size');
const deleteAccountBtn = document.getElementById('delete-account-btn');

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize game
function initGame() {
    const gridSize = parseInt(gridSizeSelect.value);
    gameState.gridSize = gridSize;
    
    // For memory card game, we need an even number of cards (pairs)
    // For odd grid sizes (3x3, 5x5, 7x7, 9x9), use one less card to make it even
    const totalCards = gridSize * gridSize;
    gameState.totalPairs = Math.floor(totalCards / 2);
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.flippedCards = [];
    gameState.isGameStarted = false;
    gameState.isProcessing = false;
    gameState.isPaused = false;
    gameState.timer = 0;
    
    // Stop timer completely
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Reset pause button
    pauseBtn.style.display = 'none';
    pauseBtn.textContent = 'Pause';
    gameState.isPaused = false;
    
    updateDisplay();
    generateCards();
    renderBoard();
}

// Generate card pairs with emojis
function generateCards() {
    const numPairs = gameState.totalPairs;
    const totalCards = gameState.gridSize * gameState.gridSize;
    const selectedEmojis = emojis.slice(0, numPairs);
    gameState.cards = [];
    
    // Create pairs (only playable cards)
    for (let i = 0; i < numPairs; i++) {
        gameState.cards.push({
            id: i * 2,
            emoji: selectedEmojis[i],
            isFlipped: false,
            isMatched: false,
            isEmpty: false
        });
        gameState.cards.push({
            id: i * 2 + 1,
            emoji: selectedEmojis[i],
            isFlipped: false,
            isMatched: false,
            isEmpty: false
        });
    }
    
    // Shuffle only the playable cards first
    shuffleArray(gameState.cards);
    
    // For odd grid sizes, insert empty placeholder card at center position for symmetry
    if (gameState.cards.length < totalCards) {
        const centerIndex = Math.floor(totalCards / 2); // Center position
        const emptyCard = {
            id: totalCards - 1,
            emoji: '',
            isFlipped: false,
            isMatched: true, // Mark as matched so it can't be clicked
            isEmpty: true
        };
        // Insert empty card at center position
        gameState.cards.splice(centerIndex, 0, emptyCard);
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render game board
function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
    
    gameState.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        
        // Empty placeholder card (for odd grid sizes)
        if (card.isEmpty) {
            cardElement.classList.add('empty-card');
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front" style="display: none;">?</div>
                    <div class="card-back" style="background: transparent; border: none;"></div>
                </div>
            `;
            gameBoard.appendChild(cardElement);
            return;
        }
        
        // Matched cards should show emoji without rotation
        if (card.isMatched) {
            cardElement.classList.add('matched');
            // Don't add 'flipped' class to prevent rotation animation
            // For matched cards, ensure isFlipped is true
            card.isFlipped = true;
        } else if (card.isFlipped) {
            cardElement.classList.add('flipped');
        }
        
        // For matched cards, directly show emoji without question mark
        if (card.isMatched) {
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front" style="display: none;">?</div>
                    <div class="card-back">${card.emoji}</div>
                </div>
            `;
        } else {
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.emoji}</div>
                </div>
            `;
        }
        
        cardElement.addEventListener('click', () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
    });
}

// Handle card click
function handleCardClick(index) {
    const card = gameState.cards[index];
    
    // Prevent clicks if card is already flipped, matched, game is processing, paused, or not started
    if (card.isFlipped || card.isMatched || gameState.isProcessing || !gameState.isGameStarted || gameState.isPaused) {
        return;
    }
    
    // Start timer on first card flip (only if game is started and not paused)
    if (gameState.moves === 0 && gameState.isGameStarted && !gameState.isPaused) {
        // Make sure timer is stopped first
        stopTimer();
        gameState.timer = 0;
        updateDisplay();
        startTimer();
        pauseBtn.style.display = 'inline-block';
    }
    
    // Flip the card
    card.isFlipped = true;
    gameState.flippedCards.push(index);
    
    renderBoard();
    
    // Check for match when two cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.isProcessing = true;
        gameState.moves++;
        updateDisplay();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Check if flipped cards match
function checkMatch() {
    const [firstIndex, secondIndex] = gameState.flippedCards;
    const firstCard = gameState.cards[firstIndex];
    const secondCard = gameState.cards[secondIndex];
    
    if (firstCard.emoji === secondCard.emoji) {
        // Match found - keep cards flipped to show emojis permanently
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        firstCard.isFlipped = true; // Ensure they stay flipped
        secondCard.isFlipped = true; // Ensure they stay flipped
        gameState.matchedPairs++;
        
        // Check win condition
        if (gameState.matchedPairs === gameState.totalPairs) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    } else {
        // No match - flip cards back
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
    }
    
    // Reset flipped cards array
    gameState.flippedCards = [];
    gameState.isProcessing = false;
    renderBoard();
}

// Timer functions
function startTimer() {
    // Don't start if paused or game not started
    if (gameState.isPaused || !gameState.isGameStarted) {
        return;
    }
    
    // Make sure any existing timer is stopped first
    stopTimer();
    
    gameState.timerInterval = setInterval(() => {
        // Only increment if game is started and not paused
        if (gameState.isGameStarted && !gameState.isPaused) {
            gameState.timer++;
            updateDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function pauseTimer() {
    gameState.isPaused = true;
    pauseBtn.textContent = 'Resume';
}

function resumeTimer() {
    gameState.isPaused = false;
    pauseBtn.textContent = 'Pause';
}

// Update display
function updateDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    movesDisplay.textContent = gameState.moves;
}

// End game and show win modal
async function endGame() {
    stopTimer();
    finalTimeDisplay.textContent = timerDisplay.textContent;
    finalMovesDisplay.textContent = gameState.moves;
    
    // Save game history
    const username = usernameInput.value.trim();
    if (username) {
        await saveGameHistory(username, gameState.timer, gameState.moves, gameState.gridSize);
        // Update username list immediately after saving
        await updateStatsUsernameList();
    }
    
    winModal.classList.add('show');
}

// Game History Storage - Hybrid approach (localStorage + backend)
async function saveGameHistory(username, time, moves, gridSize) {
    const gameData = {
        time: time,
        moves: moves,
        gridSize: gridSize,
        date: new Date().toISOString()
    };
    
    // Save to localStorage (for quick access)
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
    
    if (!gameHistory[username]) {
        gameHistory[username] = [];
    }
    
    gameHistory[username].push(gameData);
    localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
    
    // Save to backend server
    try {
        const response = await fetch(`${API_BASE_URL}/save-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                ...gameData
            })
        });
        
        if (response.ok) {
            console.log('Game history saved to server');
        } else {
            console.error('Failed to save to server:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving to server:', error);
        // Continue even if server save fails
    }
}

async function getGameHistory(username) {
    // Always use localStorage first (most reliable for case-sensitive usernames)
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
    const localStorageGames = gameHistory[username] || [];
    
    // Try to get from server and merge (but only if username matches exactly)
    try {
        const response = await fetch(`${API_BASE_URL}/get-history/${encodeURIComponent(username)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.games && data.games.length > 0) {
                // Merge server games with localStorage games
                // Use Set to avoid duplicates based on date
                const gameMap = new Map();
                
                // Add localStorage games
                localStorageGames.forEach(game => {
                    const key = `${game.date}_${game.time}_${game.moves}`;
                    gameMap.set(key, game);
                });
                
                // Add server games (they will overwrite if duplicate)
                data.games.forEach(game => {
                    const key = `${game.date}_${game.time}_${game.moves}`;
                    gameMap.set(key, game);
                });
                
                const mergedGames = Array.from(gameMap.values());
                
                // Update localStorage with merged data (using exact username case)
                gameHistory[username] = mergedGames;
                localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
                
                return mergedGames;
            }
        }
    } catch (error) {
        console.error('Error getting from server, using localStorage:', error);
    }
    
    // Return localStorage games (always available and case-sensitive)
    return localStorageGames;
}

async function getAllUsernames() {
    // Always check localStorage first (most reliable)
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
    const localStorageUsernames = Object.keys(gameHistory).sort();
    
    // Try to get from server and merge with localStorage
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.usernames && data.usernames.length > 0) {
                // Merge server usernames with localStorage usernames
                const allUsernames = new Set([...localStorageUsernames, ...data.usernames]);
                return Array.from(allUsernames).sort();
            }
        }
    } catch (error) {
        console.log('Server not available, using localStorage only:', error);
    }
    
    // Return localStorage usernames (always available)
    return localStorageUsernames;
}

// Tab Switching
tabButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const tabName = btn.dataset.tab;
        
        // Preserve selected username when switching tabs
        const selectedUsername = statsUsernameSelect.value.trim();
        
        // Update active tab button
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        if (tabName === 'game') {
            gameTab.classList.add('active');
            statisticsTab.classList.remove('active');
        } else {
            gameTab.classList.remove('active');
            statisticsTab.classList.add('active');
            
            // Refresh username list when switching to Statistics tab
            await updateStatsUsernameList();
            
            // Restore selected username if it was valid
            if (selectedUsername) {
                const option = statsUsernameSelect.querySelector(`option[value="${selectedUsername}"]`);
                if (option) {
                    statsUsernameSelect.value = selectedUsername;
                    // Automatically load statistics for the selected user
                    await displayStatistics(selectedUsername);
                }
            }
        }
    });
});

// Update Statistics Username List
async function updateStatsUsernameList(preserveSelection = true) {
    // Preserve current selection
    const currentSelection = preserveSelection ? statsUsernameSelect.value.trim() : null;
    
    const usernames = await getAllUsernames();
    statsUsernameSelect.innerHTML = '<option value="">-- Select User --</option>';
    
    usernames.forEach(username => {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        statsUsernameSelect.appendChild(option);
    });
    
    // Restore selection if it was valid
    if (currentSelection) {
        const option = statsUsernameSelect.querySelector(`option[value="${currentSelection}"]`);
        if (option) {
            statsUsernameSelect.value = currentSelection;
        }
    }
}

// Calculate Statistics
function calculateStatistics(games) {
    if (games.length === 0) {
        return null;
    }
    
    const times = games.map(g => g.time);
    const moves = games.map(g => g.moves);
    
    return {
        totalGames: games.length,
        bestTime: Math.min(...times),
        bestMoves: Math.min(...moves),
        averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        averageMoves: Math.round(moves.reduce((a, b) => a + b, 0) / moves.length),
        worstTime: Math.max(...times),
        worstMoves: Math.max(...moves)
    };
}

// Get most frequently played grid size (if tie, return biggest grid size)
function getMostFrequentGridSize(games) {
    if (games.length === 0) return null;
    
    const gridSizeCounts = {};
    games.forEach(game => {
        const size = game.gridSize;
        gridSizeCounts[size] = (gridSizeCounts[size] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostFrequent = null;
    let tiedSizes = [];
    
    // Find the maximum count
    for (const [size, count] of Object.entries(gridSizeCounts)) {
        if (count > maxCount) {
            maxCount = count;
            tiedSizes = [parseInt(size)];
        } else if (count === maxCount) {
            tiedSizes.push(parseInt(size));
        }
    }
    
    // If there's a tie, return the biggest grid size
    if (tiedSizes.length > 0) {
        return Math.max(...tiedSizes);
    }
    
    return mostFrequent;
}

// Get all unique grid sizes from games
function getUniqueGridSizes(games) {
    const sizes = new Set();
    games.forEach(game => {
        sizes.add(game.gridSize);
    });
    return Array.from(sizes).sort((a, b) => a - b);
}

// Filter games by grid size
function filterGamesByGridSize(games, gridSize) {
    if (gridSize === 'all' || !gridSize) {
        return games;
    }
    return games.filter(game => game.gridSize === parseInt(gridSize));
}

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Store all games for current user (for quick filtering)
let currentUserGames = [];

// Update statistics and charts based on current filter (immediate update)
function updateStatisticsDisplay() {
    const selectedGridSize = chartGridSizeSelect.value;
    const games = filterGamesByGridSize(currentUserGames, selectedGridSize);
    const stats = calculateStatistics(games);
    
    if (!stats) {
        statisticsContent.innerHTML = '<p class="no-stats-message">No game history found for this user</p>';
        return;
    }
    
    // Create statistics HTML
    let html = `
        <div class="stats-summary">
            <div class="stat-card">
                <h3>Total Games</h3>
                <div class="stat-value">${stats.totalGames}</div>
            </div>
            <div class="stat-card">
                <h3>Best Time</h3>
                <div class="stat-value">${formatTime(stats.bestTime)}</div>
            </div>
            <div class="stat-card">
                <h3>Best Moves</h3>
                <div class="stat-value">${stats.bestMoves}</div>
            </div>
            <div class="stat-card">
                <h3>Average Time</h3>
                <div class="stat-value">${formatTime(stats.averageTime)}</div>
            </div>
            <div class="stat-card">
                <h3>Average Moves</h3>
                <div class="stat-value">${stats.averageMoves}</div>
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart-wrapper">
                <h3>Time Over Games${selectedGridSize !== 'all' ? ` (${selectedGridSize}x${selectedGridSize})` : ''}</h3>
                <canvas id="time-chart"></canvas>
            </div>
            <div class="chart-wrapper">
                <h3>Moves Over Games${selectedGridSize !== 'all' ? ` (${selectedGridSize}x${selectedGridSize})` : ''}</h3>
                <canvas id="moves-chart"></canvas>
            </div>
        </div>
        
        <div class="game-history">
            <h3>Game History${selectedGridSize !== 'all' ? ` (${selectedGridSize}x${selectedGridSize})` : ''}</h3>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Grid Size</th>
                        <th>Time</th>
                        <th>Moves</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Sort games by date (newest first)
    const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedGames.forEach(game => {
        const date = new Date(game.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        html += `
            <tr>
                <td>${dateStr}</td>
                <td>${game.gridSize}x${game.gridSize}</td>
                <td>${formatTime(game.time)}</td>
                <td>${game.moves}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    statisticsContent.innerHTML = html;
    
    // Create charts with filtered games
    createTimeChart(games);
    createMovesChart(games);
}

// Display Statistics (initial load)
async function displayStatistics(username, preserveSelection = false) {
    const allGames = await getGameHistory(username);
    currentUserGames = allGames; // Store for quick filtering
    
    // Show download controls if user has games
    if (allGames.length > 0) {
        downloadControls.style.display = 'block';
        gridSizeFilterControls.style.display = 'flex';
        
        // Preserve current selection if user has manually selected something
        const currentSelection = preserveSelection ? chartGridSizeSelect.value : null;
        
        // Populate grid size filter
        const uniqueSizes = getUniqueGridSizes(allGames);
        chartGridSizeSelect.innerHTML = '<option value="all">All Grid Sizes</option>';
        uniqueSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}x${size}`;
            chartGridSizeSelect.appendChild(option);
        });
        
        // Restore user's selection or set default to most frequently played grid size
        if (currentSelection && chartGridSizeSelect.querySelector(`option[value="${currentSelection}"]`)) {
            // User had a selection and it's still valid, restore it
            chartGridSizeSelect.value = currentSelection;
        } else {
            // Set default to most frequently played grid size (only on first load)
            const mostFrequent = getMostFrequentGridSize(allGames);
            if (mostFrequent) {
                chartGridSizeSelect.value = mostFrequent;
            }
        }
    } else {
        downloadControls.style.display = 'none';
        gridSizeFilterControls.style.display = 'none';
    }
    
    // Update statistics display immediately
    updateStatisticsDisplay();
}

// Create Time Chart
function createTimeChart(games) {
    const ctx = document.getElementById('time-chart');
    if (!ctx) return;
    
    const labels = games.map((_, index) => `Game ${index + 1}`);
    const times = games.map(g => g.time);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time (seconds)',
                data: times,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                }
            }
        }
    });
}

// Create Moves Chart
function createMovesChart(games) {
    const ctx = document.getElementById('moves-chart');
    if (!ctx) return;
    
    const labels = games.map((_, index) => `Game ${index + 1}`);
    const moves = games.map(g => g.moves);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moves',
                data: moves,
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Moves'
                    }
                }
            }
        }
    });
}

// Load Statistics Event Listener
loadStatsBtn.addEventListener('click', async () => {
    // Preserve selected username and grid size filter before refreshing
    const selectedUsername = statsUsernameSelect.value.trim();
    const selectedGridSize = chartGridSizeSelect.value;
    
    // Refresh username list before loading statistics
    await updateStatsUsernameList();
    
    // Restore username selection if it was valid
    if (selectedUsername) {
        // Check if the username still exists in the list
        const option = statsUsernameSelect.querySelector(`option[value="${selectedUsername}"]`);
        if (option) {
            statsUsernameSelect.value = selectedUsername;
        }
    }
    
    // Get the username (either restored or newly selected)
    const username = statsUsernameSelect.value.trim();
    if (username) {
        // Load statistics and preserve grid size filter selection
        await displayStatistics(username, true);
        
        // Restore grid size filter selection after loading
        if (selectedGridSize && chartGridSizeSelect.querySelector(`option[value="${selectedGridSize}"]`)) {
            chartGridSizeSelect.value = selectedGridSize;
            // Update display with the selected grid size filter
            updateStatisticsDisplay();
        }
    } else {
        statisticsContent.innerHTML = '<p class="no-stats-message">Please select a user</p>';
        downloadControls.style.display = 'none';
        gridSizeFilterControls.style.display = 'none';
    }
});

// Grid size filter change event listener - immediate update
chartGridSizeSelect.addEventListener('change', () => {
    // Update statistics and charts immediately without reloading data
    if (currentUserGames.length > 0) {
        updateStatisticsDisplay();
    }
});

// Username selection change event listener - auto-load statistics
statsUsernameSelect.addEventListener('change', async () => {
    const username = statsUsernameSelect.value.trim();
    if (username) {
        // Show delete button when user is selected
        deleteAccountBtn.style.display = 'inline-block';
        // Automatically load statistics when user is selected
        await displayStatistics(username);
    } else {
        // Hide delete button when no user selected
        deleteAccountBtn.style.display = 'none';
        // Clear statistics if no user selected
        statisticsContent.innerHTML = '<p class="no-stats-message">Select a user to view statistics</p>';
        downloadControls.style.display = 'none';
        gridSizeFilterControls.style.display = 'none';
    }
});

// Delete Account Event Listener
deleteAccountBtn.addEventListener('click', async () => {
    const username = statsUsernameSelect.value.trim();
    if (!username) {
        alert('Please select a user to delete');
        return;
    }
    
    // Confirm deletion
    const confirmed = confirm(`Are you sure you want to delete account "${username}"? This will permanently delete all game history for this user. This action cannot be undone.`);
    if (!confirmed) {
        return;
    }
    
    try {
        // Delete from localStorage - remove username and all game history data
        const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
        if (gameHistory[username]) {
            // Delete all game history data for this user
            delete gameHistory[username];
            // Save updated game history (username and all data removed)
            localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
            console.log(`Deleted user "${username}" and all game history from localStorage`);
        }
        
        // Verify deletion from localStorage
        const verifyHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
        if (verifyHistory[username]) {
            console.error('Warning: User still exists in localStorage after deletion');
            // Force delete again
            delete verifyHistory[username];
            localStorage.setItem('memoryGameHistory', JSON.stringify(verifyHistory));
        }
        
        // Delete from server - remove both JSON and CSV files
        try {
            const response = await fetch(`${API_BASE_URL}/delete-user/${encodeURIComponent(username)}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('User deleted from server:', data.message);
            } else {
                console.log('Server deletion failed, but localStorage deletion succeeded');
            }
        } catch (error) {
            console.log('Server not available, deleted from localStorage only:', error);
        }
        
        // Clear statistics display
        statisticsContent.innerHTML = '<p class="no-stats-message">Account deleted successfully</p>';
        downloadControls.style.display = 'none';
        gridSizeFilterControls.style.display = 'none';
        deleteAccountBtn.style.display = 'none';
        
        // Reset username selection
        statsUsernameSelect.value = '';
        
        // Update username list (removes username from dropdown)
        await updateStatsUsernameList(false);
        
        // Clear current user games from memory
        currentUserGames = [];
        
        // Verify username is removed from dropdown
        const usernameInList = statsUsernameSelect.querySelector(`option[value="${username}"]`);
        if (usernameInList) {
            console.error('Warning: Username still exists in dropdown after deletion');
            usernameInList.remove();
        }
        
        alert(`Account "${username}" and all game history have been permanently deleted.`);
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
    }
});

// Download History Event Listener
downloadBtn.addEventListener('click', async () => {
    const username = statsUsernameSelect.value.trim();
    if (!username) {
        alert('Please select a user first');
        return;
    }
    
    const format = downloadFormat.value || 'csv';
    
    // Get games from localStorage first (always available)
    const games = await getGameHistory(username);
    if (games.length === 0) {
        alert('No game history found for this user');
        return;
    }
    
    // Try to download from server first, fallback to localStorage
    let downloadSuccess = false;
    
    try {
        // Try to download from server
        const response = await fetch(`${API_BASE_URL}/download/${encodeURIComponent(username)}/${format}`, {
            method: 'GET',
            headers: {
                'Accept': format === 'csv' ? 'text/csv' : 'application/json'
            }
        });
        
        if (response.ok && response.status === 200) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${username}_history.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            downloadSuccess = true;
        }
    } catch (error) {
        console.log('Server download failed, using localStorage:', error);
        // Continue to localStorage fallback
    }
    
    // If server download failed, create file from localStorage
    if (!downloadSuccess) {
        try {
            let content, filename, mimeType;
            
            if (format === 'csv') {
                // Create CSV
                const header = 'Date,Time (seconds),Moves,Grid Size\n';
                const rows = games.map(game => {
                    const dateStr = new Date(game.date).toISOString();
                    // Escape commas in CSV
                    return `${dateStr},${game.time},${game.moves},${game.gridSize}x${game.gridSize}`;
                }).join('\n');
                content = header + rows;
                filename = `${username}_history.csv`;
                mimeType = 'text/csv;charset=utf-8;';
            } else {
                // Create JSON
                content = JSON.stringify(games, null, 2);
                filename = `${username}_history.json`;
                mimeType = 'application/json;charset=utf-8;';
            }
            
            // Create blob and download
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            downloadSuccess = true;
        } catch (error) {
            console.error('Error creating download file:', error);
            alert('Error downloading file. Please try again.');
            return;
        }
    }
    
    // Show success message
    if (downloadSuccess) {
        downloadStatus.style.display = 'inline';
        downloadStatus.textContent = '✓ Downloaded successfully';
        setTimeout(() => {
            downloadStatus.style.display = 'none';
        }, 3000);
    }
});

// Event listeners
startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    // Validate username
    if (!username) {
        usernameError.style.display = 'block';
        usernameInput.focus();
        usernameInput.style.borderColor = 'red';
        return;
    }
    
    // Hide error if username is valid
    usernameError.style.display = 'none';
    usernameInput.style.borderColor = '#667eea';
    
    initGame();
    gameState.isGameStarted = true;
    gameState.isPaused = false;
    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    // Keep grid size selector enabled so users can change it
    usernameInput.disabled = true;
});

resetBtn.addEventListener('click', () => {
    stopTimer();
    initGame();
    gameState.isGameStarted = false;
    gameState.isPaused = false;
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    // Keep grid size selector enabled
    usernameInput.disabled = false;
    usernameError.style.display = 'none';
    usernameInput.style.borderColor = '#667eea';
    pauseBtn.style.display = 'none';
});

// Pause/Resume button
pauseBtn.addEventListener('click', () => {
    if (gameState.isPaused) {
        resumeTimer();
    } else {
        pauseTimer();
    }
});

restartBtn.addEventListener('click', () => {
    winModal.classList.remove('show');
    
    // Stop timer completely and reset
    stopTimer();
    gameState.timer = 0;
    gameState.isGameStarted = false;
    gameState.isPaused = false;
    
    // Initialize game (this will also stop timer and reset state)
    initGame();
    
    // Don't auto-start - let user click Start Game button
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    // Keep grid size selector enabled
    usernameInput.disabled = false;
    pauseBtn.style.display = 'none';
    
    // Update display to show 00:00
    updateDisplay();
});

// Grid size change event listener - allow users to change grid size anytime
gridSizeSelect.addEventListener('change', () => {
    // If game is in progress, reset it with new grid size
    if (gameState.isGameStarted) {
        stopTimer();
        gameState.timer = 0;
        gameState.isPaused = false;
        initGame();
        // Keep game started state if it was started
        // But reset moves and timer
        gameState.moves = 0;
        updateDisplay();
        pauseBtn.style.display = 'none';
    } else {
        // If game not started, just reinitialize with new grid size
        initGame();
    }
});

// Clear error message when user starts typing
usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim()) {
        usernameError.style.display = 'none';
        usernameInput.style.borderColor = '#667eea';
    }
});

// Initialize on page load
initGame();
updateStatsUsernameList();

