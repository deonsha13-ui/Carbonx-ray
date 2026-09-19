import { GoogleGenAI } from "@google/genai";
import { AppUsageItem, InvoiceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeScreenTime = async (base64Image: string): Promise<{ apps: AppUsageItem[] }> => {
  try {
    const prompt = `Analyze this screen time screenshot. Extract all app names, their categories, and time spent.

Categories: AI Queries (ChatGPT, Claude, Gemini, etc.) | 4K Streaming (Netflix, YouTube, Disney+, etc.) | Social Media (Instagram, TikTok, Facebook, etc.) | Gaming | Video Calls (Zoom, Teams, FaceTime, etc.) | Other

Return only JSON: {"apps": [{"name": "App Name", "category": "Category", "hours": 0, "minutes": 0}]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Screen Time Error:", error);
    throw error;
  }
};

export const analyzeInvoice = async (base64Image: string): Promise<InvoiceData> => {
  try {
    const prompt = `Analyze this GST invoice or purchase order. Extract all materials/items with quantities and weights.

Return only JSON (no markdown):
{
  "materials": [{"name": "Material name", "weight": 0, "origin": "City, Country"}],
  "supplier": "Company name",
  "invoiceNumber": "Invoice number",  
  "date": "Invoice date"
}

Material types to look for: Steel, Iron, Cement, Aluminum, Copper, Plastic, Glass, Wood, Paper.
If weight is not explicitly stated in kg, estimate it based on quantity and standard industrial weights. Ensure "weight" is a number representing kg.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Invoice Error:", error);
    throw error;
  }
};