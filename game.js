// Rotterdam Runner - game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Draw a colored rectangle
ctx.fillStyle = '#e63946';
ctx.fillRect(100, 150, 200, 100);

// Draw a text label
ctx.fillStyle = '#f1faee';
ctx.font = 'bold 32px monospace';
ctx.textAlign = 'center';
ctx.fillText('Rotterdam Runner', canvas.width / 2, canvas.height / 2);
