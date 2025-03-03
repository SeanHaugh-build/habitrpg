// Monster definitions
const monsters = [
    {
        id: 1,
        name: "Training Dummy",
        sprite: "🎯",
        hp: 50,
        attack: 5,
        defense: 2,
        badge: "🎯",
        badgeName: "Beginner's Badge",
        expReward: 100
    },
    {
        id: 2,
        name: "Slime",
        sprite: "🫧",
        hp: 100,
        attack: 8,
        defense: 5,
        badge: "🫧",
        badgeName: "Slime Conqueror",
        expReward: 200
    },
    {
        id: 3,
        name: "Forest Wolf",
        sprite: "🐺",
        hp: 200,
        attack: 15,
        defense: 8,
        badge: "🐺",
        badgeName: "Wolf Hunter",
        expReward: 400
    },
    {
        id: 4,
        name: "Dark Knight",
        sprite: "⚔️",
        hp: 500,
        attack: 25,
        defense: 15,
        badge: "⚔️",
        badgeName: "Knight Slayer",
        expReward: 800
    },
    {
        id: 5,
        name: "Ancient Dragon",
        sprite: "🐉",
        hp: 1000,
        attack: 40,
        defense: 25,
        badge: "🐉",
        badgeName: "Dragon Slayer",
        expReward: 1500
    }
];

// Battle state
let currentBattle = {
    active: false,
    monster: null,
    monsterCurrentHp: 0,
    playerCurrentMp: 0,
    turn: 0
};

// Player badges
let badges = JSON.parse(localStorage.getItem('badges')) || [];

// Initialize battle
function initializeBattle() {
    if (currentBattle.active) return;
    
    // Find next undefeated monster
    const nextMonster = monsters.find(m => !badges.includes(m.id));
    if (!nextMonster) {
        updateBattleLog("You've defeated all monsters!");
        return;
    }

    const totalStats = calculateTotalStats();
    
    // Initialize battle state
    currentBattle = {
        active: true,
        monster: nextMonster,
        monsterCurrentHp: nextMonster.hp,
        turn: 0
    };

    // Ensure player stats are properly initialized and capped at max values
    if (isNaN(stats.hp) || stats.hp <= 0) stats.hp = totalStats.hp;
    if (isNaN(stats.mp) || stats.mp <= 0) stats.mp = totalStats.mp;
    
    stats.hp = Math.min(Math.floor(stats.hp), totalStats.hp);
    stats.mp = Math.min(Math.floor(stats.mp), totalStats.mp);
    
    localStorage.setItem('stats', JSON.stringify(stats));
    updateBattleUI();
}

// Update battle UI
function updateBattleUI() {
    const monster = currentBattle.monster;
    if (!monster) return;

    const totalStats = calculateTotalStats();
    
    // Ensure stats are valid numbers
    if (isNaN(stats.hp)) stats.hp = totalStats.hp;
    if (isNaN(stats.mp)) stats.mp = totalStats.mp;

    // Update monster info
    document.querySelector('.monster-name').textContent = monster.name;
    document.querySelector('.monster-sprite').textContent = monster.sprite;
    
    // Update monster HP bar
    const monsterCurrentHp = Math.max(0, Math.floor(currentBattle.monsterCurrentHp));
    const monsterHpPercent = (monsterCurrentHp / monster.hp) * 100;
    document.getElementById('monsterHpBar').style.width = `${Math.max(0, Math.min(monsterHpPercent, 100))}%`;
    document.getElementById('monsterHpText').textContent = `${monsterCurrentHp}/${monster.hp}`;

    // Update player HP bar
    const currentHp = Math.max(0, Math.floor(stats.hp));
    const maxHp = Math.floor(totalStats.hp);
    const playerHpPercent = (currentHp / maxHp) * 100;
    document.getElementById('playerHpBar').style.width = `${Math.max(0, Math.min(playerHpPercent, 100))}%`;
    document.getElementById('playerHpText').textContent = `${currentHp}/${maxHp}`;

    // Update heal button
    const healBtn = document.getElementById('healBtn');
    const currentMp = Math.max(0, Math.floor(stats.mp));
    healBtn.disabled = currentMp < 10;
    healBtn.textContent = `Heal (MP: ${currentMp}/10)`;
}

