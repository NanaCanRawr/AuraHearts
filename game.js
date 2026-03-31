const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameState = 'TITLE'; 
let energy = 100;
let lovePoints = 0;

// Player Object
const player = {
    x: 100, y: 100,
    speed: 2,
    dir: 'down',
    width: 32, height: 32
};

// 1. DRAWING THE TITLE SCREEN
function drawTitle() {
    ctx.fillStyle = "#2d1b2e"; // Retro dark purple background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pixel Logo "Aurahearts"
    ctx.fillStyle = "#ff77a8"; // Pinkish logo
    ctx.font = "bold 60px 'Courier New'"; // Use a monospaced font for pixel look
    ctx.textAlign = "center";
    ctx.fillText("AURAHEARTS", canvas.width / 2, canvas.height / 2);

    // Subtitle
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px 'Courier New'";
    ctx.fillText("(for sammy ❤️)", canvas.width / 2, canvas.height / 2 + 50);

    // Interaction Prompt
    ctx.font = "16px 'Courier New'";
    ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height - 100);
}

// 2. DRAWING THE ROOM
function drawRoom() {
    ctx.fillStyle = "#5d3a37"; // Brownish floor
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple Bed, Table, Window placeholders
    ctx.fillStyle = "#3e2723"; 
    ctx.fillRect(50, 50, 80, 120); // Bed
    ctx.fillText("BED (E to Rest)", 50, 40);

    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(canvas.width - 150, 100, 100, 60); // Study Table
    ctx.fillText("TABLE (E to Study)", canvas.width - 150, 90);

    // The Boy (Brown boy w/ cap placeholder)
    ctx.fillStyle = "#8d4e2a"; // Brown skin tone
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#212121"; // Cap
    ctx.fillRect(player.x, player.y, player.width, 10);
}

// 3. MAIN LOOP
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'TITLE') {
        drawTitle();
    } else if (gameState === 'ROOM') {
        drawRoom();
        updatePlayer();
    }
    
    requestAnimationFrame(gameLoop);
}

// Input Handling
window.addEventListener('click', () => {
    if (gameState === 'TITLE') gameState = 'ROOM';
});

// Start the game
canvas.width = 800; // Fixed internal resolution for consistent pixel math
canvas.height = 600;
gameLoop();
