// Initialize stat experience and levels
let statExp = JSON.parse(localStorage.getItem('statExp')) || {
    hp: 0, mp: 0, str: 0, dex: 0, vit: 0, mag: 0, spr: 0, lck: 0
};

// Calculate base stats plus equipment bonuses
function calculateTotalStats() {
    // Start with base stats
    const baseStats = {
        hp: 100, // Base HP is always 100
        mp: 10 + (stats.mag * 2),
        str: Math.floor(stats.str),
        dex: Math.floor(stats.dex),
        vit: Math.floor(stats.vit),
        mag: Math.floor(stats.mag),
        spr: Math.floor(stats.spr),
        lck: Math.floor(stats.lck)
    };
    
    // Add vitality bonus to HP after base HP is set
    baseStats.hp += (baseStats.vit * 5); // Vitality bonus
    
    // Add equipment bonuses
    Object.values(equipped).forEach(itemId => {
        const item = inventory.find(i => i.id === itemId);
        if (item && item.stats) {
            Object.entries(item.stats).forEach(([stat, value]) => {
                if (baseStats.hasOwnProperty(stat)) {
                    if (stat === 'hp') {
                        baseStats[stat] += Math.floor(value); // Add HP bonus directly
                    } else {
                        baseStats[stat] += Math.floor(value);
                    }
                }
            });
        }
    });

    return baseStats;
}

// Calculate stat level based on experience
function calculateStatLevel(stat) {
    return Math.floor(Math.sqrt(statExp[stat] / 100)) + 1;
}

// Calculate progress to next level (0-100)
function calculateStatProgress(stat) {
    const currentLevel = calculateStatLevel(stat);
    const expForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 100;
    const expForNextLevel = currentLevel * currentLevel * 100;
    const progress = ((statExp[stat] - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

// Add experience to stats
function addStatExp(stat, amount) {
    statExp[stat] += amount;
    localStorage.setItem('statExp', JSON.stringify(statExp));
    updateStatsDisplay();
}

// Update stats display
function updateStatsDisplay() {
    const totalStats = calculateTotalStats();
    const statNames = ['hp', 'mp', 'str', 'dex', 'vit', 'mag', 'spr', 'lck'];
    
    statNames.forEach(stat => {
        const statElement = document.getElementById(`${stat}Stat`);
        if (!statElement) return;

        const statValue = Math.floor(totalStats[stat]);
        const statLevel = calculateStatLevel(stat);
        const progress = calculateStatProgress(stat);
        
        statElement.innerHTML = `
            ${statValue}
            <span class="stat-level">Lv.${statLevel}</span>
            <div class="stat-progress">
                <div class="stat-progress-bar" style="width: ${progress}%"></div>
            </div>
        `;
    });

    // Don't save totalStats to localStorage, only save base stats
    localStorage.setItem('stats', JSON.stringify(stats));
} 