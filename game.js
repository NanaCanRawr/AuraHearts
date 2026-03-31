// Add these to your variables at the top
let studyTimer = 0; 
let distractionCooldown = 0; // New: prevents instant re-distraction

// --- UPDATED LOGIC ---

function update() {
    if (gameState === 'ROOM') {
        if (keys['arrowup'] || keys['w']) player.y -= player.speed;
        if (keys['arrowdown'] || keys['s']) player.y += player.speed;
        if (keys['arrowleft'] || keys['a']) player.x -= player.speed;
        if (keys['arrowright'] || keys['d']) player.x += player.speed;
        
        // Boundaries
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    } else if (gameState === 'STUDYING') {
        if (!isDistracted) {
            studyTimer++; // We count how long you've been sitting
            distractionCooldown--; 
            energy -= 0.03;

            // ONLY distract if you've studied for at least 3 seconds (180 frames)
            // AND the cooldown is over
            if (studyTimer > 180 && distractionCooldown <= 0) {
                if (Math.random() < 0.005) { // Very rare chance
                    isDistracted = true;
                    bubbles = Array.from({length: 10}, () => ({
                        x: Math.random() * 600 + 100,
                        y: Math.random() * 400 + 100,
                        radius: 35
                    }));
                }
            }
        } else {
             energy -= 0.08; // Drains faster when phone is buzzing
        }
    }
}

// Update the Key Handler for 'E' to reset the timer
window.onkeydown = (e) => {
    let key = e.key.toLowerCase();
    keys[key] = true;
    
    if (key === 'e') {
        if (gameState === 'ROOM') {
            const tableX = canvas.width - 140, tableY = 185;
            const dist = Math.hypot(player.x - tableX, player.y - tableY);
            if (dist < 150) {
                gameState = 'STUDYING';
                studyTimer = 0; // RESET TIMER when you sit down
                distractionCooldown = 120; // 2 seconds of peace
            }
        } else if (gameState === 'STUDYING' && !isDistracted) {
            gameState = 'ROOM';
        }
    }
};

// ... keep the rest of your drawing functions the same!
