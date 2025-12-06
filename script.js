// Get DOM elements
const canvas = document.getElementById('coordinatePlane');
const ctx = canvas.getContext('2d');
const x1Input = document.getElementById('x1');
const y1Input = document.getElementById('y1');
const x2Input = document.getElementById('x2');
const y2Input = document.getElementById('y2');
const drawButton = document.getElementById('drawVector');
const clearButton = document.getElementById('clearVector');
const vectorDetails = document.getElementById('vectorDetails');

// Canvas settings
const canvasSize = 600;
const gridSize = 20; // pixels per unit
const origin = { x: canvasSize / 2, y: canvasSize / 2 };

// Initialize the coordinate plane
function initCoordinatePlane() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= canvasSize; i += gridSize) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasSize);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasSize, i);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(canvasSize, origin.y);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, canvasSize);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // X-axis numbers
    for (let i = -15; i <= 15; i += 5) {
        if (i !== 0) {
            const x = origin.x + i * gridSize;
            ctx.fillText(i.toString(), x, origin.y + 20);
        }
    }
    
    // Y-axis numbers
    ctx.textAlign = 'right';
    for (let i = -15; i <= 15; i += 5) {
        if (i !== 0) {
            const y = origin.y - i * gridSize;
            ctx.fillText(i.toString(), origin.x - 10, y + 5);
        }
    }
    
    // Origin label
    ctx.textAlign = 'right';
    ctx.fillText('0', origin.x - 10, origin.y + 20);
    
    // Axis arrows
    drawArrow(ctx, canvasSize - 20, origin.y, canvasSize - 5, origin.y, '#333', 2);
    drawArrow(ctx, origin.x, 20, origin.x, 5, '#333', 2);
    
    // Axis labels
    ctx.font = 'bold 16px Arial';
    ctx.fillText('x', canvasSize - 15, origin.y - 10);
    ctx.fillText('y', origin.x + 20, 15);
}

// Convert mathematical coordinates to canvas coordinates
function mathToCanvas(x, y) {
    return {
        x: origin.x + x * gridSize,
        y: origin.y - y * gridSize // Subtract because canvas y increases downward
    };
}

// Draw an arrow
function drawArrow(ctx, fromX, fromY, toX, toY, color, lineWidth) {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

// Draw a point
function drawPoint(x, y, label, color) {
    const canvasCoords = mathToCanvas(x, y);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(canvasCoords.x, canvasCoords.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, canvasCoords.x + 10, canvasCoords.y - 10);
}

// Draw vector
function drawVector() {
    const x1 = parseFloat(x1Input.value);
    const y1 = parseFloat(y1Input.value);
    const x2 = parseFloat(x2Input.value);
    const y2 = parseFloat(y2Input.value);
    
    // Validate inputs
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        alert('Please enter valid numbers for all coordinates.');
        return;
    }
    
    // Check if points are within bounds
    const maxCoord = 15;
    if (Math.abs(x1) > maxCoord || Math.abs(y1) > maxCoord || 
        Math.abs(x2) > maxCoord || Math.abs(y2) > maxCoord) {
        alert(`Coordinates must be between -${maxCoord} and ${maxCoord}.`);
        return;
    }
    
    // Redraw coordinate plane
    initCoordinatePlane();
    
    // Draw initial point
    drawPoint(x1, y1, `(${x1}, ${y1})`, '#ff6b6b');
    
    // Draw terminal point
    drawPoint(x2, y2, `(${x2}, ${y2})`, '#4ecdc4');
    
    // Draw vector
    const start = mathToCanvas(x1, y1);
    const end = mathToCanvas(x2, y2);
    drawArrow(ctx, start.x, start.y, end.x, end.y, '#667eea', 3);
    
    // Calculate vector components
    const dx = x2 - x1;
    const dy = y2 - y1;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Update vector information
    vectorDetails.innerHTML = `
        <p><strong>Initial Point:</strong> (${x1}, ${y1})</p>
        <p><strong>Terminal Point:</strong> (${x2}, ${y2})</p>
        <p><strong>Component Form:</strong> ⟨${dx.toFixed(2)}, ${dy.toFixed(2)}⟩</p>
        <p><strong>Magnitude:</strong> ${magnitude.toFixed(2)}</p>
        <p><strong>Direction:</strong> ${angle.toFixed(2)}°</p>
    `;
}

