import { useState } from "react";
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setModelResult(null);
      setWikiData(null);
    }
  };

  const fetchWikiData = async (disease: string) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${disease}`);
      const data = await response.json();
      setWikiData({
        title: data.title,
        description: data.description,
        extract: data.extract,
        thumbnail: data.thumbnail
      });
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      toast.error("Por favor selecciona una imagen.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await fetchModel(formData);
      setModelResult(result);
      await fetchWikiData(result.class);
      toast.success("Análisis completado");
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Diagnóstico de Enfermedades de la Piel</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full max-w-md"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Vista previa"
                className="max-w-md max-h-64 object-contain rounded-lg"
              />
            )}
            <Button 
              onClick={handlePredict}
              disabled={!image || loading}
              className="w-full max-w-md"
            >
              {loading ? "Analizando..." : "Analizar Imagen"}
            </Button>
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