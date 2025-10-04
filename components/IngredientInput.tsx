
import React, { useState } from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label htmlFor="ingredient-input" className="block text-sm font-medium text-slate-600 mb-2">
        Available Ingredients
      </label>
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-2 flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            <span>{ingredient}</span>
            <button onClick={() => removeIngredient(index)} className="hover:text-red-600">
              <TrashIcon />
            </button>
          </div>
        ))}
        <input
          id="ingredient-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient and press Enter"
          className="flex-grow bg-transparent focus:outline-none p-1"
        />
      </div>
    </div>
  );
};
