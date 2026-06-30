import { useState } from 'react'
import './App.css'
import Toast from './Toast'
import Github from './Github'
export default function App() {
  const [rows,setRows] = useState<number>(0)
  const [cols,setCols] = useState<number>(0)
  const [maze,setMaze] = useState<number[][]>([[0]])
  const [path,setPath] = useState<number[][]>([])
  const [generated,setGenerated] = useState<boolean>(false)
  const [toast,setToast] = useState<{msg:string,ok:boolean}>({msg:"",ok:false})
  function clearToast(){
    setTimeout(()=>{
      setToast({msg:'',ok:false})
    },3000)
  }
  function generateMaze(width:number,height:number,start:number[]){
    const grid_w = width * 2 + 1
    const grid_h = height * 2 + 1
    const m: number[][] = []
    for(let i = 0; i < grid_h; i++){
      const tmp: number[] = []
      for(let x = 0; x < grid_w; x++){
        tmp.push(1)
      }
      m.push(tmp)
    }
    const visited = new Set<string>()
    const stack: number[][] = []
    const startKey = `${start[0]},${start[1]}`
    visited.add(startKey)
    stack.push(start)
    const startGridRow = start[1] * 2 + 1
    const startGridCol = start[0] * 2 + 1
    if (grid_h > 1 && grid_w > 1) m[startGridRow][startGridCol] = 0
    while(stack.length > 0){
      const pop = stack[stack.length - 1]
      const cx = pop[0]
      const cy = pop[1]
      const neighbors: number[][] = []
      const coords = [[-1,0],[1,0],[0,-1],[0,1]]
      for(let x = 0; x < coords.length; x++){
        const nx = cx + coords[x][0]
        const ny = cy + coords[x][1]
        const key = `${nx},${ny}`
        if((0 <= nx && nx < width) && (0 <= ny && ny < height) && !visited.has(key)){
          neighbors.push([nx,ny,coords[x][0],coords[x][1]])
        }
      }
      if(neighbors.length > 0){
        const idx = Math.floor(Math.random() * neighbors.length)
        const nx = neighbors[idx][0]
        const ny = neighbors[idx][1]
        const dx = neighbors[idx][2]
        const dy = neighbors[idx][3]
        m[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = 0
        m[ny * 2 + 1][nx * 2 + 1] = 0
        visited.add(`${nx},${ny}`)
        stack.push([nx,ny])
      } else {
        stack.pop()
      }
    }
    if (grid_h > 2 && grid_w > 1) m[1][0] = 0
    if (grid_h > 2 && grid_w > 2) m[grid_h - 2][grid_w - 1] = 0
    const numberOfExits = Math.floor(Math.random() * 5) + 1
    function nearStart(pos:number[]){
      const startGridRow = start[1] * 2 + 1
      const startGridCol = start[0] * 2 + 1
      return (
        (pos[0] === startGridRow && pos[1] === startGridCol) ||
        (pos[0] === startGridRow - 1 && pos[1] === startGridCol) ||
        (pos[0] === startGridRow + 1 && pos[1] === startGridCol) ||
        (pos[0] === startGridRow && pos[1] === startGridCol - 1) ||
        (pos[0] === startGridRow && pos[1] === startGridCol + 1)
      )
    }
    for(let t = 0; t < numberOfExits; t++){
      const coinFlip = Math.floor(Math.random() * 2) + 1
      const direction = coinFlip === 1 ? 'horizontal' : 'vertical'
      if(direction === 'horizontal'){
        const sideFlip = Math.floor(Math.random() * 2) + 1
        const side = sideFlip === 1 ? 0 : grid_h - 1
        const idx = [side, Math.floor(Math.random() * (grid_w - 2)) + 1]
        if(!nearStart(idx)){
          m[idx[0]][idx[1]] = 0
        }
      } else {
        const sideFlip = Math.floor(Math.random() * 2) + 1
        const side = sideFlip === 1 ? 0 : grid_w - 1
        const idx = [Math.floor(Math.random() * (grid_h - 2)) + 1, side]
        if(!nearStart(idx)){
          m[idx[0]][idx[1]] = 0
        }
      }
    }
    return m
  }
  function solveMaze(m:number[][],start:number[]){
    const rows = m.length
    const cols = m[0]?.length || 0
    const startRow = start[1] * 2 + 1
    const startCol = start[0] * 2 + 1
    const isExit = (r:number,c:number) => (r === 0 || r === rows - 1 || c === 0 || c === cols - 1)
    const solutions: number[][][] = []
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
    function dfs(path:number[][],pos:number[],visited:Set<string>){
      const [r,c] = pos
      const key = `${r},${c}`
      if(visited.has(key) || m[r][c] !== 0) return
      visited.add(key)
      const nextPath = path.concat([[r,c]])
      if(!(r === startRow && c === startCol) && isExit(r,c)){
        solutions.push(nextPath)
        return
      }
      for(const d of dirs){
        const nr = r + d[0]
        const nc = c + d[1]
        if(nr >= 0 && nr < rows && nc >= 0 && nc < cols){
          dfs(nextPath, [nr,nc], new Set(visited))
        }
      }
    }
    if(startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) return []
    dfs([], [startRow,startCol], new Set())
    if(solutions.length === 0) return []
    const uniquePath: number[][] = []
    const seen = new Set<string>()
    for(const pathArr of solutions){
      for(const [r,c] of pathArr){
        const key = `${r},${c}`
        if(!seen.has(key)){
          seen.add(key)
          uniquePath.push([r,c])
        }
      }
    }
    setPath(path)
    setPath(solutions[0])
    return uniquePath
  }
  function returnSymbol(num:number[]){
    console.log(num)
    const str = []
    for(let i = 0; i < num.length; i++){
      if(num[i] === 2){
        str.push('🟢')
      } else if(num[i] === 1){
        str.push('🟫')
      } else if (num[i] === 0){
        str.push('⬜')
      }
    }
    return str.join('')
  }
  return (
    <div className='font-mono'>
      <div className='flex justify-center items-center flex-col text-2xl'>
        <h2>Maze Generator and Solver</h2>
      </div>
      <div className='flex justify-center items-center flex-col grid grid-cols-2 p-4'>
        <div className='flex justify-center items-center flex-col p-2'>
          <label htmlFor='rows'>Rows</label>
          <input type='number' value={rows} className='text-center border border-black rounded-lg p-2 w-full' onChange={(e)=>{
            setRows(parseInt(e.target.value))
            setMaze([[0]])
          }} placeholder='Amount of rows' />
        </div>
        <div className='flex justify-center items-center flex-col p-2'>
          <label htmlFor='cols'>Columns</label>
          <input type='number' value={cols} className='text-center border border-black rounded-lg p-2 w-full' onChange={(e)=>{
            setCols(parseInt(e.target.value)) 
            setMaze([[0]])
          }} placeholder='Amount of columns' />
        </div>
        <button className='border border-black rounded-lg p-2 m-4' onClick={()=>{
          if(cols > 0 && rows > 0){
            setGenerated(false)
          const m = generateMaze(cols,rows,[1,0])
          setMaze(m)
          setPath([])
          setGenerated(true)
          setToast({msg:"Generated maze!",ok:true})
          } else {
            setToast({msg:"Row and column values must be greater than 0!",ok:false})
          }
          clearToast()
        }}>Generate maze</button>
        <button className='border border-black rounded-lg p-2 m-4' onClick={()=>{
                const solvedPath = solveMaze(maze,[1,0])
                if(solvedPath && solvedPath.length){
                  const temp = maze.map(r=>r.slice())
                  for(const p of solvedPath){
                    temp[p[0]][p[1]] = 2
                  }
                  setMaze(temp)
                  setToast({msg:"Solved maze!",ok:true})
                  clearToast()
                }
        }}>Solve</button>
      </div>  
      <div className='text-[10px]'>
          {generated === true && (
            <div className='flex justify-center items-center flex-col'>
              {maze.map((val,idx)=>(
                <div key={idx} className='text-center'>
                  {returnSymbol(val)}
                </div>
              ))}
            </div>
          )}
      </div>
      <Github url={'https://github.com/bruzz-bruzz/maze-solver'} />

    </div>
  )
}