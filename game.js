const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State & Stats
let gameState = 'TITLE'; 
let energy = 100;
let lovePoints = 0;

// Player Setup
const player = {
    x: 400, y: 300,
    speed: 4,
    width: 32, height: 32,
    color: "#8d4e2a" // Brown boy
};

// Study Mini-game Variables
let studyTimer = 0;
let bubbles = [];
let bubblesPopped = 0;
const STUDY_GOAL = 7;
let isDistracted = false;

// --- 1. DRAWING FUNCTIONS ---

function drawTitle() {
    ctx.fillStyle = "#2d1b2e"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff77a8";
    ctx.font = "bold 60px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("AURAHEARTS", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px 'Courier New'";
    ctx.fillText("(for sammy ❤️)", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height - 100);
}

function drawRoom() {
    ctx.fillStyle = "#5d3a37"; // Wooden Floor
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bed (Left side)
    ctx.fillStyle = "#3e2723"; 
    ctx.fillRect(50, 50, 80, 140);
    ctx.fillStyle = "#d7ccc8"; // Pillow
    ctx.fillRect(50, 50, 80, 30);
    ctx.fillStyle = "white";
    ctx.font = "14px 'Courier New'";
    ctx.fillText("BED (E)", 90, 40);

    // Study Table (Right side)
    ctx.fillStyle = "#8d6e63";
    const tableX = canvas.width - 200, tableY = 150;
    ctx.fillRect(tableX, tableY, 120, 80);
    // Window in front of table (on the wall)
    ctx.fillStyle = "#81d4fa"; // Sky Blue
    ctx.fillRect(tableX + 10, tableY - 100, 100, 60);
    ctx.strokeStyle = "white";
    ctx.strokeRect(tableX + 10, tableY - 100, 100, 60);

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#212121"; // Cap
    ctx.fillRect(player.x, player.y, player.width, 10);

    // HUD
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`Energy: ${Math.floor(energy)}%`, 20, canvas.height - 40);
    ctx.fillText(`Love: ${lovePoints}`, 20, canvas.height - 20);
}

function drawStudyMode() {
    // Zoomed in Desk View
    ctx.fillStyle = "#3e2723"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // The Window in front
    ctx.fillStyle = "#0277bd"; // Deep Blue Sky
    ctx.fillRect(canvas.width/2 - 150, 50, 300, 150);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.strokeRect(canvas.width/2 - 150, 50, 300, 150);

    // The Table
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(50, 250, canvas.width - 100, canvas.height - 250);

    // Stack of Books (Left)
    ctx.fillStyle = "#d32f2f"; ctx.fillRect(100, 300, 80, 20);
    ctx.fillStyle = "#388e3c"; ctx.fillRect(100, 280, 80, 20);
    ctx.fillStyle = "#1976d2"; ctx.fillRect(100, 260, 80, 20);

    // Open Book (Center)
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(canvas.width/2 - 60, 350, 120, 80);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width/2 - 60, 350, 120, 80);
    ctx.beginPath(); // Middle fold
    ctx.moveTo(canvas.width/2, 350); ctx.lineTo(canvas.width/2, 430); ctx.stroke();

    // Phone (Right)
    ctx.fillStyle = "#212121";
    ctx.fillRect(canvas.width - 200, 380, 40, 70);
    if (isDistracted) {
        ctx.fillStyle = "#00d2ff"; // Screen light
        ctx.fillRect(canvas.width - 195, 385, 30, 60);
    }

    if (isDistracted) {
        ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3); // More shake
        ctx.fillStyle = "#ff5252";
        ctx.textAlign = "center";
        ctx.font = "bold 24px 'Courier New'";
        ctx.fillText("DISTRACTED! TAP BUBBLES", canvas.width / 2, 230);

        bubbles.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.strokeStyle = "#00d2ff";
            ctx.stroke();
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Studying... Energy dropping...", canvas.width / 2, 230);
    }
}

// --- 2. LOGIC & UPDATES ---

function update() {
    if (gameState === 'ROOM') {
        if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
        if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
        if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
        
        // Walls
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

    } else if (gameState === 'STUDYING') {
        if (!isDistracted) {
            energy -= 0.05;
            // Lowered chance of distraction (0.4% chance per frame)
            if (Math.random() < 0.004) {
                isDistracted = true;
                bubbles = Array.from({length: 10}, () => ({
                    x: Math.random() * 600 + 100,
                    y: Math.random() * 400 + 100,
                    radius: 35
                }));
            }
        } else {
             energy -= 0.1; // Energy drains faster when distracted!
        }
    }
}

// --- 3. INPUT HANDLING ---

const keys = {};
window.onkeydown = (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === 'e') {
        if (gameState === 'ROOM') {
            const tableX = canvas.width - 140, tableY = 185;
            const dist = Math.hypot(player.x - tableX, player.y - tableY);
            if (dist < 150) gameState = 'STUDYING';
        } else if (gameState === 'STUDYING' && !isDistracted) {
            gameState = 'ROOM';
        }
    }
};
window.onkeyup = (e) => keys[e.key.toLowerCase()] = false;

canvas.onmousedown = (e) => {
    if (gameState === 'TITLE') gameState = 'ROOM';
    if (gameState === 'STUDYING' && isDistracted) {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        bubbles = bubbles.filter(b => {
            const d = Math.hypot(mx - b.x, my - b.y);
            if (d < b.radius) {
                bubblesPopped++;
                lovePoints += 2;
                return false;
            }
            return true;
        });

        if (bubbles.length <= 3) {
            isDistracted = false;
            bubblesPopped = 0;
            lovePoints += 10; // Bonus for refocusing
        }
    }
};

// --- 4. ENGINE ---

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    if (gameState === 'TITLE') drawTitle();
    else if (gameState === 'ROOM') drawRoom();
    else if (gameState === 'STUDYING') drawStudyMode();
    requestAnimationFrame(gameLoop);
}

canvas.width = 800;
canvas.height = 600;
gameLoop();