// Clear the canvas
function clearCanvas() {
    initCoordinatePlane();
    vectorDetails.innerHTML = '<p>Enter coordinates and click "Draw Vector"</p>';
}

// ========== PRACTICE MODE ==========

// Get practice mode elements
const practiceCanvas = document.getElementById('practiceCanvas');
const practiceCtx = practiceCanvas.getContext('2d');
const newProblemBtn = document.getElementById('newProblem');
const problemText = document.getElementById('problemText');
const feedback = document.getElementById('feedback');
const correctCountEl = document.getElementById('correctCount');
const attemptCountEl = document.getElementById('attemptCount');

// Practice mode state
let currentProblem = null;
let correctCount = 0;
let attemptCount = 0;
let practiceActive = false;

// Initialize practice canvas
function initPracticeCanvas() {
    practiceCtx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Draw grid
    practiceCtx.strokeStyle = '#e0e0e0';
    practiceCtx.lineWidth = 1;
    
    for (let i = 0; i <= canvasSize; i += gridSize) {
        practiceCtx.beginPath();
        practiceCtx.moveTo(i, 0);
        practiceCtx.lineTo(i, canvasSize);
        practiceCtx.stroke();
        
        practiceCtx.beginPath();
        practiceCtx.moveTo(0, i);
        practiceCtx.lineTo(canvasSize, i);
        practiceCtx.stroke();
    }
    
    // Draw axes
    practiceCtx.strokeStyle = '#333';
    practiceCtx.lineWidth = 2;
    
    practiceCtx.beginPath();
    practiceCtx.moveTo(0, origin.y);
    practiceCtx.lineTo(canvasSize, origin.y);
    practiceCtx.stroke();
    
    practiceCtx.beginPath();
    practiceCtx.moveTo(origin.x, 0);
    practiceCtx.lineTo(origin.x, canvasSize);
    practiceCtx.stroke();
    
    // Draw axis labels
    practiceCtx.fillStyle = '#333';
    practiceCtx.font = 'bold 14px Arial';
    practiceCtx.textAlign = 'center';
    
    for (let i = -15; i <= 15; i += 5) {
        if (i !== 0) {
            const x = origin.x + i * gridSize;
            practiceCtx.fillText(i.toString(), x, origin.y + 20);
        }
    }
    
    practiceCtx.textAlign = 'right';
    for (let i = -15; i <= 15; i += 5) {
        if (i !== 0) {
            const y = origin.y - i * gridSize;
            practiceCtx.fillText(i.toString(), origin.x - 10, y + 5);
        }
    }
    
    practiceCtx.textAlign = 'right';
    practiceCtx.fillText('0', origin.x - 10, origin.y + 20);
    
    drawArrow(practiceCtx, canvasSize - 20, origin.y, canvasSize - 5, origin.y, '#333', 2);
    drawArrow(practiceCtx, origin.x, 20, origin.x, 5, '#333', 2);
    
    practiceCtx.font = 'bold 16px Arial';
    practiceCtx.fillText('x', canvasSize - 15, origin.y - 10);
    practiceCtx.fillText('y', origin.x + 20, 15);
}

// Generate a random practice problem
function generateProblem() {
    // Allow initial point anywhere in -12 to 12
    const x1 = Math.floor(Math.random() * 25) - 12; // -12 to 12
    const y1 = Math.floor(Math.random() * 25) - 12;
    // Allow vector components to be large enough to reach most of the plane
    const dx = Math.floor(Math.random() * 25) - 12; // -12 to 12
    const dy = Math.floor(Math.random() * 25) - 12;

    // Ensure the vector has some length
    if (dx === 0 && dy === 0) {
        return generateProblem();
    }

    const x2 = x1 + dx;
    const y2 = y1 + dy;

    // Check if both points are within bounds
    if (Math.abs(x2) > 15 || Math.abs(y2) > 15 || Math.abs(x1) > 15 || Math.abs(y1) > 15) {
        return generateProblem();
    }

    return { x1, y1, x2, y2, dx, dy };
}

