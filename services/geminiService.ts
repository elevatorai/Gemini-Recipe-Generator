import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    calories: { type: Type.STRING, description: 'Estimated calories per serving, e.g., "450 kcal".' },
    protein: { type: Type.STRING, description: 'Estimated protein per serving, e.g., "30g".' },
    carbs: { type: Type.STRING, description: 'Estimated carbohydrates per serving, e.g., "25g".' },
    fat: { type: Type.STRING, description: 'Estimated fat per serving, e.g., "15g".' },
  },
  required: ['calories', 'protein', 'carbs', 'fat']
};

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: 'The name of the recipe.' },
    description: { type: Type.STRING, description: 'A short, appetizing description of the dish.' },
    prepTime: { type: Type.STRING, description: 'Preparation time, e.g., "15 minutes".' },
    cookTime: { type: Type.STRING, description: 'Cooking time, e.g., "30 minutes".' },
    servings: { type: Type.STRING, description: 'Number of servings, e.g., "4 servings".' },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of all required ingredients with quantities.'
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Step-by-step cooking instructions.'
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Optional helpful tips for preparing the dish.'
    },
    nutrition: {
      ...nutritionSchema,
      description: 'Estimated nutritional information per serving.'
    }
  },
  required: ['recipeName', 'description', 'prepTime', 'cookTime', 'servings', 'ingredients', 'instructions', 'nutrition']
};


export const generateRecipe = async (ingredients: string[], diet: string, cuisine: string): Promise<Recipe> => {
  let prompt = `You are a creative chef. Create a delicious recipe using primarily the following ingredients: ${ingredients.join(', ')}.`;

  if (diet) {
    prompt += ` The recipe must adhere to a ${diet} diet.`;
  }
  if (cuisine) {
    prompt += ` The recipe should be in the style of ${cuisine} cuisine.`;
  }

  prompt += ' Be creative and feel free to include common pantry staples like oil, salt, pepper, and spices if needed to complete the recipe. Provide an estimated nutritional breakdown (calories, protein, carbs, fat) per serving. Return the recipe in a structured format.';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const recipeData = JSON.parse(jsonText) as Recipe;
    return recipeData;

  } catch (error) {
    console.error("Error generating recipe from Gemini API:", error);
    throw new Error("Failed to generate recipe. Please check your API key and network connection.");
  }
};

export const generateRecipeImage = async (recipeName: string, description: string): Promise<string> => {
    const prompt = `A delicious and beautiful professional food photography shot of "${recipeName}". ${description}. The image should be vibrant, appetizing, and well-lit, styled for a modern cookbook cover.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API did not return any images.");
        }

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating image from Gemini API:", error);
        throw new Error("Failed to generate recipe image.");
    }
};
