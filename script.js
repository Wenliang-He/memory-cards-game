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
    gridSize: 4,  // Default 4x4
    theme: 'animals'  // Track theme used for current game
};

// Emoji themes - each theme has 40+ emojis for maximum grid size (9x9 = 40 pairs)
const emojiThemes = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
              '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
              '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
              '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎',
              '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳'],
    
    food: ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍊', '🍋', '🍉', '🍐',
            '🍏', '🍈', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
            '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞',
            '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖',
            '🍕', '🌮', '🌯', '🥙', '🥪', '🌭', '🍔', '🍟', '🍿', '🧂'],
    
    nature: ['🌳', '🌲', '🌴', '🌵', '🌱', '🌿', '☘️', '🍀', '🍃', '🍂',
              '🍁', '🍄', '🌾', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻',
              '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑',
              '🌒', '🌓', '🌔', '🌙', '⭐', '🌟', '💫', '✨', '⚡', '☄️',
              '💥', '🔥', '🌈', '☀️', '⛅', '☁️', '⛈️', '🌤️', '🌦️', '🌧️'],
    
    sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
              '🥅', '🏒', '🏑', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽',
              '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸',
              '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🚣', '🧗',
              '🚵', '🚴', '🏃', '🚶', '🏃‍♀️', '🚶‍♀️', '🧍', '🧎', '🏃‍♂️', '🚶‍♂️'],
    
    objects: ['📦', '📱', '💻', '⌚', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '🕹️',
               '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️',
               '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️',
               '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡',
               '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰'],
    
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
             '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚',
             '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
             '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
             '😮', '🤤', '😴', '😪', '😵', '🤢', '🤮', '🤧', '😷', '🤒'],
    
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
                '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔',
                '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝',
                '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫',
                '🛬', '🛩️', '💺', '🚁', '🚀', '🛸', '🚤', '🛥️', '⛵', '🚢'],
    
    symbols: ['⭐', '🌟', '💫', '✨', '⚡', '☄️', '💥', '🔥', '🌈', '☀️',
               '⛅', '☁️', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '❄️', '☃️',
               '⛄', '🌨️', '💧', '☔', '☂️', '🌊', '🌫️', '💨', '🌪️', '🌬️',
               '🎈', '🎉', '🎊', '🎁', '🎀', '🎂', '🎃', '🎄', '🎅', '🤶',
               '🎆', '🎇', '🧨', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇']
};

