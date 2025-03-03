// Global variables
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let habitStatus = JSON.parse(localStorage.getItem('habitStatus')) || {};
let currentDate = new Date();
let points = JSON.parse(localStorage.getItem('points')) || 0;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let equipped = JSON.parse(localStorage.getItem('equipped')) || {};
let stats = JSON.parse(localStorage.getItem('stats')) || {
    hp: 100,
    mp: 10,
    str: 10,
    dex: 10,
    vit: 10,
    mag: 10,
    spr: 10,
    lck: 10
};

// Date formatting utilities
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get dates for the current week
function getWeekDates(date) {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        weekDates.push(formatDate(day));
    }
    return weekDates;
}

// Navigation functions
function previousWeek() {
    currentDate.setDate(currentDate.getDate() - 7);
    renderHabits();
}

function nextWeek() {
    currentDate.setDate(currentDate.getDate() + 7);
    renderHabits();
}

// Initialize everything
function initializeGame() {
    if (window.gameInitialized) return;
    window.gameInitialized = true;

    // Load saved data
    habits = JSON.parse(localStorage.getItem('habits')) || [];
    
    // Add default habits if none exist
    if (habits.length === 0) {
        const defaultHabits = [
            { name: "Go to the gym", category: "physical" },
            { name: "10000 steps", category: "endurance" },
            { name: "Eat healthy", category: "physical" },
            { name: "Journal", category: "creative" },
            { name: "Meditate", category: "mental" },
            { name: "Practice instrument", category: "creative" }
        ];
        habits = defaultHabits;
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    habitStatus = JSON.parse(localStorage.getItem('habitStatus')) || {};
    inventory = JSON.parse(localStorage.getItem('inventory')) || [...starterEquipment];
    equipped = JSON.parse(localStorage.getItem('equipped')) || {};
    
    // Initialize base stats
    stats = JSON.parse(localStorage.getItem('stats')) || {
        hp: 100,
        mp: 10,
        str: 10,
        dex: 10,
        vit: 10,
        mag: 10,
        spr: 10,
        lck: 10
    };

    // Ensure stats are numbers
    Object.keys(stats).forEach(key => {
        if (key === 'hp') {
            stats[key] = 100;
        } else {
            stats[key] = Number(stats[key]) || (key === 'mp' ? 10 : 10);
        }
    });

    statExp = JSON.parse(localStorage.getItem('statExp')) || {
        hp: 0, mp: 0, str: 0, dex: 0, vit: 0, mag: 0, spr: 0, lck: 0
    };
    badges = JSON.parse(localStorage.getItem('badges')) || [];

    // Update UI
    updateStatsDisplay();
    updateEquipmentDisplay();
    renderInventory();
    updateAvatar();
    renderHabits();
    updateBadges();
    initializeBattle();

    // Save initial state
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habitStatus', JSON.stringify(habitStatus));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('statExp', JSON.stringify(statExp));
}

// Event listeners
window.addEventListener('load', initializeGame);

document.addEventListener('DOMContentLoaded', () => {
    habits = JSON.parse(localStorage.getItem('habits')) || [];
    habitStatus = JSON.parse(localStorage.getItem('habitStatus')) || {};
    renderHabits();
});

document.getElementById('newHabit').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addHabit();
    }
}); 