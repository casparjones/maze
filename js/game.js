document.addEventListener("DOMContentLoaded", () => {
  debugger;
  const joystick = nipplejs.create({
      zone: document.getElementById('joystickZone'), // Wo der Joystick erscheint
      mode: 'dynamic', // Dynamisch: Joystick erscheint bei Berührung
      position: { left: '50%', bottom: '20%' }, // Standard-Position
      color: 'blue', // Farbe des Joysticks
  });

  const mazeCanvasId = "mazeCanvas";
  const fogCanvasId = "fogCanvas";

  const container = document.querySelector('.container');
  const containerWidth = Math.min(container.offsetWidth, 600); // Maximal 600px
  const cellSize = Math.floor(containerWidth / 30); // Dynamische Zellgröße

  const maze = new Maze(mazeCanvasId, 30, 30, cellSize);
  const player = new Player(fogCanvasId, maze, cellSize);

  joystick.on('move', (evt, data) => {
      if (data.direction) {
        player.handleJoystickMovement(data.direction.angle);
      }
  });

  // Update Canvas size on window resize
  window.addEventListener('resize', () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      const containerWidth = Math.min(container.offsetWidth, 600);
      const newCellSize = Math.floor(containerWidth / 30);
      maze.updateCanvasSize(newCellSize);
      player.updateCanvasSize(newCellSize);
  });
});