// Emoji name mapping - maps each emoji to its descriptive name
const emojiNames = {
    // Animals
    '🐶': 'Dog', '🐱': 'Cat', '🐭': 'Mouse', '🐹': 'Hamster', '🐰': 'Rabbit',
    '🦊': 'Fox', '🐻': 'Bear', '🐼': 'Panda', '🐨': 'Koala', '🐯': 'Tiger',
    '🦁': 'Lion', '🐮': 'Cow', '🐷': 'Pig', '🐸': 'Frog', '🐵': 'Monkey',
    '🐔': 'Chicken', '🐧': 'Penguin', '🐦': 'Bird', '🐤': 'Baby Chick', '🦆': 'Duck',
    '🦅': 'Eagle', '🦉': 'Owl', '🦇': 'Bat', '🐺': 'Wolf', '🐗': 'Boar',
    '🐴': 'Horse', '🦄': 'Unicorn', '🐝': 'Bee', '🐛': 'Bug', '🦋': 'Butterfly',
    '🐌': 'Snail', '🐞': 'Ladybug', '🐜': 'Ant', '🦟': 'Mosquito', '🦗': 'Cricket',
    '🕷️': 'Spider', '🦂': 'Scorpion', '🐢': 'Turtle', '🐍': 'Snake', '🦎': 'Lizard',
    '🐙': 'Octopus', '🦑': 'Squid', '🦐': 'Shrimp', '🦞': 'Lobster', '🦀': 'Crab',
    '🐡': 'Blowfish', '🐠': 'Tropical Fish', '🐟': 'Fish', '🐬': 'Dolphin', '🐳': 'Whale',
    
    // Food & Drinks
    '🍎': 'Red Apple', '🍌': 'Banana', '🍇': 'Grapes', '🍓': 'Strawberry', '🍒': 'Cherries',
    '🍑': 'Peach', '🍊': 'Orange', '🍋': 'Lemon', '🍉': 'Watermelon', '🍐': 'Pear',
    '🍏': 'Green Apple', '🍈': 'Melon', '🥭': 'Mango', '🍍': 'Pineapple', '🥥': 'Coconut',
    '🥝': 'Kiwi', '🍅': 'Tomato', '🍆': 'Eggplant', '🥑': 'Avocado', '🥦': 'Broccoli',
    '🥬': 'Leafy Greens', '🥒': 'Cucumber', '🌶️': 'Hot Pepper', '🌽': 'Corn', '🥕': 'Carrot',
    '🥔': 'Potato', '🍠': 'Sweet Potato', '🥐': 'Croissant', '🥯': 'Bagel', '🍞': 'Bread',
    '🥖': 'Baguette', '🥨': 'Pretzel', '🧀': 'Cheese', '🥚': 'Egg', '🍳': 'Fried Egg',
    '🥞': 'Pancakes', '🥓': 'Bacon', '🥩': 'Meat', '🍗': 'Poultry Leg', '🍖': 'Meat on Bone',
    '🍕': 'Pizza', '🌮': 'Taco', '🌯': 'Burrito', '🥙': 'Stuffed Flatbread', '🥪': 'Sandwich',
    '🌭': 'Hot Dog', '🍔': 'Hamburger', '🍟': 'French Fries', '🍿': 'Popcorn', '🧂': 'Salt',
    
    // Nature
    '🌳': 'Tree', '🌲': 'Evergreen Tree', '🌴': 'Palm Tree', '🌵': 'Cactus', '🌱': 'Seedling',
    '🌿': 'Herb', '☘️': 'Shamrock', '🍀': 'Four Leaf Clover', '🍃': 'Leaf', '🍂': 'Fallen Leaf',
    '🍁': 'Maple Leaf', '🍄': 'Mushroom', '🌾': 'Sheaf of Rice', '🌷': 'Tulip', '🌹': 'Rose',
    '🥀': 'Wilted Flower', '🌺': 'Hibiscus', '🌸': 'Cherry Blossom', '🌼': 'Daisy', '🌻': 'Sunflower',
    '🌞': 'Sun with Face', '🌝': 'Full Moon Face', '🌛': 'First Quarter Moon', '🌜': 'Last Quarter Moon',
    '🌚': 'New Moon Face', '🌕': 'Full Moon', '🌖': 'Waning Gibbous Moon', '🌗': 'Last Quarter Moon',
    '🌘': 'Waning Crescent Moon', '🌑': 'New Moon', '🌒': 'Waxing Crescent Moon', '🌓': 'First Quarter Moon',
    '🌔': 'Waxing Gibbous Moon', '🌙': 'Crescent Moon', '⭐': 'Star', '🌟': 'Glowing Star', '💫': 'Dizzy',
    '✨': 'Sparkles', '⚡': 'Lightning', '☄️': 'Comet', '💥': 'Collision', '🔥': 'Fire',
    '🌈': 'Rainbow', '☀️': 'Sun', '⛅': 'Sun Behind Cloud', '☁️': 'Cloud', '⛈️': 'Cloud with Lightning',
    '🌤️': 'Sun Behind Small Cloud', '🌦️': 'Sun Behind Rain Cloud', '🌧️': 'Cloud with Rain',
    
    // Sports & Activities
    '⚽': 'Soccer Ball', '🏀': 'Basketball', '🏈': 'American Football', '⚾': 'Baseball', '🎾': 'Tennis',
    '🏐': 'Volleyball', '🏉': 'Rugby Football', '🎱': 'Pool 8 Ball', '🏓': 'Ping Pong', '🏸': 'Badminton',
    '🥅': 'Goal Net', '🏒': 'Ice Hockey', '🏑': 'Field Hockey', '🏏': 'Cricket', '⛳': 'Flag in Hole',
    '🏹': 'Bow and Arrow', '🎣': 'Fishing Pole', '🥊': 'Boxing Glove', '🥋': 'Martial Arts Uniform', '🎽': 'Running Shirt',
    '🛹': 'Skateboard', '🛷': 'Sled', '⛸️': 'Ice Skate', '🥌': 'Curling Stone', '🎿': 'Skis',
    '⛷️': 'Skier', '🏂': 'Snowboarder', '🏋️': 'Person Lifting Weights', '🤼': 'Wrestlers', '🤸': 'Person Cartwheeling',
    '🤺': 'Fencer', '⛹️': 'Person Bouncing Ball', '🤾': 'Person Playing Handball', '🏌️': 'Person Golfing', '🏇': 'Horse Racing',
    '🧘': 'Person in Lotus Position', '🏄': 'Surfer', '🏊': 'Swimmer', '🚣': 'Person Rowing Boat', '🧗': 'Person Climbing',
    '🚵': 'Mountain Bicyclist', '🚴': 'Bicyclist', '🏃': 'Runner', '🚶': 'Person Walking', '🏃‍♀️': 'Woman Running',
    '🚶‍♀️': 'Woman Walking', '🧍': 'Person Standing', '🧎': 'Person Kneeling', '🏃‍♂️': 'Man Running', '🚶‍♂️': 'Man Walking',
    
    // Objects & Items
    '📦': 'Package', '📱': 'Mobile Phone', '💻': 'Laptop', '⌚': 'Watch', '🖥️': 'Desktop Computer',
    '🖨️': 'Printer', '⌨️': 'Keyboard', '🖱️': 'Computer Mouse', '🖲️': 'Trackball', '🕹️': 'Joystick',
    '🗜️': 'Clamp', '💾': 'Floppy Disk', '💿': 'Optical Disk', '📀': 'DVD', '📼': 'Videocassette',
    '📷': 'Camera', '📸': 'Camera with Flash', '📹': 'Video Camera', '🎥': 'Movie Camera', '📽️': 'Film Projector',
    '🎞️': 'Film Frames', '📞': 'Telephone Receiver', '☎️': 'Telephone', '📟': 'Pager', '📠': 'Fax Machine',
    '📺': 'Television', '📻': 'Radio', '🎙️': 'Studio Microphone', '🎚️': 'Level Slider', '🎛️': 'Control Knobs',
    '⏱️': 'Stopwatch', '⏲️': 'Timer Clock', '⏰': 'Alarm Clock', '🕰️': 'Mantelpiece Clock', '⌛': 'Hourglass',
    '⏳': 'Hourglass Not Done', '📡': 'Satellite Antenna', '🔋': 'Battery', '🔌': 'Electric Plug', '💡': 'Light Bulb',
    '🔦': 'Flashlight', '🕯️': 'Candle', '🧯': 'Fire Extinguisher', '🛢️': 'Oil Drum', '💸': 'Money with Wings',
    '💵': 'Dollar Banknote', '💴': 'Yen Banknote', '💶': 'Euro Banknote', '💷': 'Pound Banknote', '💰': 'Money Bag',
    
    // Faces & Emotions
    '😀': 'Grinning Face', '😃': 'Grinning Face with Big Eyes', '😄': 'Grinning Face with Smiling Eyes', '😁': 'Beaming Face', '😆': 'Squinting Face',
    '😅': 'Grinning Face with Sweat', '🤣': 'Rolling on Floor Laughing', '😂': 'Face with Tears of Joy', '🙂': 'Slightly Smiling Face', '🙃': 'Upside-Down Face',
    '😉': 'Winking Face', '😊': 'Smiling Face with Smiling Eyes', '😇': 'Smiling Face with Halo', '🥰': 'Smiling Face with Hearts', '😍': 'Star-Struck',
    '🤩': 'Face with Star Eyes', '😘': 'Face Blowing a Kiss', '😗': 'Kissing Face', '☺️': 'Smiling Face', '😚': 'Kissing Face with Closed Eyes',
    '😙': 'Kissing Face with Smiling Eyes', '😋': 'Face Savoring Food', '😛': 'Face with Tongue', '😜': 'Winking Face with Tongue', '🤪': 'Zany Face',
    '😝': 'Squinting Face with Tongue', '🤑': 'Money-Mouth Face', '🤗': 'Hugging Face', '🤭': 'Face with Hand Over Mouth', '🤫': 'Shushing Face',
    '🤔': 'Thinking Face', '🤐': 'Zipper-Mouth Face', '🤨': 'Face with Raised Eyebrow', '😐': 'Neutral Face', '😑': 'Expressionless Face',
    '😶': 'Face Without Mouth', '😏': 'Smirking Face', '😒': 'Unamused Face', '🙄': 'Face with Rolling Eyes', '😬': 'Grimacing Face',
    '😮': 'Face with Open Mouth', '🤤': 'Drooling Face', '😴': 'Sleeping Face', '😪': 'Sleepy Face', '😵': 'Dizzy Face',
    '🤢': 'Nauseated Face', '🤮': 'Face Vomiting', '🤧': 'Sneezing Face', '😷': 'Face with Medical Mask', '🤒': 'Face with Thermometer',
    
    // Vehicles
    '🚗': 'Car', '🚕': 'Taxi', '🚙': 'Sport Utility Vehicle', '🚌': 'Bus', '🚎': 'Trolleybus',
    '🏎️': 'Racing Car', '🚓': 'Police Car', '🚑': 'Ambulance', '🚒': 'Fire Engine', '🚐': 'Minibus',
    '🚚': 'Delivery Truck', '🚛': 'Articulated Lorry', '🚜': 'Tractor', '🛴': 'Kick Scooter', '🚲': 'Bicycle',
    '🛵': 'Motor Scooter', '🏍️': 'Motorcycle', '🛺': 'Auto Rickshaw', '🚨': 'Police Car Light', '🚔': 'Oncoming Police Car',
    '🚍': 'Oncoming Bus', '🚘': 'Oncoming Automobile', '🚖': 'Oncoming Taxi', '🚡': 'Aerial Tramway', '🚠': 'Mountain Railway',
    '🚟': 'Suspension Railway', '🚃': 'Tram Car', '🚋': 'Tram', '🚞': 'Mountain Railway', '🚝': 'Monorail',
    '🚄': 'High-Speed Train', '🚅': 'Bullet Train', '🚈': 'Light Rail', '🚂': 'Locomotive', '🚆': 'Train',
    '🚇': 'Metro', '🚊': 'Tram', '🚉': 'Station', '✈️': 'Airplane', '🛫': 'Airplane Departure',
    '🛬': 'Airplane Arrival', '🛩️': 'Small Airplane', '💺': 'Seat', '🚁': 'Helicopter', '🚀': 'Rocket',
    '🛸': 'Flying Saucer', '🚤': 'Speedboat', '🛥️': 'Motor Boat', '⛵': 'Sailboat', '🚢': 'Ship',
    
    // Symbols & Shapes
    '⭐': 'Star', '🌟': 'Glowing Star', '💫': 'Dizzy', '✨': 'Sparkles', '⚡': 'Lightning',
    '☄️': 'Comet', '💥': 'Collision', '🔥': 'Fire', '🌈': 'Rainbow', '☀️': 'Sun',
    '⛅': 'Sun Behind Cloud', '☁️': 'Cloud', '⛈️': 'Cloud with Lightning', '🌤️': 'Sun Behind Small Cloud',
    '🌦️': 'Sun Behind Rain Cloud', '🌧️': 'Cloud with Rain', '🌩️': 'Cloud with Lightning and Rain', '❄️': 'Snowflake',
    '☃️': 'Snowman', '⛄': 'Snowman Without Snow', '🌨️': 'Cloud with Snow', '💧': 'Droplet', '☔': 'Umbrella with Rain Drops',
    '☂️': 'Umbrella', '🌊': 'Water Wave', '🌫️': 'Fog', '💨': 'Dashing Away', '🌪️': 'Tornado',
    '🌬️': 'Wind Face', '🎈': 'Balloon', '🎉': 'Party Popper', '🎊': 'Confetti Ball', '🎁': 'Wrapped Gift',
    '🎀': 'Ribbon', '🎂': 'Birthday Cake', '🎃': 'Jack-O-Lantern', '🎄': 'Christmas Tree', '🎅': 'Santa Claus',
    '🤶': 'Mrs. Claus', '🎆': 'Fireworks', '🎇': 'Sparkler', '🧨': 'Firecracker', '🎗️': 'Reminder Ribbon',
    '🎟️': 'Admission Tickets', '🎫': 'Ticket', '🎖️': 'Military Medal', '🏆': 'Trophy', '🏅': 'Sports Medal',
    '🥇': '1st Place Medal'
};

