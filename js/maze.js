class Maze {
    constructor(canvasId, rows, cols, cellSize) {
      this.canvas = document.getElementById(canvasId);
      this.context = this.canvas.getContext("2d");
      this.rows = rows;
      this.cols = cols;
      this.cellSize = cellSize;
      this.grid = [];
      this.stack = [];
      this.currentCell = null;
      this.start = null;
      this.end = null;
      this.initCanvas();
      this.generateGrid();
      this.generateMaze();
    }

    updateCanvasSize(newCellSize) {
        this.cellSize = newCellSize;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        this.drawMaze();
    }
 
  
    initCanvas() {
      this.canvas.width = this.cols * this.cellSize;
      this.canvas.height = this.rows * this.cellSize;
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    generateGrid() {
      for (let row = 0; row < this.rows; row++) {
        const gridRow = [];
        for (let col = 0; col < this.cols; col++) {
          gridRow.push({
            row,
            col,
            visited: false,
            walls: { top: true, right: true, bottom: true, left: true },
          });
        }
        this.grid.push(gridRow);
      }
      this.start = this.grid[0][0];
      this.end = this.grid[this.rows - 1][this.cols - 1];
      this.currentCell = this.start;
      this.currentCell.visited = true;
    }
  
    drawCell(cell) {
      const x = cell.col * this.cellSize;
      const y = cell.row * this.cellSize;
  
      this.context.fillStyle = "white";
      this.context.fillRect(x, y, this.cellSize, this.cellSize);
  
      this.context.strokeStyle = "black";
      this.context.lineWidth = 2;
  
      if (cell.walls.top) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + this.cellSize, y);
        this.context.stroke();
      }
  
      if (cell.walls.right) {
        this.context.beginPath();
        this.context.moveTo(x + this.cellSize, y);
        this.context.lineTo(x + this.cellSize, y + this.cellSize);
        this.context.stroke();
      }
  
      if (cell.walls.bottom) {
        this.context.beginPath();
        this.context.moveTo(x + this.cellSize, y + this.cellSize);
        this.context.lineTo(x, y + this.cellSize);
        this.context.stroke();
      }
  
      if (cell.walls.left) {
        this.context.beginPath();
        this.context.moveTo(x, y + this.cellSize);
        this.context.lineTo(x, y);
        this.context.stroke();
      }
    }
  
    highlightCell(cell, color) {
      const x = cell.col * this.cellSize;
      const y = cell.row * this.cellSize;
      this.context.fillStyle = color;
      this.context.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
    }
  
    drawMaze() {
      for (const row of this.grid) {
        for (const cell of row) {
          this.drawCell(cell);
        }
      }
      this.highlightCell(this.start, "green");
      this.highlightCell(this.end, "red");
    }
  
    getNeighbors(cell, visited) {
      const neighbors = [];
      const { row, col } = cell;
  
      if (row > 0) neighbors.push(this.grid[row - 1][col]);
      if (row < this.rows - 1) neighbors.push(this.grid[row + 1][col]);
      if (col > 0) neighbors.push(this.grid[row][col - 1]);
      if (col < this.cols - 1) neighbors.push(this.grid[row][col + 1]);

      if(visited === true) return neighbors;
      return neighbors.filter((neighbor) => !neighbor.visited);
    }
  
    removeWalls(cell1, cell2) {
      const dx = cell1.col - cell2.col;
      const dy = cell1.row - cell2.row;
  
      if (dx === 1) {
        cell1.walls.left = false;
        cell2.walls.right = false;
      } else if (dx === -1) {
        cell1.walls.right = false;
        cell2.walls.left = false;
      }
  
      if (dy === 1) {
        cell1.walls.top = false;
        cell2.walls.bottom = false;
      } else if (dy === -1) {
        cell1.walls.bottom = false;
        cell2.walls.top = false;
      }
    }
  
    setLevel(level) {
      for(let i = 0; i < level; i++) {
        for(let j = 0; j < this.grid.length; j++) {
          let x = parseInt(Math.random() * this.grid.length);
          let cell = this.grid[j][x];
          const neighbors = this.getNeighbors(cell, true);
          const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.removeWalls(cell, nextCell);
        }
      }
    }

    generateMaze() {
      while (true) {
        const neighbors = this.getNeighbors(this.currentCell, false);
  
        if (neighbors.length > 0) {
          const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.stack.push(this.currentCell);
          this.removeWalls(this.currentCell, nextCell);
          this.currentCell = nextCell;
          this.currentCell.visited = true;
        } else if (this.stack.length > 0) {
          this.currentCell = this.stack.pop();
        } else {
          break;
        }
      }
  
      this.setLevel(1);
      this.drawMaze();
    }
  }
  