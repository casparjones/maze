class Player {
    constructor(canvasId, maze, cellSize) {
      this.canvas = document.getElementById(canvasId);
      this.context = this.canvas.getContext("2d");
      this.maze = maze;
      this.cellSize = cellSize;
      this.won = false;

      // Set the fogCanvas size to match the mazeCanvas using maze.canvas
      this.canvas.width = this.maze.canvas.width;
      this.canvas.height = this.maze.canvas.height;

      this.position = { row: 0, col: 0 };
      this.startTime = Date.now();
      this.addControls();
      this.counterInterval = setInterval(() => {
        this.drawTimer();
      }, 1000);
      this.render();
    }

    drawTimer() {
        const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(0);
        document.getElementById("seconds").innerHTML = timeTaken;
    }

    drawFog() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.fillStyle = "rgba(50, 50, 50, 1)";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const centerX = this.position.col * this.cellSize + this.cellSize / 2;
      const centerY = this.position.row * this.cellSize + this.cellSize / 2;

      const gradient = this.context.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.cellSize * 5);

      gradient.addColorStop(0,   "rgba(0, 0, 0, 1)"); 
      gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.5)");
      gradient.addColorStop(1,   "rgba(0, 0, 0, 0)");

      this.context.globalCompositeOperation = "destination-out";
      this.context.fillStyle = gradient;
      this.context.beginPath();
      this.context.arc(centerX, centerY, this.cellSize * 5, 0, Math.PI * 2);
      this.context.fill();
      this.context.globalCompositeOperation = "source-over";
    }

    drawPlayer() {
      const x = this.position.col * this.cellSize + this.cellSize / 4;
      const y = this.position.row * this.cellSize + this.cellSize / 4;
      const radius = this.cellSize / 4;

      this.context.fillStyle = "black";
      this.context.beginPath();
      this.context.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
      this.context.fill();
    }

    render() {
      this.drawFog();
      this.drawPlayer();
    }

    canMoveTo(row, col) {
      if (row < 0 || row >= this.maze.rows || col < 0 || col >= this.maze.cols) {
        return false;
      }

      const currentCell = this.maze.grid[this.position.row][this.position.col];
      if (row < this.position.row && currentCell.walls.top) return false;
      if (row > this.position.row && currentCell.walls.bottom) return false;
      if (col < this.position.col && currentCell.walls.left) return false;
      if (col > this.position.col && currentCell.walls.right) return false;

      return true;
    }

    movePlayer(rowChange, colChange) {
      const newRow = this.position.row + rowChange;
      const newCol = this.position.col + colChange;

      if (this.canMoveTo(newRow, newCol)) {
        this.position = { row: newRow, col: newCol };
        this.render();

        if (this.position.row === this.maze.end.row && this.position.col === this.maze.end.col) {
          this.win();
        }
      }
    }

    win() {
      this.won = true;
      clearInterval(this.counterInterval);
      const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(2);
      document.getElementById("win-place").innerHTML = `WON! Time: ${timeTaken} seconds`;
    }

    addControls() {
      document.addEventListener("keydown", (event) => {
        if (this.won === true) return;

        switch (event.key) {
          case "ArrowUp":
            this.movePlayer(-1, 0);
            break;
          case "ArrowDown":
            this.movePlayer(1, 0);
            break;
          case "ArrowLeft":
            this.movePlayer(0, -1);
            break;
          case "ArrowRight":
            this.movePlayer(0, 1);
            break;
        }
      });
    }
}
