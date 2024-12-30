// Usage example:
document.addEventListener("DOMContentLoaded", () => {
    const mazeCanvasId = "mazeCanvas";
    const fogCanvasId = "fogCanvas";
    const maze = new Maze(mazeCanvasId, 30, 30, 20);
    new Player(fogCanvasId, maze, 20);
  });
  