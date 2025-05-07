import { Button } from "./components/ui/button"
import { Toaster, toast } from 'sonner';

export default function App() {

  return (
    <>
      <div className="">
        <Toaster/>
        <Button 
          onClick={() =>{
            toast("Testeando sonner")
          }}
          className="cursor-pointer">Hola
          </Button>
      </div>
    </>
  )
}

