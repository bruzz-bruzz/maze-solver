import sys
sys.setrecursionlimit(50000)
class MazeSolver:
    def __init__(self,maze,start):
        self.maze = maze
        self.start = start
    def findExits(self):
        res = []
        def isExit(pos):
            return pos[0] == len(self.maze) - 1 or pos[0] == 0 or pos[1] == len(self.maze[0]) - 1 or pos[1] == 0
        def recur(path,pos,s):
            s.add(tuple(pos))
            path.append(pos)
            if pos != self.start and self.maze[pos[0]][pos[1]] == 0 and isExit(pos):
                res.append(path)
            else:
                if pos[0] > 0:
                    if tuple([pos[0] - 1,pos[1]]) not in s and self.maze[pos[0] - 1][pos[1]] == 0:
                        recur(path.copy(),[pos[0] - 1,pos[1]],s.copy())
                if pos[0] < len(self.maze) - 1:
                    if tuple([pos[0] + 1,pos[1]]) not in s and self.maze[pos[0] + 1][pos[1]] == 0:
                        recur(path.copy(),[pos[0] + 1,pos[1]],s.copy())
                if pos[1] > 0:
                    if tuple([pos[0],pos[1] - 1]) not in s and self.maze[pos[0]][pos[1] - 1] == 0:
                        recur(path.copy(),[pos[0],pos[1] - 1],s.copy())
                if pos[1] < len(self.maze[0]) - 1:
                    if tuple([pos[0],pos[1] + 1]) not in s and self.maze[pos[0]][pos[1] + 1] == 0:
                        recur(path.copy(),[pos[0],pos[1] + 1],s.copy())
        recur([],self.start,set())
        self.visualizeRoute(res)
    def visualizeRoute(self,arr):
        print("\n" + "="*50)
        print("🔶 SOLUTION PATH 🔶".center(50))
        print("="*50 + "\n")
        tmp = [row[:] for row in self.maze]  # Deep copy
        for path in arr:
            for y in path:
                tmp[y[0]][y[1]] = 2
        for x in tmp:
            s = ''
            for y in x:
                if y == 2:
                    s += '🟢'  # Path
                elif y == 1:
                    s += '🟫'  # Wall
                elif y == 0:
                    s += '  '  # Empty
            print(s)
        print("\n" + "="*50)
