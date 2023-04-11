// Make a function that draws a graph of the top scores

let topScores = [];

function updateTopScores(score) {
    topScores.push(score);
    if (topScores.length > 100) {
      topScores.shift();
    }
    drawGraph(topScores);
}

function drawGraph(scores) {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
  
    // Set canvas dimensions and scale for device pixel ratio
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Define some constants for the graph
    const margin = 0;
    const graphWidth = canvas.width - 2 * margin;
    const graphHeight = canvas.height - 2 * margin;
    const maxScore = Math.max(...scores);
    const scaleFactor = graphHeight / maxScore;
    const numPoints = scores.length;
  
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin - scores[0] * scaleFactor);
    for (let i = 1; i < numPoints; i++) {
      const x = margin + i * (graphWidth / (numPoints - 1));
      const y = canvas.height - margin - scores[i] * scaleFactor;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
  
    // Draw the axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.strokeStyle = "#CCCCCC";
    ctx.stroke();

    // Write "Top Scores across Generations" at the bottom center of the canvas
    ctx.font = "12px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Top Scores across Generations", 15, 25);
}

updateTopScores(0);