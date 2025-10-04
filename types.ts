
export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id?: string;
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  imageUrl?: string | null;
  nutrition?: NutritionInfo;
}
