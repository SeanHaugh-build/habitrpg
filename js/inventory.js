// Available rewards with requirements and stats
const rewards = [
    // Physical Category Items (Weapons)
    { 
        id: 'training_sword', 
        name: 'Training Sword', 
        image: '🗡️', 
        type: 'weapon',
        category: 'physical',
        streakRequired: 30,
        stats: { str: 5, dex: 2 }
    },
    { 
        id: 'warriors_blade', 
        name: 'Warrior\'s Blade', 
        image: '⚔️', 
        type: 'weapon',
        category: 'physical',
        streakRequired: 100,
        stats: { str: 15, dex: 8 }
    },
    { 
        id: 'legendary_sword', 
        name: 'Legendary Sword', 
        image: '🗡️', 
        type: 'weapon',
        category: 'physical',
        streakRequired: 365,
        stats: { str: 30, dex: 20 }
    },
    // Mental Category Items (Staves)
    { 
        id: 'apprentice_staff', 
        name: 'Apprentice Staff', 
        image: '🪄', 
        type: 'weapon',
        category: 'mental',
        streakRequired: 30,
        stats: { mag: 5, spr: 2 }
    },
    { 
        id: 'wizards_staff', 
        name: 'Wizard\'s Staff', 
        image: '🎭', 
        type: 'weapon',
        category: 'mental',
        streakRequired: 100,
        stats: { mag: 15, spr: 8 }
    },
    { 
        id: 'archmage_staff', 
        name: 'Archmage Staff', 
        image: '🔮', 
        type: 'weapon',
        category: 'mental',
        streakRequired: 365,
        stats: { mag: 30, spr: 20 }
    },
    // Endurance Category Items (Armor)
    { 
        id: 'training_armor', 
        name: 'Training Armor', 
        image: '🛡️', 
        type: 'armor',
        category: 'endurance',
        streakRequired: 30,
        stats: { hp: 30, vit: 5 }
    },
    { 
        id: 'knights_armor', 
        name: 'Knight\'s Armor', 
        image: '🛡️', 
        type: 'armor',
        category: 'endurance',
        streakRequired: 100,
        stats: { hp: 100, vit: 15 }
    },
    { 
        id: 'divine_armor', 
        name: 'Divine Armor', 
        image: '🛡️', 
        type: 'armor',
        category: 'endurance',
        streakRequired: 365,
        stats: { hp: 300, vit: 30 }
    },
    // Creative Category Items (Accessories)
    { 
        id: 'inspiration_charm', 
        name: 'Inspiration Charm', 
        image: '✨', 
        type: 'accessory',
        category: 'creative',
        streakRequired: 30,
        stats: { mp: 30, mag: 5 }
    },
    { 
        id: 'muse_pendant', 
        name: 'Muse\'s Pendant', 
        image: '🎨', 
        type: 'accessory',
        category: 'creative',
        streakRequired: 100,
        stats: { mp: 100, mag: 15 }
    },
    { 
        id: 'creators_crown', 
        name: 'Creator\'s Crown', 
        image: '👑', 
        type: 'accessory',
        category: 'creative',
        streakRequired: 365,
        stats: { mp: 300, mag: 30 }
    }
];

// Default starter equipment
const starterEquipment = [
    {
        id: 'wooden_stick',
        name: 'Stale Baguette',
        image: '🥖',
        type: 'weapon',
        category: 'physical',
        streakRequired: 0,
        stats: { str: 2, dex: 1 }
    },
    {
        id: 'plastic_shield',
        name: 'Plastic Shield',
        image: '🛡️',
        type: 'armor',
        category: 'endurance',
        streakRequired: 0,
        stats: { hp: 10, vit: 1 }
    }
];

