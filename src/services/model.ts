import { apiModel } from "./api";

export const fetchModel = async(formData: FormData) => {
  const response = await fetch(apiModel,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Error al predecir.");
  }

  const result = await response.json();
  return result
};
