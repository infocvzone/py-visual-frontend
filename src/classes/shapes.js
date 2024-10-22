// Function to add a rectangle
function addRectangle(canvas, left, top, width, height, fill) {
  const rect = new fabric.Rect({
    left: left, // X coordinate
    top: top, // Y coordinate
    fill: fill, // Fill color
    width: width, // Width of the rectangle
    height: height, // Height of the rectangle
  });
  canvas.add(rect); // Add rectangle to canvas
}

// Function to add a circle
function addCircle( left, top, radius, fill) {
  const circle = new fabric.Circle({
    left: left, // X coordinate
    top: top, // Y coordinate
    radius: radius, // Radius of the circle
    fill: fill, // Fill color
  });
  canvas.add(circle); // Add circle to canvas
}

// Function to add a line
function addLine(x1, y1, x2, y2, stroke) {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: stroke, // Stroke color
    strokeWidth: 2, // Line width
  });
  canvas.add(line); // Add line to canvas
}
