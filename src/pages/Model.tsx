import { Button } from "@/components/ui/button";
import { fetchModel } from "@/services/model";
import { useState } from "react";
import { toast } from 'sonner';

export default function ModelIA() {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      toast.error("Por favor selecciona una imagen.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await fetchModel(formData)
      console.log("imagen:" + result);
      toast.success(`Clase: ${result.class}, Confianza: ${result.confidence}`);
      
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <Button onClick={handlePredict}>
          Enviar imagen
        </Button>
      </div>
    </>
  );
}