// Check for unlocked rewards
function checkForRewards(habit) {
    const streak = calculateStreak(habit);
    const category = habit.category;
    
    // Find all rewards for this category that we don't have yet
    const eligibleRewards = rewards.filter(reward => 
        reward.category === category && 
        streak >= reward.streakRequired && 
        !inventory.some(item => item.id === reward.id)
    );

    if (eligibleRewards.length > 0) {
        eligibleRewards.forEach(reward => {
            // Double check the reward isn't already in inventory before adding
            if (!inventory.some(item => item.id === reward.id)) {
                inventory.push(reward);
                const notification = document.getElementById('rewardNotification');
                notification.textContent = `🎉 You earned ${reward.name} for ${streak} days of ${category} habits!`;
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
        });

        // Save inventory after adding all rewards
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderInventory();
    }
}

// Update equipment display
function updateEquipmentDisplay() {
    const weaponSlot = document.getElementById('weaponSlot');
    const armorSlot = document.getElementById('armorSlot');
    const accessorySlot = document.createElement('div');
    accessorySlot.id = 'accessorySlot';
    accessorySlot.className = 'equipment-slot empty';
    
    // Add accessory slot if it doesn't exist
    if (!document.getElementById('accessorySlot')) {
        document.querySelector('.equipment-grid').appendChild(accessorySlot);
    }
    
    // Update weapon slot
    const equippedWeapon = inventory.find(item => item.id === equipped.weapon);
    if (equippedWeapon) {
        weaponSlot.className = 'equipment-slot';
        const statsText = Object.entries(equippedWeapon.stats)
            .map(([stat, value]) => `+${value} ${stat.toUpperCase()}`)
            .join(', ');
        weaponSlot.innerHTML = `
            <div class="equipment-image">${equippedWeapon.image}</div>
            <div class="equipment-name">${equippedWeapon.name}</div>
            <div class="equipment-stats">${statsText}</div>
        `;
    } else {
        weaponSlot.className = 'equipment-slot empty';
        weaponSlot.innerHTML = `
            <div class="equipment-image">🗡️</div>
            <div class="equipment-name">No weapon</div>
        `;
    }
    
    // Update armor slot
    const equippedArmor = inventory.find(item => item.id === equipped.armor);
    if (equippedArmor) {
        armorSlot.className = 'equipment-slot';
        const statsText = Object.entries(equippedArmor.stats)
            .map(([stat, value]) => `+${value} ${stat.toUpperCase()}`)
            .join(', ');
        armorSlot.innerHTML = `
            <div class="equipment-image">${equippedArmor.image}</div>
            <div class="equipment-name">${equippedArmor.name}</div>
            <div class="equipment-stats">${statsText}</div>
        `;
    } else {
        armorSlot.className = 'equipment-slot empty';
        armorSlot.innerHTML = `
            <div class="equipment-image">🛡️</div>
            <div class="equipment-name">No armor</div>
        `;
    }

    // Update accessory slot
    const equippedAccessory = inventory.find(item => item.id === equipped.accessory);
    if (equippedAccessory) {
        accessorySlot.className = 'equipment-slot';
        const statsText = Object.entries(equippedAccessory.stats)
            .map(([stat, value]) => `+${value} ${stat.toUpperCase()}`)
            .join(', ');
        accessorySlot.innerHTML = `
            <div class="equipment-image">${equippedAccessory.image}</div>
            <div class="equipment-name">${equippedAccessory.name}</div>
            <div class="equipment-stats">${statsText}</div>
        `;
    } else {
        accessorySlot.className = 'equipment-slot empty';
        accessorySlot.innerHTML = `
            <div class="equipment-image">✨</div>
            <div class="equipment-name">No accessory</div>
        `;
    }

    // Update total stats after equipment changes
    updateStatsDisplay();
}

// Render inventory
function renderInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '';

    if (inventory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'inventory-empty';
        emptyMessage.textContent = 'Complete habits to earn equipment!';
        inventoryContainer.appendChild(emptyMessage);
        return;
    }

    // Sort inventory by category and type
    const sortedInventory = [...inventory].sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.type.localeCompare(b.type);
    });

    sortedInventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `inventory-item${equipped[item.type] === item.id ? ' equipped' : ''}`;
        
        const statsText = Object.entries(item.stats)
            .map(([stat, value]) => `+${value} ${stat.toUpperCase()}`)
            .join(', ');

        itemElement.innerHTML = `
            <div class="inventory-item-image">${item.image}</div>
            <div class="inventory-item-details">
                <div class="inventory-item-name">${item.name}</div>
                <div class="inventory-item-stats">${statsText}</div>
                <div class="inventory-item-category">
                    ${item.category.charAt(0).toUpperCase() + item.category.slice(1)} ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
            </div>
        `;
        
        if (equipped[item.type] === item.id) {
            itemElement.title = 'Click to unequip';
        } else {
            itemElement.title = 'Click to equip';
        }

        itemElement.onclick = () => equipItem(item);
        inventoryContainer.appendChild(itemElement);
    });
}

// Equip/unequip item
function equipItem(item) {
    if (!item || !item.type) return;

    if (equipped[item.type] === item.id) {
        delete equipped[item.type];
    } else {
        equipped[item.type] = item.id;
    }

    localStorage.setItem('equipped', JSON.stringify(equipped));
    updateEquipmentDisplay();
    renderInventory();
    updateAvatar();
}

// Update avatar with equipped items
function updateAvatar() {
    const avatar = document.getElementById('avatar');
    let avatarHtml = '👤'; // Base avatar
    
    // Add equipped items
    Object.values(equipped).forEach(itemId => {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            avatarHtml += item.image;
        }
    });
    
    // Update avatar SVG
    avatar.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23F5F5F7'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='40' fill='%23000000' text-anchor='middle' dy='.3em'%3E${avatarHtml}%3C/text%3E%3C/svg%3E`;
} 