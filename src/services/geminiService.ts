// Asegúrate de haber ejecutado: npm install @google/generative-ai
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, SafetySetting } from '@google/generative-ai';
import { type SolutionResult } from '../types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("La variable de entorno GEMINI_API_KEY no está configurada. Por favor, agrégala a tu archivo .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig: GenerationConfig = {
  temperature: 0.2,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8192,
  // Forzar la salida en formato JSON para mayor estabilidad
  response_mime_type: "application/json",
};

const safetySettings: SafetySetting[] = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const systemInstruction = `Eres un experto matemático de clase mundial especializado en resolver ecuaciones diferenciales.
Tu tarea es recibir una ecuación en formato de texto y devolver una solución paso a paso en un formato JSON estructurado.
La salida JSON DEBE seguir esta estructura exacta:
{
  "finalSolution": "Una cadena de texto con la solución final en formato LaTeX. Ejemplo: 'y(x) =\\frac{1}{2}e^x + C e^{-x}'",
  "explanation": "Una breve explicación de una frase sobre la solución final.",
  "steps": [
    {
      "title": "Un título corto para el paso. Ejemplo: 'Identificar el tipo de ecuación'",
      "description": "Una explicación detallada de lo que se está haciendo en este paso.",
      "math": "La operación matemática para este paso, en formato LaTeX. Ejemplo: '\\int P(x) dx = \\int 1 dx = x'"
    }
  ]
}
No incluyas ningún texto, markdown o formato fuera del objeto JSON principal. La respuesta completa debe ser un único objeto JSON válido.
Resuelve la siguiente ecuación:`;

// --- ¡Este es el lugar para cambiar el modelo! ---
// 'gemini-1.5-flash-latest' es un modelo rápido y gratuito.
// También puedes usar 'gemini-1.0-pro' o modelos más potentes como 'gemini-1.5-pro-latest'.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // Cambia el modelo aqu
  generationConfig,
  safetySettings,
  systemInstruction, // <-- Aquí se asigna la instrucción del sistema correctamente
});

export async function solveEquation(equation: string): Promise<SolutionResult> {
  if (!equation) throw new Error("La ecuación no puede estar vacía.");

  // Usar startChat es a menudo más robusto para conversaciones con instrucciones de sistema.
  const chat = model.startChat({
    history: [],
  });

  const result = await chat.sendMessage(equation);
  const response = result.response;
  const responseText = response.text();
  
  try {
    // El modelo está configurado para devolver JSON, por lo que esto debería ser seguro.
    return JSON.parse(responseText) as SolutionResult;
  } catch (e) {
    console.error("Error al analizar la respuesta de Gemini como JSON:", responseText);
    throw new Error("El modelo no devolvió una respuesta JSON válida. Inténtalo de nuevo.");
  }
}