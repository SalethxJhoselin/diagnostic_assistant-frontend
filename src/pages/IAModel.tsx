import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchModel } from "@/services/model";
import { toast } from "sonner";

interface ModelResult {
  class: string;
  confidence: number;
}

interface WikiData {
  title: string;
  description: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

export default function IAModel() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setModelResult(null);
      setWikiData(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setModelResult(null);
        setWikiData(null);
      } else {
        toast.error("Por favor, selecciona una imagen válida");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const fetchWikiData = async (disease: string) => {
    try {
      const response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${disease}`,
        { signal: abortControllerRef.current?.signal }
      );
      const data = await response.json();
      setWikiData({
        title: data.title,
        description: data.description,
        extract: data.extract,
        thumbnail: data.thumbnail
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Consulta a Wikipedia cancelada');
        return;
      }
      console.error("Error fetching Wikipedia data:", error);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      toast.info("Análisis cancelado");
    }
  };

  const handlePredict = async () => {
    if (!image) {
      toast.error("Por favor selecciona una imagen.");
      return;
    }

    setLoading(true);
    abortControllerRef.current = new AbortController();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await fetchModel(formData);
      setModelResult(result);
      await fetchWikiData(result.class);
      toast.success("Análisis completado");
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Análisis cancelado');
        return;
      }
      toast.error("Error al conectar con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleTestPrediction = async () => {
    setLoading(true);
    abortControllerRef.current = new AbortController();
    try {
      const testResult: ModelResult = { //Cambiar  datos para hacer prueba.
        class: "melanoma",
        confidence: 0.9687
      };
      setModelResult(testResult);
      await fetchWikiData(testResult.class);
      toast.success("Prueba completada");
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Prueba cancelada');
        return;
      }
      toast.error("Error al obtener datos de Wikipedia");
      console.error(error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Diagnóstico de Enfermedades de la Piel</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                w-full max-w-md h-48 border-2 border-dashed rounded-lg
                flex flex-col items-center justify-center gap-2
                cursor-pointer transition-colors
                ${previewUrl ? 'border-primary' : 'border-gray-300 hover:border-primary'}
              `}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Haz clic o arrastra una imagen aquí
                  </p>
                  <p className="text-xs text-gray-400">
                    Formatos soportados: JPG, PNG, GIF
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-4 w-full max-w-md">
              <Button 
                onClick={handlePredict}
                disabled={!image || loading}
                className="flex-1"
              >
                {loading ? "Analizando..." : "Analizar Imagen"}
              </Button>
              <Button 
                onClick={handleTestPrediction}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? "Probando..." : "Prueba Manual"}
              </Button>
            </div>
            {loading && (
              <Button 
                onClick={handleCancel}
                variant="destructive"
                className="w-full max-w-md"
              >
                Cancelar Análisis
              </Button>
            )}
          </div>
        </div>
      </Card>

      {modelResult && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados del Análisis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-medium">Enfermedad Detectada:</p>
                <p className="text-lg capitalize">{modelResult.class}</p>
                <p className="font-medium">Nivel de Confianza:</p>
                <p className="text-lg">{(modelResult.confidence * 100).toFixed(2)}%</p>
              </div>
              
              {wikiData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{wikiData.title}</h3>
                  <p className="text-sm text-gray-600">{wikiData.description}</p>
                  <p>{wikiData.extract}</p>
                  {wikiData.thumbnail && (
                    <img
                      src={wikiData.thumbnail.source}
                      alt={wikiData.title}
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}