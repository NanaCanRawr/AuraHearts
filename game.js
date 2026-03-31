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
    ctx.fillStyle = "#5d3a37"; // Floor
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bed
    ctx.fillStyle = "#3e2723"; 
    ctx.fillRect(50, 50, 80, 120);
    ctx.fillStyle = "white";
    ctx.fillText("BED (E to Rest)", 90, 40);

    // Study Table
    ctx.fillStyle = "#8d6e63";
    const tableX = canvas.width - 200, tableY = 150;
    ctx.fillRect(tableX, tableY, 120, 70);
    ctx.fillText("TABLE (E to Study)", tableX + 60, tableY - 10);

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#212121"; // Cap
    ctx.fillRect(player.x, player.y, player.width, 10);

    // HUD (Energy/Love)
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`Energy: ${Math.floor(energy)}%`, 20, canvas.height - 40);
    ctx.fillText(`Love: ${lovePoints}`, 20, canvas.height - 20);
}

function drawStudyMode() {
    ctx.fillStyle = "#1a1a1a"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isDistracted) {
        ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        ctx.fillStyle = "#ff5252";
        ctx.textAlign = "center";
        ctx.fillText("TAP THE BUBBLES!", canvas.width / 2, 50);

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
        ctx.fillText("Studying... (E to stop)", canvas.width / 2, 50);
    }
}

// --- 2. LOGIC & UPDATES ---

function update() {
    if (gameState === 'ROOM') {
        // Basic Movement Logic
        if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
        if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
        if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    } else if (gameState === 'STUDYING') {
        if (!isDistracted) {
            energy -= 0.02;
            if (Math.random() < 0.01) {
                isDistracted = true;
                bubbles = Array.from({length: 10}, () => ({
                    x: Math.random() * 700 + 50,
                    y: Math.random() * 500 + 50,
                    radius: 30
                }));
            }
        }
    }
}

// --- 3. INPUT HANDLING ---

const keys = {};
window.onkeydown = (e) => {
    keys[e.key] = true;
    if (e.key.toLowerCase() === 'e') {
        if (gameState === 'ROOM') {
            // Distance check to table
            const dist = Math.hypot(player.x - (canvas.width - 140), player.y - 185);
            if (dist < 150) gameState = 'STUDYING';
        } else if (gameState === 'STUDYING') {
            gameState = 'ROOM';
        }
    }
};
window.onkeyup = (e) => keys[e.key] = false;

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
                lovePoints += 5;
                return false;
            }
            return true;
        });

        if (bubbles.length <= 3) { // Goal reached
            isDistracted = false;
            bubblesPopped = 0;
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
