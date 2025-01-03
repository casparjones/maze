document.addEventListener("DOMContentLoaded", () => {
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

  let timeout = 0;
  let oldDirection = null;
  let directionMulti = 1;
  joystick.on('move', (evt, data) => {
      if (data.direction) {
        if(oldDirection == data.direction.angle) {
          directionMulti = directionMulti + 10;
          if(directionMulti > 100) directionMulti = 100;
        } else {
          directionMulti = 0;
        }
        
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          player.handleJoystickMovement(data.direction.angle);
          timeout = 0;
          oldDirection = data.direction.angle;
        }, 100 - directionMulti);
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
