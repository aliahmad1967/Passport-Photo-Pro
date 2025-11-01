
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePassportPhoto = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `
              Transform this image into a professional passport photo.
              1.  The background must be a solid, neutral, off-white color (like #f0f0f0).
              2.  Ensure the subject is centered in the frame.
              3.  The lighting should be even, with no harsh shadows on the face.
              4.  The subject's expression should be neutral.
              5.  Do not crop the image in a way that removes the top of the head or shoulders. Maintain a standard head-and-shoulders composition.
              6.  Do not add any text, watermarks, or other artifacts. Return only the edited image.
            `,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with Gemini API.");
  }
};
