import { GoogleGenerativeAI } from "@google/generative-ai";
import  intro  from './prompts/introduccion.txt?raw'
import  restricciones  from './prompts/restricciones.txt?raw'
import  funcionalidades  from './prompts/funcionalidades.txt?raw'
import  enfermedadesDetalle  from './prompts/enfermedades_detalle.txt?raw'

const key = import.meta.env.VITE_GEMINI_KEY;

const ai = new GoogleGenerativeAI(key);
const initialHistory = [
  {
    role: "user",
    parts: [
      {
        text: `${intro}\n\n${restricciones}\n\n${funcionalidades}`,
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: intro,
      },
    ],
  },
];

export async function main(message: any) {
  const chat = ai.getGenerativeModel({ model: "gemini-2.0-flash" }).startChat({
    history: initialHistory,
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

// Nueva función para obtener información detallada sobre enfermedades
export async function getDiseaseDetails(diseaseName: string) {
  const chat = ai.getGenerativeModel({ model: "gemini-2.0-flash" }).startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: enfermedadesDetalle,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Entendido. Soy un asistente médico especializado en dermatología. Proporcionaré información detallada y estructurada sobre enfermedades de la piel cuando me indiques el nombre de la enfermedad.",
          },
        ],
      },
    ],
  });

  const prompt = `Proporciona información detallada sobre la enfermedad: ${diseaseName}`;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}