// Start a new problem
function newProblem() {
    currentProblem = generateProblem();
    practiceActive = true;
    feedback.className = 'feedback hidden';
    
    initPracticeCanvas();
    
    // Draw initial point
    const start = mathToCanvas(currentProblem.x1, currentProblem.y1);
    practiceCtx.fillStyle = '#ff6b6b';
    practiceCtx.beginPath();
    practiceCtx.arc(start.x, start.y, 6, 0, 2 * Math.PI);
    practiceCtx.fill();
    
    practiceCtx.fillStyle = '#333';
    practiceCtx.font = 'bold 12px Arial';
    practiceCtx.textAlign = 'left';
    practiceCtx.fillText(`(${currentProblem.x1}, ${currentProblem.y1})`, start.x + 10, start.y - 10);
    
    // Update problem text
    const magnitude = Math.sqrt(currentProblem.dx ** 2 + currentProblem.dy ** 2).toFixed(2);
    problemText.innerHTML = `
        <p><strong>Initial Point:</strong> (${currentProblem.x1}, ${currentProblem.y1})</p>
        <p><strong>Vector Components:</strong> ⟨${currentProblem.dx}, ${currentProblem.dy}⟩</p>
        <p><strong>Magnitude:</strong> ${magnitude}</p>
        <p><strong>Task:</strong> Click on the terminal point!</p>
    `;
}

// Convert canvas click to math coordinates
function canvasToMath(canvasX, canvasY) {
    const rect = practiceCanvas.getBoundingClientRect();
    const x = canvasX - rect.left;
    const y = canvasY - rect.top;
    
    const mathX = Math.round((x - origin.x) / gridSize);
    const mathY = Math.round((origin.y - y) / gridSize);
    
    return { x: mathX, y: mathY };
}

// Handle canvas click
function handlePracticeClick(event) {
    if (!practiceActive) return;
    
    const coords = canvasToMath(event.clientX, event.clientY);
    attemptCount++;
    attemptCountEl.textContent = attemptCount;
    
    // Check if correct
    if (coords.x === currentProblem.x2 && coords.y === currentProblem.y2) {
        // Correct answer
        correctCount++;
        correctCountEl.textContent = correctCount;
        practiceActive = false;
        
        // Draw the complete vector
        const start = mathToCanvas(currentProblem.x1, currentProblem.y1);
        const end = mathToCanvas(currentProblem.x2, currentProblem.y2);
        drawArrow(practiceCtx, start.x, start.y, end.x, end.y, '#4ecdc4', 3);
        
        // Draw terminal point
        practiceCtx.fillStyle = '#4ecdc4';
        practiceCtx.beginPath();
        practiceCtx.arc(end.x, end.y, 6, 0, 2 * Math.PI);
        practiceCtx.fill();
        
        practiceCtx.fillStyle = '#333';
        practiceCtx.font = 'bold 12px Arial';
        practiceCtx.textAlign = 'left';
        practiceCtx.fillText(`(${currentProblem.x2}, ${currentProblem.y2})`, end.x + 10, end.y - 10);
        
        // Show success feedback
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct!';
    } else {
        // Incorrect answer - draw the clicked point
        const clicked = mathToCanvas(coords.x, coords.y);
        practiceCtx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        practiceCtx.beginPath();
        practiceCtx.arc(clicked.x, clicked.y, 5, 0, 2 * Math.PI);
        practiceCtx.fill();
        
        // Show error feedback
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = `
            <div>✗ Incorrect. Try again or get a new problem.</div>
            <div class="feedback-buttons">
                <button class="btn-secondary" onclick="newProblem()">New Problem</button>
            </div>
        `;
    }
}

// Event listeners
drawButton.addEventListener('click', drawVector);
clearButton.addEventListener('click', clearCanvas);
newProblemBtn.addEventListener('click', newProblem);
practiceCanvas.addEventListener('click', handlePracticeClick);

// Allow Enter key to draw vector
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            drawVector();
        }
    });
});

// Initialize on load
initCoordinatePlane();
