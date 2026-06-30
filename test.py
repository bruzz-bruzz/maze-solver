from MazeSolver import MazeSolver
from MazeGenerator import GenerateMaze
start = (1,0)
generator = GenerateMaze(10,10,start)
solver = MazeSolver(generator.generate(generator.cols,generator.rows),start)
solver.findExits()