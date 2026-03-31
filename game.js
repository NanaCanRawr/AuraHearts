const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State & Stats
let gameState = 'TITLE'; 
let energy = 100;
let lovePoints = 0;

// Player & NPC Setup
const player = { x: 400, y: 400, speed: 4, width: 32, height: 32, color: "#8d4e2a" };
const girl = { x: 0, y: 0, active: false, width: 24, height: 24, sparkles: [] };
let critics = [];
const heartBtn = { x: 20, y: 20, size: 50, visible: false };

// --- 1. DRAWING FUNCTIONS ---

function drawRoom() {
    ctx.fillStyle = "#5d3a37"; ctx.fillRect(0, 0, canvas.width, canvas.height); // Floor
    
    // THE DOOR (Visual)
    ctx.fillStyle = "#3e2723"; ctx.fillRect(canvas.width / 2 - 30, 0, 60, 80); // Door frame
    ctx.fillStyle = "#6d4c41"; ctx.fillRect(canvas.width / 2 - 25, 5, 50, 75); // Door wood
    ctx.fillStyle = "#ffd54f"; ctx.beginPath(); ctx.arc(canvas.width / 2 + 15, 45, 4, 0, Math.PI*2); ctx.fill(); // Handle

    // Bed & Table
    ctx.fillStyle = "#3e2723"; ctx.fillRect(50, 100, 80, 140); // Bed
    ctx.fillStyle = "#8d6e63"; ctx.fillRect(canvas.width - 200, 200, 120, 80); // Table

    // --- INTERACTION BOXES ---
    ctx.font = "14px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    // Near Door
    if (Math.abs(player.x - canvas.width/2) < 60 && player.y < 120) {
        drawSpeechBubble(canvas.width/2, 100, "Click E to Open Door");
    }
    // Near Table
    if (Math.hypot(player.x - (canvas.width - 140), player.y - 240) < 80) {
        drawSpeechBubble(canvas.width - 140, 180, "Click E to Study");
    }
    // Near Bed
    if (Math.hypot(player.x - 90, player.y - 170) < 80) {
        drawSpeechBubble(90, 80, "Click E to Rest");
    }

    drawHUD();
    drawEntity(player);
}

function drawSpeechBubble(x, y, text) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    let metrics = ctx.measureText(text);
    ctx.fillRect(x - (metrics.width/2 + 10), y - 20, metrics.width + 20, 30);
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
}

// ... (Previous drawStreet and drawStudyMode functions stay the same)

// --- 2. INPUT HANDLING (The "E" logic) ---

window.onkeydown = (e) => {
    let k = e.key.toLowerCase();
    keys[k] = true;

    if (k === 'e') {
        // Door Check
        if (gameState === 'ROOM' && Math.abs(player.x - canvas.width/2) < 60 && player.y < 120) {
            gameState = 'STREET';
            player.y = canvas.height - 100;
            spawnCritics();
        }
        // Table Check
        else if (gameState === 'ROOM' && Math.hypot(player.x - (canvas.width - 140), player.y - 240) < 80) {
            gameState = 'STUDYING';
        }
        // Bed Check
        else if (gameState === 'ROOM' && Math.hypot(player.x - 90, player.y - 170) < 80) {
            energy = Math.min(100, energy + 25); // Rest gives 25% energy
            alert("Resting... Energy +25%");
        }
        // Exit Study
        else if (gameState === 'STUDYING') {
            gameState = 'ROOM';
        }
    }
};

// ... (Keep the rest of the game loop and heart button logic)
