// Define habit categories and their stat effects
const habitCategories = {
    physical: {
        stats: ['str', 'dex'],
        expGain: {
            str: 10,
            dex: 8
        }
    },
    mental: {
        stats: ['mag', 'spr'],
        expGain: {
            mag: 10,
            spr: 8
        }
    },
    endurance: {
        stats: ['hp', 'vit'],
        expGain: {
            hp: 10,
            vit: 8
        }
    },
    creative: {
        stats: ['mp', 'mag'],
        expGain: {
            mp: 10,
            mag: 8
        }
    }
};

// Render habits with streak display
function renderHabits() {
    const habitsContainer = document.getElementById('habits');
    habitsContainer.innerHTML = '';
    
    const weekDates = getWeekDates(currentDate);
    const weekRange = `${formatDisplayDate(weekDates[0])} - ${formatDisplayDate(weekDates[6])}`;
    document.getElementById('currentWeek').textContent = weekRange;

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter dates to show only today and previous 2 days on mobile
    const isMobile = window.innerWidth <= 768;
    const visibleDates = isMobile ? 
        weekDates.filter(date => {
            const checkDate = new Date(date);
            const daysDifference = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
            return daysDifference >= 0 && daysDifference <= 2;
        }) :
        weekDates;

    // Create header row with dates
    const headerRow = document.createElement('div');
    headerRow.className = 'habit-row';
    headerRow.innerHTML = '<div class="habit-name">Habit</div>';
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    visibleDates.forEach(date => {
        const dateObj = new Date(date);
        const dayIndex = dateObj.getDay();
        const dateHeader = document.createElement('div');
        dateHeader.className = 'checkbox-container';
        dateHeader.innerHTML = `
            <div class="date-header">
                ${daysOfWeek[dayIndex]}
                <div class="date-value">${formatDisplayDate(date)}</div>
            </div>
        `;
        headerRow.appendChild(dateHeader);
    });
    habitsContainer.appendChild(headerRow);

    // Create habit rows
    habits.forEach((habit, index) => {
        const streak = calculateStreak(habit);
        const habitRow = document.createElement('div');
        habitRow.className = `habit-row${habit.category ? ' ' + habit.category : ''}`;

        const habitName = document.createElement('div');
        habitName.className = 'habit-name';
        habitName.innerHTML = `
            ${habit.name || habit}
            <span class="streak-count">🔥 ${streak}</span>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteHabit(index);
        habitName.appendChild(deleteBtn);

        habitRow.appendChild(habitName);

        // Add checkboxes for visible dates
        visibleDates.forEach(date => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = habitStatus[date]?.[habit.name] || false;
            
            // Check if date is within allowed range (today and previous 2 days)
            const checkDate = new Date(date);
            const daysDifference = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
            
            if (checkDate > today || daysDifference > 2) {
                checkbox.disabled = true;
                checkbox.title = checkDate > today ? 
                    "Cannot check off future habits" : 
                    "Can only check off habits from the past 2 days";
            } else {
                checkbox.addEventListener('change', () => {
                    updateHabitStatus(habit, date, checkbox.checked);
                });
            }

            checkboxContainer.appendChild(checkbox);
            habitRow.appendChild(checkboxContainer);
        });

        habitsContainer.appendChild(habitRow);
    });
}

// Add new habit
function addHabit() {
    const input = document.getElementById('newHabit');
    const category = document.getElementById('habitCategory');
    const habitName = input.value.trim();
    const habitCategory = category.value;

    if (habitName && habitCategory && !habits.some(h => h.name === habitName)) {
        habits.push({
            name: habitName,
            category: habitCategory
        });
        localStorage.setItem('habits', JSON.stringify(habits));
        input.value = '';
        category.value = '';
        renderHabits();
    } else if (!habitCategory) {
        alert('Please select a category for your habit');
    }
}

// Delete habit
function deleteHabit(index) {
    habits.splice(index, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

// Calculate streak for a habit
function calculateStreak(habit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
        const dateStr = formatDate(currentDate);
        if (!habitStatus[dateStr] || !habitStatus[dateStr][habit.name]) {
            break;
        }
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

// Update habit status
function updateHabitStatus(habit, date, isChecked) {
    if (!habitStatus[date]) {
        habitStatus[date] = {};
    }
    
    // Only update stats if habit is being checked
    if (isChecked && !habitStatus[date][habit.name]) {
        // Find habit category and apply stat gains
        if (habit.category) {
            const category = habitCategories[habit.category];
            if (category) {
                Object.entries(category.expGain).forEach(([stat, gain]) => {
                    addStatExp(stat, gain);
                });
            }
        }
    }
    
    habitStatus[date][habit.name] = isChecked;
    localStorage.setItem('habitStatus', JSON.stringify(habitStatus));

    // Check for rewards after updating status
    checkForRewards(habit);
}

// Add window resize listener to re-render habits when switching between mobile and desktop
window.addEventListener('resize', () => {
    renderHabits();
}); 