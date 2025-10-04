
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface HeaderProps {
    onShowSavedRecipes: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowSavedRecipes }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHatIcon />
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 font-serif">
            Gemini Recipe Generator
          </h1>
        </div>
        <button 
            onClick={onShowSavedRecipes}
            className="flex items-center gap-2 bg-white border border-green-600 text-green-700 font-bold py-2 px-4 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
            <BookmarkIcon />
            <span className="hidden md:inline">Saved Recipes</span>
        </button>
      </div>
    </header>
  );
};