// Function to get emoji name
// Custom emoji names storage (user-defined overrides)
let customEmojiNames = {};

// Load custom emoji names from localStorage
function loadCustomEmojiNames() {
    const saved = localStorage.getItem('memoryGameCustomEmojiNames');
    if (saved) {
        try {
            customEmojiNames = JSON.parse(saved);
        } catch (e) {
            customEmojiNames = {};
        }
    }
}

// Save custom emoji names to localStorage
function saveCustomEmojiNames() {
    localStorage.setItem('memoryGameCustomEmojiNames', JSON.stringify(customEmojiNames));
}

// Get emoji name (checks custom names first, then defaults)
function getEmojiName(emoji) {
    if (customEmojiNames[emoji]) {
        return customEmojiNames[emoji];
    }
    return emojiNames[emoji] || 'Unknown';
}

// Set custom emoji name
function setCustomEmojiName(emoji, customName) {
    if (customName && customName.trim()) {
        customEmojiNames[emoji] = customName.trim();
    } else {
        delete customEmojiNames[emoji];
    }
    saveCustomEmojiNames();
}

// Edit emoji name in the matched pairs list
function editEmojiName(matchItem, emoji) {
    const nameSpan = matchItem.querySelector('.emoji-name-display');
    const currentName = nameSpan.textContent;
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.style.cssText = 'flex: 1; padding: 2px 5px; border: 2px solid #4caf50; border-radius: 3px; font-size: inherit;';
    input.maxLength = 50;
    
    // Replace name span with input
    const parent = nameSpan.parentNode;
    parent.replaceChild(input, nameSpan);
    input.focus();
    input.select();
    
    // Save on Enter or blur
    const saveName = () => {
        const newName = input.value.trim();
        if (newName) {
            setCustomEmojiName(emoji, newName);
            nameSpan.textContent = newName;
        } else {
            // If empty, revert to default name
            const defaultName = emojiNames[emoji] || 'Unknown';
            setCustomEmojiName(emoji, ''); // Clear custom name
            nameSpan.textContent = defaultName;
        }
        parent.replaceChild(nameSpan, input);
    };
    
    input.addEventListener('blur', saveName);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            input.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            nameSpan.textContent = currentName; // Revert to original
            parent.replaceChild(nameSpan, input);
        }
    });
}

