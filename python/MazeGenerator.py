import random
class GenerateMaze():
    def __init__(self,rows,cols,start):
        self.rows = rows
        self.cols = cols
        self.start = start
    def generate(self,width,height):
        grid_w, grid_h = width * 2 + 1, height * 2 + 1
        maze = [[1] * grid_w for _ in range(grid_h)]
        visited = set()
        stack = []
        start_cell = self.start
        visited.add(start_cell)
        stack.append(start_cell)
        maze[1][1] = 0
        while stack:
            cx, cy = stack[-1]
            neighbors = []
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    neighbors.append((nx, ny, dx, dy))
            if neighbors:
                nx, ny, dx, dy = random.choice(neighbors)
                maze[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = 0
                maze[ny * 2 + 1][nx * 2 + 1] = 0
                visited.add((nx, ny))
                stack.append((nx, ny))
            else:
                stack.pop()
        maze[1][0] = 0
        maze[grid_h - 2][grid_w - 1] = 0
        numberOfExits = random.randint(1,5)
        def nearStart(pos):
            return [pos[0] - 1,pos[1]] == self.start or [pos[0] + 1,pos[1]] == self.start or [pos[0],pos[1] - 1] == self.start or [pos[0],pos[1] + 1] == self.start
        for _ in range(numberOfExits):
            coinFlip = random.randint(1,2)
            direction = 'horizontal' if coinFlip == 1 else 'vertical'
            if direction == 'horizontal':
                coinFlip = random.randint(1,2)
                side = 0 if coinFlip == 1 else grid_h - 2
                idx = [side,random.randint(0,grid_w - 2)]
                if not nearStart(idx):
                    maze[idx[0]][idx[1]] = 0
            else:
                coinFlip = random.randint(1,2)
                side = 0 if coinFlip == 1 else grid_w - 2
                idx = [random.randint(0,grid_h - 2),side]
                if not nearStart(idx):
                    maze[idx[0]][idx[1]] = 0
        self.visualize(maze)
        return maze
    def visualize(self, maze):
        print("\n" + "="*50)
        print("🔷 MAZE VISUALIZATION 🔷".center(50))
        print("="*50 + "\n")
        for x in maze:
            s = ''
            for y in x:
                if y == 1:
                    s += '🟫'  # Wall
                elif y == 0:
                    s += '  '  # Path
            print(s)
        print("\n" + "="*50)