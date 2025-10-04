
import React from 'react';
import type { Recipe } from '../types';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface RecipeDisplayProps {
  recipe: Recipe;
  imageUrl: string | null;
  onSave: () => void;
  isSaved: boolean;
}

const InfoPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center bg-green-100/70 p-3 rounded-lg">
        <p className="text-sm text-green-700 font-medium">{label}</p>
        <p className="text-lg text-slate-800 font-semibold">{value}</p>
    </div>
);


export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, imageUrl, onSave, isSaved }) => {
  return (
    <div className="animate-fade-in">
      {imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={imageUrl} 
            alt={`A delicious photo of ${recipe.recipeName}`} 
            className="w-full h-auto max-h-80 object-cover" 
          />
        </div>
      )}

      <div className="flex justify-between items-start gap-4 mb-2">
        <h2 className="text-4xl font-serif text-slate-800 flex-grow">{recipe.recipeName}</h2>
        <button 
          onClick={onSave}
          disabled={isSaved}
          className="flex-shrink-0 flex items-center gap-2 bg-white border border-green-600 text-green-700 font-bold py-2 px-4 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 disabled:cursor-not-allowed"
        >
          <BookmarkIcon className={isSaved ? 'fill-current' : ''} />
          {isSaved ? 'Saved' : 'Save Recipe'}
        </button>
      </div>
      
      <p className="text-slate-600 mb-6">{recipe.description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <InfoPill label="Prep Time" value={recipe.prepTime} />
        <InfoPill label="Cook Time" value={recipe.cookTime} />
        <InfoPill label="Servings" value={recipe.servings} />
      </div>

      {recipe.nutrition && (
        <div className="mb-8">
            <h3 className="text-2xl font-serif text-slate-700 mb-4 border-b-2 border-green-200 pb-2">Nutrition Facts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-blue-100/60 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">Calories</p>
                    <p className="text-lg text-slate-800 font-semibold">{recipe.nutrition.calories}</p>
                </div>
                <div className="text-center bg-purple-100/60 p-3 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">Protein</p>
                    <p className="text-lg text-slate-800 font-semibold">{recipe.nutrition.protein}</p>
                </div>
                <div className="text-center bg-orange-100/60 p-3 rounded-lg">
                    <p className="text-sm text-orange-700 font-medium">Carbs</p>
                    <p className="text-lg text-slate-800 font-semibold">{recipe.nutrition.carbs}</p>
                </div>
                <div className="text-center bg-red-100/60 p-3 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">Fat</p>
                    <p className="text-lg text-slate-800 font-semibold">{recipe.nutrition.fat}</p>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-serif text-slate-700 mb-4 border-b-2 border-green-200 pb-2">Ingredients</h3>
          <ul className="space-y-2 list-disc list-inside text-slate-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-serif text-slate-700 mb-4 border-b-2 border-green-200 pb-2">Instructions</h3>
          <ol className="space-y-3 list-decimal list-inside text-slate-700">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-8">
            <h3 className="text-2xl font-serif text-slate-700 mb-4 border-b-2 border-green-200 pb-2">Chef's Tips</h3>
            <ul className="space-y-2 list-disc list-inside text-slate-700">
                {recipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};