// Toggle emoji selection in preview
function toggleEmojiSelection(emoji, gridSize) {
    const key = `${gridSize}_${currentTheme}`;
    
    // Initialize if doesn't exist
    if (!selectedEmojisByGridSize[key]) {
        selectedEmojisByGridSize[key] = [];
    }
    
    const selectedEmojis = selectedEmojisByGridSize[key];
    const index = selectedEmojis.indexOf(emoji);
    
    if (index > -1) {
        // Deselect: remove from array
        selectedEmojis.splice(index, 1);
    } else {
        // Select: add to array (but check if we have space)
        const totalCards = gridSize * gridSize;
        const numPairs = Math.floor(totalCards / 2);
        
        if (selectedEmojis.length < numPairs) {
            selectedEmojis.push(emoji);
        }
    }
    
    // Save the updated selection
    saveSelectedEmojis();
    
    // Update preview to reflect changes
    updateEmojiPreview();
}

// Function to get random theme
function getRandomTheme() {
    const themeKeys = Object.keys(emojiThemes);
    const randomIndex = Math.floor(Math.random() * themeKeys.length);
    return themeKeys[randomIndex];
}

// Load saved theme from localStorage or default to 'random'
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('memoryGameTheme');
    if (savedTheme && (savedTheme === 'random' || emojiThemes[savedTheme])) {
        return savedTheme;
    }
    return 'random'; // Default to random on first load
}

// Save theme to localStorage
function saveTheme(theme) {
    localStorage.setItem('memoryGameTheme', theme);
}

// Default emoji pool - will be set based on saved theme
let currentEmojis = emojiThemes.animals;
let currentTheme = loadSavedTheme(); // Load saved theme or default to 'random'

// Store selected emojis per grid size
let selectedEmojisByGridSize = {};

// Load selected emojis from localStorage
function loadSelectedEmojis() {
    const saved = localStorage.getItem('memoryGameSelectedEmojis');
    if (saved) {
        try {
            selectedEmojisByGridSize = JSON.parse(saved);
        } catch (e) {
            selectedEmojisByGridSize = {};
        }
    }
}

// Save selected emojis to localStorage
function saveSelectedEmojis() {
    localStorage.setItem('memoryGameSelectedEmojis', JSON.stringify(selectedEmojisByGridSize));
}

// Get selected emojis for a grid size (or generate new ones if not exists)
function getSelectedEmojisForGridSize(gridSize, themeEmojis) {
    const key = `${gridSize}_${currentTheme}`;
    const totalCards = gridSize * gridSize;
    const numPairs = Math.floor(totalCards / 2);
    
    let selectedEmojis = [];
    
    // If we have saved emojis for this grid size and theme, use them
    if (selectedEmojisByGridSize[key] && selectedEmojisByGridSize[key].length > 0) {
        selectedEmojis = [...selectedEmojisByGridSize[key]];
    }
    
    // If not enough emojis selected, auto-fill with random selections
    if (selectedEmojis.length < numPairs) {
        const needed = numPairs - selectedEmojis.length;
        const availableEmojis = themeEmojis.filter(emoji => !selectedEmojis.includes(emoji));
        const shuffled = [...availableEmojis].sort(() => Math.random() - 0.5);
        const additionalEmojis = shuffled.slice(0, needed);
        selectedEmojis = [...selectedEmojis, ...additionalEmojis];
        
        // Save the auto-filled selection
        selectedEmojisByGridSize[key] = selectedEmojis;
        saveSelectedEmojis();
    }
    
    // Ensure we don't exceed the required number
    return selectedEmojis.slice(0, numPairs);
}

// Generate random emoji selection for a grid size
function generateRandomEmojiSelection(gridSize, themeEmojis) {
    const totalCards = gridSize * gridSize;
    const numPairs = Math.floor(totalCards / 2);
    
    // Shuffle and select random emojis
    const shuffled = [...themeEmojis].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numPairs);
}

// Save selected emojis for current grid size and theme
function saveEmojiSelectionForCurrentGridSize(emojis) {
    const gridSize = parseInt(settingsGridSizeSelect.value);
    const key = `${gridSize}_${currentTheme}`;
    selectedEmojisByGridSize[key] = emojis;
    saveSelectedEmojis();
}

