const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State & Stats
let gameState = 'TITLE'; 
let energy = 100;
let lovePoints = 0;

// Player & NPC Setup
const player = { x: 400, y: 300, speed: 4, width: 32, height: 32, color: "#8d4e2a" };
const girl = { x: 0, y: 0, active: false, width: 24, height: 24, sparkles: [] };
let critics = [];

// Button Config
const heartBtn = { x: 20, y: 20, size: 50, visible: false };

// --- 1. DRAWING FUNCTIONS ---

function drawHeartButton() {
    if (energy >= 25 && energy <= 45 && !girl.active) {
        heartBtn.visible = true;
        // Draw Button Background
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(heartBtn.x, heartBtn.y, heartBtn.size, heartBtn.size);
        
        // Pixel Heart Logo
        ctx.fillStyle = "#ff4081";
        // Simple pixel heart shape
        ctx.fillRect(heartBtn.x + 10, heartBtn.y + 15, 10, 10);
        ctx.fillRect(heartBtn.x + 30, heartBtn.y + 15, 10, 10);
        ctx.fillRect(heartBtn.x + 10, heartBtn.y + 25, 30, 10);
        ctx.fillRect(heartBtn.x + 15, heartBtn.y + 35, 20, 10);
        ctx.fillRect(heartBtn.x + 20, heartBtn.y + 40, 10, 5);
        
        ctx.fillStyle = "white";
        ctx.font = "10px 'Courier New'";
        ctx.fillText("SUMMON", heartBtn.x + 25, heartBtn.y + 60);
    } else {
        heartBtn.visible = false;
    }
}

function drawStreet() {
    ctx.fillStyle = "#333"; // Darker street
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    // Draw Girl & Her Magical Trail
    if (girl.active) {
        girl.sparkles.forEach((s, i) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
            ctx.fillRect(s.x, s.y, 4, 4);
            s.x += s.vx; s.y += s.vy; // Sparkles drift
            s.life -= 0.01;
            if (s.life <= 0) girl.sparkles.splice(i, 1);
        });
        
        ctx.fillStyle = "#f48fb1"; // Pink dress
        ctx.fillRect(girl.x, girl.y, girl.width, girl.height);
        ctx.fillStyle = "#fff176"; // Sparkly hair
        ctx.fillRect(girl.x, girl.y, girl.width, 8);
        
        // Healing effect aura
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(girl.x + 12, girl.y + 12, 30, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Draw Critics
    critics.forEach(c => {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(c.x, c.y, 32, 32);
        ctx.fillStyle = "#ff5252";
        ctx.font = "12px Arial";
        ctx.fillText("IGNORE HIM!", c.x, c.y - 10);
    });

    drawEntity(player);
    drawHeartButton();
    drawHUD();
}

// --- 2. LOGIC & UPDATES ---

function update() {
    if (gameState === 'ROOM' || gameState === 'STREET') {
        let moveX = 0, moveY = 0;
        if (keys['w'] || keys['arrowup']) moveY = -player.speed;
        if (keys['s'] || keys['arrowdown']) moveY = player.speed;
        if (keys['a'] || keys['arrowleft']) moveX = -player.speed;
        if (keys['d'] || keys['arrowright']) moveX = player.speed;
        player.x += moveX; player.y += moveY;

        // Transition: Room to Street
        if (gameState === 'ROOM' && player.y < 10) {
            gameState = 'STREET';
            player.y = canvas.height - 50;
            spawnCritics();
        }
    }

    if (gameState === 'STREET') {
        energy -= 0.02; // Base drain

        critics.forEach(c => {
            let dx = player.x - c.x; let dy = player.y - c.y;
            let dist = Math.hypot(dx, dy);
            c.x += dx/dist * 0.8; c.y += dy/dist * 0.8;
            if (dist < 30) energy -= 0.15; // Criticism hurts!
        });

        if (girl.active) {
            // Girl follows player with a "smooth" floaty movement
            let targetX = player.x - 40;
            let targetY = player.y + 10;
            girl.x += (targetX - girl.x) * 0.05;
            girl.y += (targetY - girl.y) * 0.05;
            
            // Generate sparkles
            if (Math.random() < 0.4) {
                girl.sparkles.push({
                    x: girl.x + 12, y: girl.y + 12,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0
                });
            }
            if (energy < 100) energy += 0.2; // GIRL HEALS YOU
        }
    }
}

// --- 3. CLICK HANDLING ---

canvas.onmousedown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (gameState === 'TITLE') gameState = 'ROOM';

    // Heart Button Click Check
    if (heartBtn.visible) {
        if (mx > heartBtn.x && mx < heartBtn.x + heartBtn.size &&
            my > heartBtn.y && my < heartBtn.y + heartBtn.size) {
            
            girl.active = true;
            girl.x = player.x;
            girl.y = player.y + 100;
            lovePoints += 50; // Summoning her is an act of love!
        }
    }
};

// ... (Rest of your helper functions like drawHUD, drawEntity, keys, etc.)
