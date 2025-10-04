
import React from 'react';
import type { Recipe } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onView: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({ isOpen, onClose, recipes, onView, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-recipes-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="saved-recipes-title" className="text-2xl font-serif text-slate-700">My Saved Recipes</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {recipes.length === 0 ? (
            <p className="text-slate-500 text-center py-8">You haven't saved any recipes yet.</p>
          ) : (
            <ul className="space-y-4">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4 flex-grow min-w-0">
                     {recipe.imageUrl && (
                         <img src={recipe.imageUrl} alt={recipe.recipeName} className="w-16 h-16 rounded-md object-cover flex-shrink-0"/>
                     )}
                     <span className="font-semibold text-slate-800 truncate">{recipe.recipeName}</span>
                   </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button 
                        onClick={() => onView(recipe)}
                        className="text-sm bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-300"
                    >
                        View
                    </button>
                    <button 
                        onClick={() => onDelete(recipe.id!)} 
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                        aria-label={`Delete ${recipe.recipeName}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
         <div className="p-4 border-t border-gray-200 text-right">
            <button onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-all">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