// DOM elements
const gameBoard = document.getElementById('game-board');
const matchedPairDisplay = document.getElementById('matched-pair-display');
const matchedPairsList = document.getElementById('matched-pairs-list');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const gridSizeSelect = document.getElementById('grid-size');
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const winModal = document.getElementById('win-modal');
const settingsTab = document.getElementById('settings-tab');
const emojiThemeSelect = document.getElementById('emoji-theme');
const settingsGridSizeSelect = document.getElementById('settings-grid-size');
const randomSelectionBtn = document.getElementById('random-selection-btn');
const emojiPreview = document.getElementById('emoji-preview');
const emojiCount = document.getElementById('emoji-count');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const restartBtn = document.getElementById('restart-btn');
const reviewResultBtn = document.getElementById('review-result-btn');
const pauseBtn = document.getElementById('pause-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const gameTab = document.getElementById('game-tab');
const statisticsTab = document.getElementById('statistics-tab');
const statsUsernameSelect = document.getElementById('stats-username');
const statisticsContent = document.getElementById('statistics-content');
const usernameError = document.getElementById('username-error');
const downloadControls = document.querySelector('.download-controls');
const downloadFormat = document.getElementById('download-format');
const downloadBtn = document.getElementById('download-btn');
const downloadStatus = document.getElementById('download-status');
const gridSizeFilterControls = document.getElementById('grid-size-filter-controls');
const chartGridSizeSelect = document.getElementById('chart-grid-size');
const chartThemeSelect = document.getElementById('chart-theme');
const deleteAccountBtn = document.getElementById('delete-account-btn');

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize game
function initGame() {
    const gridSize = parseInt(gridSizeSelect.value);
    gameState.gridSize = gridSize;
    
    // Preserve theme - don't reset it if already set
    // Only reset if gameState.theme is not set
    if (!gameState.theme) {
        // If theme not set, use currentTheme or default to 'animals'
        gameState.theme = currentTheme || 'animals';
    }
    
    // Clear matched pairs list when game resets
    if (matchedPairsList) {
        matchedPairsList.innerHTML = '';
    }
    
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
    
    // Get selected emojis for current grid size and theme
    const selectedEmojis = getSelectedEmojisForGridSize(gameState.gridSize, currentEmojis);
    
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
        
        // Add matched emoji to the list (append, don't replace)
        const emojiName = getEmojiName(firstCard.emoji);
        if (matchedPairsList) {
            const matchItem = document.createElement('div');
            matchItem.className = 'matched-pair-item';
            matchItem.style.cssText = 'padding: 5px 10px; background: white; border-radius: 5px; border-left: 3px solid #4caf50; cursor: pointer; display: flex; align-items: center; gap: 8px;';
            matchItem.dataset.emoji = firstCard.emoji;
            
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = firstCard.emoji;
            emojiSpan.style.cssText = 'font-size: 1.2em;';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'emoji-name-display';
            nameSpan.textContent = emojiName;
            nameSpan.style.cssText = 'flex: 1;';
            
            const editIcon = document.createElement('span');
            editIcon.textContent = '✏️';
            editIcon.style.cssText = 'font-size: 0.8em; opacity: 0.6; margin-left: auto;';
            editIcon.title = 'Click to edit name';
            
            matchItem.appendChild(emojiSpan);
            matchItem.appendChild(nameSpan);
            matchItem.appendChild(editIcon);
            
            // Make it editable
            matchItem.addEventListener('click', () => {
                editEmojiName(matchItem, firstCard.emoji);
            });
            
            matchedPairsList.appendChild(matchItem);
        }
        
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
    
    console.log('=== GAME END ===');
    console.log('gameState.theme:', gameState.theme);
    console.log('currentTheme:', currentTheme);
    console.log('emojiThemeSelect.value:', emojiThemeSelect ? emojiThemeSelect.value : 'N/A');
    
    // Save game history
    const username = usernameInput.value.trim();
    if (username) {
        // Use theme from gameState (captured when game started) - this is the most reliable
        // Fallback to currentTheme if gameState.theme is somehow missing
        const themeToSave = gameState.theme || currentTheme || 'animals';
        console.log('Theme to save:', themeToSave);
        console.log('Calling saveGameHistory with theme:', themeToSave);
        await saveGameHistory(username, gameState.timer, gameState.moves, gameState.gridSize, themeToSave);
        // Update username list immediately after saving
        await updateStatsUsernameList();
        
        // Track last played game info for Statistics tab
        lastPlayedUsername = username;
        lastPlayedGridSize = gameState.gridSize.toString();
        lastPlayedTheme = themeToSave; // Track the theme that was just played
    }
    
    winModal.classList.add('show');
}

// Game History Storage - Hybrid approach (localStorage + backend)
async function saveGameHistory(username, time, moves, gridSize, theme = 'animals') {
    console.log('saveGameHistory called with:', { username, time, moves, gridSize, theme });
    
    // Ensure theme is valid (not 'random' or undefined)
    const validTheme = (theme && theme !== 'random') ? theme : 'animals';
    console.log('Validated theme:', validTheme);
    
    const gameData = {
        time: time,
        moves: moves,
        gridSize: gridSize,
        theme: validTheme, // Use validated theme
        date: new Date().toISOString()
    };
    
    console.log('Game data to save:', gameData);
    
    // Save to localStorage (for quick access)
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory') || '{}');
    
    if (!gameHistory[username]) {
        gameHistory[username] = [];
    }
    
    gameHistory[username].push(gameData);
    localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
    
    console.log('Saved to localStorage. Last game:', gameHistory[username][gameHistory[username].length - 1]);
    
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
            console.log('Game history saved to server with theme:', validTheme);
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
    console.log('getGameHistory - localStorageGames:', localStorageGames);
    console.log('getGameHistory - sample themes from localStorage:', localStorageGames.slice(0, 3).map(g => ({ date: g.date, theme: g.theme })));
    
    // Try to get from server and merge (but only if username matches exactly)
    try {
        const response = await fetch(`${API_BASE_URL}/get-history/${encodeURIComponent(username)}`);
        if (response.ok) {
            const data = await response.json();
            console.log('getGameHistory - server response:', data);
            if (data.success && data.games && data.games.length > 0) {
                console.log('getGameHistory - server games:', data.games);
                console.log('getGameHistory - sample themes from server:', data.games.slice(0, 3).map(g => ({ date: g.date, theme: g.theme })));
                // Merge server games with localStorage games
                // Use Set to avoid duplicates based on date
                const gameMap = new Map();
                
                // Add localStorage games FIRST (they have correct themes)
                localStorageGames.forEach(game => {
                    const key = `${game.date}_${game.time}_${game.moves}`;
                    gameMap.set(key, game);
                });
                
                // Add server games (they will overwrite if duplicate, but preserve theme from localStorage if server doesn't have it)
                data.games.forEach(game => {
                    const key = `${game.date}_${game.time}_${game.moves}`;
                    const existingGame = gameMap.get(key);
                    if (existingGame) {
                        // If localStorage game exists, prefer its theme if server game doesn't have one
                        if (!game.theme && existingGame.theme) {
                            game.theme = existingGame.theme;
                        }
                    }
                    gameMap.set(key, game);
                });
                
                const mergedGames = Array.from(gameMap.values());
                console.log('getGameHistory - merged games:', mergedGames);
                console.log('getGameHistory - sample themes from merged:', mergedGames.slice(0, 3).map(g => ({ date: g.date, theme: g.theme })));
                
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
    console.log('getGameHistory - returning localStorageGames:', localStorageGames);
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

// Save username and grid size to localStorage
function saveLastUsername(username) {
    if (username) {
        localStorage.setItem('memoryGameLastUsername', username);
    }
}

function saveLastGridSize(gridSize) {
    if (gridSize) {
        localStorage.setItem('memoryGameLastGridSize', gridSize.toString());
    }
}

function loadLastUsername() {
    return localStorage.getItem('memoryGameLastUsername') || '';
}

function loadLastGridSize() {
    return localStorage.getItem('memoryGameLastGridSize') || '4';
}

// Track last played game info for auto-selection in Statistics tab
let lastPlayedUsername = null;
let lastPlayedGridSize = null;
let lastPlayedTheme = null;

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
        if (tabName === 'settings') {
            settingsTab.classList.add('active');
            gameTab.classList.remove('active');
            statisticsTab.classList.remove('active');
            // Sync settings grid size with game grid size
            if (settingsGridSizeSelect) {
                settingsGridSizeSelect.value = gridSizeSelect.value;
            }
            updateEmojiPreview();
        } else if (tabName === 'game') {
            settingsTab.classList.remove('active');
            gameTab.classList.add('active');
            statisticsTab.classList.remove('active');
        } else {
            settingsTab.classList.remove('active');
            gameTab.classList.remove('active');
            statisticsTab.classList.add('active');
            
            // Refresh username list when switching to Statistics tab
            await updateStatsUsernameList();
            
            // Determine which username to select:
            // 1. If user just played a game, use that username
            // 2. Otherwise, use previously selected username
            // 3. Otherwise, use last saved username
            let usernameToSelect = null;
            
            if (lastPlayedUsername) {
                // User just played a game, use that username
                usernameToSelect = lastPlayedUsername;
                lastPlayedUsername = null; // Clear after using
            } else if (selectedUsername) {
                // Use previously selected username
                usernameToSelect = selectedUsername;
            } else {
                // Use last saved username
                usernameToSelect = loadLastUsername();
            }
            
            // Select username if valid
            if (usernameToSelect) {
                const option = statsUsernameSelect.querySelector(`option[value="${usernameToSelect}"]`);
                if (option) {
                    statsUsernameSelect.value = usernameToSelect;
                    // Automatically load statistics for the selected user
                    await displayStatistics(usernameToSelect);
                    
                    // If user just played a game, also set grid size filter and theme filter
                    if (lastPlayedGridSize) {
                        const gridSizeOption = chartGridSizeSelect.querySelector(`option[value="${lastPlayedGridSize}"]`);
                        if (gridSizeOption) {
                            chartGridSizeSelect.value = lastPlayedGridSize;
                            updateStatisticsDisplay();
                        }
                        lastPlayedGridSize = null; // Clear after using
                    }
                    
                    // Set theme filter to last played theme
                    if (lastPlayedTheme) {
                        const themeOption = chartThemeSelect.querySelector(`option[value="${lastPlayedTheme}"]`);
                        if (themeOption) {
                            chartThemeSelect.value = lastPlayedTheme;
                            updateStatisticsDisplay();
                        }
                        lastPlayedTheme = null; // Clear after using
                    }
                } else {
                    // Username not found, just show empty state
                    statisticsContent.innerHTML = '<p class="no-stats-message">Select a user to view statistics</p>';
                }
            } else {
                // No username to select, show empty state
                statisticsContent.innerHTML = '<p class="no-stats-message">Select a user to view statistics</p>';
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

// Filter games by theme
function filterGamesByTheme(games, theme) {
    if (theme === 'all' || !theme) {
        return games;
    }
    return games.filter(game => {
        const gameTheme = game.theme || 'animals'; // Default to animals for old records
        return gameTheme === theme;
    });
}

// Get all unique themes from games
function getUniqueThemes(games) {
    const themes = new Set();
    console.log('getUniqueThemes called with games:', games);
    games.forEach(game => {
        const theme = game.theme || 'animals'; // Default to animals for old records
        console.log('Game theme:', theme, 'for game:', game);
        themes.add(theme);
    });
    const uniqueThemes = Array.from(themes).sort();
    console.log('Unique themes found:', uniqueThemes);
    return uniqueThemes;
}

// Helper function to get theme display name (plain text, no emojis)
function getThemeDisplayName(theme) {
    const themeNames = {
        'animals': 'Animals',
        'food': 'Food & Drinks',
        'nature': 'Nature',
        'sports': 'Sports & Activities',
        'objects': 'Objects & Items',
        'faces': 'Faces & Emotions',
        'vehicles': 'Vehicles',
        'symbols': 'Symbols & Shapes',
        'random': 'Random'
    };
    return themeNames[theme] || 'Animals'; // Default to Animals if theme not found
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
    const selectedTheme = chartThemeSelect ? chartThemeSelect.value : 'all';
    
    // Apply both filters
    let games = filterGamesByGridSize(currentUserGames, selectedGridSize);
    games = filterGamesByTheme(games, selectedTheme);
    
    const stats = calculateStatistics(games);
    
    if (!stats) {
        statisticsContent.innerHTML = '<p class="no-stats-message">No game history found for this user</p>';
        return;
    }
    
    // Create filter description
    let filterDesc = '';
    if (selectedGridSize !== 'all' && selectedTheme !== 'all') {
        filterDesc = ` (${selectedGridSize}x${selectedGridSize}, ${getThemeDisplayName(selectedTheme)})`;
    } else if (selectedGridSize !== 'all') {
        filterDesc = ` (${selectedGridSize}x${selectedGridSize})`;
    } else if (selectedTheme !== 'all') {
        filterDesc = ` (${getThemeDisplayName(selectedTheme)})`;
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
                <h3>Time Over Games${filterDesc}</h3>
                <canvas id="time-chart"></canvas>
            </div>
            <div class="chart-wrapper">
                <h3>Moves Over Games${filterDesc}</h3>
                <canvas id="moves-chart"></canvas>
            </div>
        </div>
        
        <div class="game-history">
            <h3>Game History${filterDesc}</h3>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Grid Size</th>
                        <th>Theme</th>
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
        // Set default theme to 'animals' for existing records without theme
        const theme = game.theme || 'animals';
        html += `
            <tr>
                <td>${dateStr}</td>
                <td>${game.gridSize}x${game.gridSize}</td>
                <td>${getThemeDisplayName(theme)}</td>
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
    console.log('displayStatistics - allGames retrieved:', allGames);
    console.log('displayStatistics - sample game themes:', allGames.slice(0, 3).map(g => ({ date: g.date, theme: g.theme })));
    
    currentUserGames = allGames; // Store for quick filtering
    
    // Show download controls if user has games
    if (allGames.length > 0) {
        downloadControls.style.display = 'block';
        gridSizeFilterControls.style.display = 'flex';
        
        // Preserve current selection if user has manually selected something
        const currentGridSelection = preserveSelection ? chartGridSizeSelect.value : null;
        const currentThemeSelection = preserveSelection ? chartThemeSelect.value : null;
        
        // Only use lastPlayedTheme if the username matches lastPlayedUsername
        // This prevents applying a theme from a different user's game
        let themeToSelect = currentThemeSelection;
        if (!themeToSelect && lastPlayedTheme && lastPlayedUsername === username) {
            themeToSelect = lastPlayedTheme;
        }
        
        // Populate grid size filter
        const uniqueSizes = getUniqueGridSizes(allGames);
        chartGridSizeSelect.innerHTML = '<option value="all">All Grid Sizes</option>';
        uniqueSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}x${size}`;
            chartGridSizeSelect.appendChild(option);
        });
        
        // Populate theme filter
        const uniqueThemes = getUniqueThemes(allGames);
        chartThemeSelect.innerHTML = '<option value="all">All Themes</option>';
        uniqueThemes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme;
            option.textContent = getThemeDisplayName(theme);
            chartThemeSelect.appendChild(option);
        });
        
        // Restore user's selection or set defaults
        if (currentGridSelection && chartGridSizeSelect.querySelector(`option[value="${currentGridSelection}"]`)) {
            // User had a selection and it's still valid, restore it
            chartGridSizeSelect.value = currentGridSelection;
        } else {
            // Set default to most frequently played grid size (only on first load)
            const mostFrequent = getMostFrequentGridSize(allGames);
            if (mostFrequent) {
                chartGridSizeSelect.value = mostFrequent;
            }
        }
        
        // Restore theme selection if it was valid, or use last played theme
        if (themeToSelect && chartThemeSelect.querySelector(`option[value="${themeToSelect}"]`)) {
            chartThemeSelect.value = themeToSelect;
            // Don't clear lastPlayedTheme here - let tab switching code handle it for consistency
        }
        // Note: If neither preserved selection nor last played theme is available, it stays as "all"
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

// Grid size filter change event listener - immediate update
chartGridSizeSelect.addEventListener('change', () => {
    // Update statistics and charts immediately without reloading data
    if (currentUserGames.length > 0) {
        updateStatisticsDisplay();
    }
});

// Theme filter change event listener - immediate update
chartThemeSelect.addEventListener('change', () => {
    // Update statistics and charts immediately without reloading data
    if (currentUserGames.length > 0) {
        updateStatisticsDisplay();
    }
});

// Username selection change event listener - auto-load statistics
statsUsernameSelect.addEventListener('change', async () => {
    const username = statsUsernameSelect.value.trim();
    if (username) {
        // Clear lastPlayedTheme if selecting a different user
        // This prevents applying theme from a previous user's game
        if (lastPlayedUsername && lastPlayedUsername !== username) {
            lastPlayedTheme = null;
        }
        
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
                const header = 'Date,Time (seconds),Moves,Grid Size,Theme\n';
                const rows = games.map(game => {
                    const dateStr = new Date(game.date).toISOString();
                    const theme = game.theme || 'animals'; // Default to animals for old records
                    // Escape commas in CSV
                    return `${dateStr},${game.time},${game.moves},${game.gridSize}x${game.gridSize},${theme}`;
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
    
    // Save username to localStorage
    saveLastUsername(username);
    
    // IMPORTANT: Set theme FIRST, before calling initGame()
    // Always get fresh value from selector to ensure we have the latest theme
    const selectedTheme = emojiThemeSelect ? emojiThemeSelect.value : 'animals';
    console.log('=== START GAME CLICKED ===');
    console.log('emojiThemeSelect element:', emojiThemeSelect);
    console.log('emojiThemeSelect.value:', selectedTheme);
    
    let themeToUse;
    
    if (selectedTheme === 'random') {
        // If random, pick a random theme for this game
        themeToUse = getRandomTheme();
        console.log('Random theme selected, picked:', themeToUse);
    } else {
        // Use the selected theme directly
        themeToUse = selectedTheme || 'animals';
        console.log('Direct theme selected:', themeToUse);
    }
    
    // Validate theme exists in emojiThemes
    if (!emojiThemes[themeToUse]) {
        console.error('Invalid theme:', themeToUse, 'defaulting to animals');
        themeToUse = 'animals';
    }
    
    // Update both currentTheme and gameState.theme BEFORE initGame()
    currentTheme = themeToUse;
    currentEmojis = emojiThemes[themeToUse];
    gameState.theme = themeToUse; // CRITICAL: Set theme before initGame()
    
    console.log('=== GAME START ===');
    console.log('Selector value:', selectedTheme);
    console.log('Theme to use:', themeToUse);
    console.log('gameState.theme set to:', gameState.theme);
    console.log('currentTheme set to:', currentTheme);
    
    initGame();
    
    // Verify theme is still correct after initGame()
    console.log('After initGame(), gameState.theme:', gameState.theme);
    console.log('After initGame(), currentTheme:', currentTheme);
    
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
    
    // Initialize game (this will also stop timer and reset state, including clearing matched pairs list)
    initGame();
    
    // Don't auto-start - let user click Start Game button
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    // Keep grid size selector enabled
    usernameInput.disabled = false;
    usernameError.style.display = 'none';
    usernameInput.style.borderColor = '#667eea';
    pauseBtn.style.display = 'none';
    
    // Update display to show 00:00
    updateDisplay();
});

// Review Result button event listener
reviewResultBtn.addEventListener('click', () => {
    // Just close the modal, keep everything else (game state, matched pairs list, etc.)
    winModal.classList.remove('show');
    
    // Keep the game board visible with all matched pairs
    // Keep the matched pairs list visible
    // Don't reset anything - user can review the results
});

// Grid size change event listener - allow users to change grid size anytime
gridSizeSelect.addEventListener('change', () => {
    // Save grid size to localStorage
    saveLastGridSize(gridSizeSelect.value);
    
    // Sync settings grid size with game grid size
    if (settingsGridSizeSelect) {
        settingsGridSizeSelect.value = gridSizeSelect.value;
        // Update preview if we're on settings tab
        if (settingsTab && settingsTab.classList.contains('active')) {
            updateEmojiPreview();
        }
    }
    
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
        // Save username as user types
        saveLastUsername(usernameInput.value.trim());
    }
});

// Emoji Theme Selection
function updateEmojiPreview() {
    const selectedTheme = emojiThemeSelect.value;
    saveTheme(selectedTheme); // Save to localStorage
    
    // If random theme, select a random theme for this session
    let actualTheme = selectedTheme;
    if (selectedTheme === 'random') {
        actualTheme = getRandomTheme();
    }
    
    // Update current theme and emojis
    currentTheme = actualTheme;
    currentEmojis = emojiThemes[actualTheme];
    emojiCount.textContent = currentEmojis.length;
    
    console.log('Theme updated - selected:', selectedTheme, 'actual:', actualTheme, 'currentTheme:', currentTheme);
    
    // Get grid size from settings
    const gridSize = parseInt(settingsGridSizeSelect.value);
    const totalCards = gridSize * gridSize;
    const numPairs = Math.floor(totalCards / 2);
    
    // Get current selection directly (don't auto-fill here, just show what's selected)
    const key = `${gridSize}_${currentTheme}`;
    const currentSelection = selectedEmojisByGridSize[key] || [];
    
    // Display preview of all emojis with selected ones highlighted
    emojiPreview.innerHTML = '';
    currentEmojis.forEach((emoji, index) => {
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'preview-emoji';
        emojiSpan.textContent = emoji;
        
        // Set tooltip with emoji name
        const emojiName = getEmojiName(emoji);
        
        // Highlight if this emoji is selected for current grid size
        if (currentSelection.includes(emoji)) {
            emojiSpan.classList.add('selected-emoji');
            emojiSpan.title = `${emojiName} (Selected - Click to deselect)`;
        } else {
            emojiSpan.title = `${emojiName} (Click to select)`;
        }
        
        // Add click handler to toggle selection
        emojiSpan.addEventListener('click', () => {
            toggleEmojiSelection(emoji, gridSize);
        });
        
        emojiPreview.appendChild(emojiSpan);
    });
}

// Theme change event listener
emojiThemeSelect.addEventListener('change', () => {
    updateEmojiPreview();
    // If game is not started, reinitialize with new theme
    if (!gameState.isGameStarted) {
        initGame();
    }
});

// Grid size change event listener in Settings
if (settingsGridSizeSelect) {
    settingsGridSizeSelect.addEventListener('change', () => {
        updateEmojiPreview();
        // Sync game grid size with settings grid size
        gridSizeSelect.value = settingsGridSizeSelect.value;
        // If game is not started, reinitialize with new grid size
        if (!gameState.isGameStarted) {
            initGame();
        }
    });
}

// Random selection button event listener
if (randomSelectionBtn) {
    randomSelectionBtn.addEventListener('click', () => {
        const gridSize = parseInt(settingsGridSizeSelect.value);
        
        // Generate new random selection
        const newSelection = generateRandomEmojiSelection(gridSize, currentEmojis);
        
        // Save the selection
        saveEmojiSelectionForCurrentGridSize(newSelection);
        
        // Update preview to show new selection
        updateEmojiPreview();
        
        // If game is not started, reinitialize with new selection
        if (!gameState.isGameStarted) {
            initGame();
        }
    });
}

// Initialize theme selector with saved theme
function initializeThemeSelector() {
    // Load selected emojis from localStorage
    loadSelectedEmojis();
    // Load custom emoji names from localStorage
    loadCustomEmojiNames();
    
    const savedTheme = loadSavedTheme();
    emojiThemeSelect.value = savedTheme;
    
    // Sync settings grid size with game grid size
    settingsGridSizeSelect.value = gridSizeSelect.value;
    
    // If saved theme is 'random', pick a random theme for this session
    if (savedTheme === 'random') {
        const randomTheme = getRandomTheme();
        currentTheme = randomTheme;
        currentEmojis = emojiThemes[randomTheme];
    } else {
        currentTheme = savedTheme;
        currentEmojis = emojiThemes[savedTheme];
    }
    
    // Update preview (this will also update currentTheme if needed)
    updateEmojiPreview();
    
    console.log('Theme initialized:', savedTheme, 'currentTheme:', currentTheme);
}

// Initialize on page load
initializeThemeSelector();

// Load saved username and grid size
const savedUsername = loadLastUsername();
const savedGridSize = loadLastGridSize();

if (savedUsername) {
    usernameInput.value = savedUsername;
}

if (savedGridSize && gridSizeSelect.querySelector(`option[value="${savedGridSize}"]`)) {
    gridSizeSelect.value = savedGridSize;
}

initGame();
updateStatsUsernameList();