// Perform attack
function performAttack() {
    if (!currentBattle.active) return;

    const totalStats = calculateTotalStats();
    const baseAttack = totalStats.str - currentBattle.monster.defense;
    const randomMultiplier = 0.8 + Math.random() * 0.4; // Random between 0.8 and 1.2
    const damage = Math.max(1, Math.floor(baseAttack * randomMultiplier));
    currentBattle.monsterCurrentHp = Math.max(0, currentBattle.monsterCurrentHp - damage);

    updateBattleLog(`You dealt ${damage} damage!`);

    // Monster's turn
    if (currentBattle.monsterCurrentHp > 0) {
        const baseMonsterDamage = currentBattle.monster.attack - (totalStats.vit / 2);
        const monsterRandomMultiplier = 0.8 + Math.random() * 0.4;
        const monsterDamage = Math.max(1, Math.floor(baseMonsterDamage * monsterRandomMultiplier));
        stats.hp = Math.max(0, stats.hp - monsterDamage);
        localStorage.setItem('stats', JSON.stringify(stats));
        updateBattleLog(`${currentBattle.monster.name} dealt ${monsterDamage} damage!`);

        if (stats.hp <= 0) {
            updateBattleUI();
            updateStatsDisplay();
            endBattle(false);
            return;
        }
    } else {
        endBattle(true);
        return;
    }

    updateBattleUI();
    updateStatsDisplay();
}

// Perform heal
function performHeal() {
    if (!currentBattle.active || stats.mp < 10) return;

    const totalStats = calculateTotalStats();
    const baseHeal = 20 + totalStats.mag;
    const randomMultiplier = 0.8 + Math.random() * 0.4;
    const healAmount = Math.floor(baseHeal * randomMultiplier);
    
    stats.hp = Math.min(totalStats.hp, stats.hp + healAmount);
    stats.mp = Math.max(0, stats.mp - 10);
    localStorage.setItem('stats', JSON.stringify(stats));

    updateBattleLog(`You healed for ${healAmount} HP! (-10 MP)`);
    
    // Monster's turn
    const baseMonsterDamage = currentBattle.monster.attack - (totalStats.vit / 2);
    const monsterRandomMultiplier = 0.8 + Math.random() * 0.4;
    const monsterDamage = Math.max(1, Math.floor(baseMonsterDamage * monsterRandomMultiplier));
    stats.hp = Math.max(0, stats.hp - monsterDamage);
    localStorage.setItem('stats', JSON.stringify(stats));
    updateBattleLog(`${currentBattle.monster.name} dealt ${monsterDamage} damage!`);

    if (stats.hp <= 0) {
        updateBattleUI();
        updateStatsDisplay();
        endBattle(false);
        return;
    }

    updateBattleUI();
    updateStatsDisplay();
}

// Update battle log
function updateBattleLog(message) {
    const log = document.querySelector('.battle-log');
    log.innerHTML += `<div>${message}</div>`;
    log.scrollTop = log.scrollHeight;
}

// End battle
function endBattle(victory) {
    const totalStats = calculateTotalStats();
    
    if (victory) {
        updateBattleLog(`You defeated ${currentBattle.monster.name}!`);
        badges.push(currentBattle.monster.id);
        localStorage.setItem('badges', JSON.stringify(badges));
        
        // Add experience
        Object.entries(statExp).forEach(([stat, exp]) => {
            addStatExp(stat, currentBattle.monster.expReward);
        });

        // Refresh HP and MP to max
        stats.hp = totalStats.hp;
        stats.mp = totalStats.mp;
        localStorage.setItem('stats', JSON.stringify(stats));

        // Show badge notification
        const notification = document.getElementById('rewardNotification');
        notification.textContent = `🎉 You earned the ${currentBattle.monster.badgeName}!`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } else {
        updateBattleLog("You were defeated! Try again when you're stronger.");
        // Reset HP to 50% on defeat
        stats.hp = Math.floor(totalStats.hp * 0.5);
        stats.mp = Math.floor(totalStats.mp * 0.5);
        localStorage.setItem('stats', JSON.stringify(stats));
    }

    currentBattle.active = false;
    updateBadges();
    updateStatsDisplay();
    updateBattleUI();
    setTimeout(() => {
        initializeBattle();
    }, 1500);
}

// Update badges display
function updateBadges() {
    const badgesContainer = document.getElementById('badges');
    badgesContainer.innerHTML = '';

    monsters.forEach(monster => {
        const badge = document.createElement('div');
        badge.className = `badge${badges.includes(monster.id) ? '' : ' locked'}`;
        badge.innerHTML = monster.badge;
        badge.setAttribute('data-name', monster.badgeName);
        badgesContainer.appendChild(badge);
    });
} 