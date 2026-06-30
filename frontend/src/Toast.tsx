import './App.css'
type Data = {
    msg:string,
    ok:boolean
}
export default function Toast({msg,ok}:Data){
    return (
        <div className={`rounded-lg p-4 absolute right-5 bottom-5 font-mono ${ok === true ? 'bg-green-500' : 'bg-red-500'}`}>
            <p>{msg}</p>
        </div>
    )
}