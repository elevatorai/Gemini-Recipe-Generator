
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { OptionsPanel } from './components/OptionsPanel';
import { RecipeDisplay } from './components/RecipeDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateRecipe, generateRecipeImage } from './services/geminiService';
import type { Recipe } from './types';
import { SavedRecipesModal } from './components/SavedRecipesModal';

const SAVED_RECIPES_KEY = 'gemini-recipes';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['3 chicken breasts', '1 cup rice', '1 broccoli head']);
  const [diet, setDiet] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldGenerateImage, setShouldGenerateImage] = useState<boolean>(true);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isSavedRecipesModalOpen, setIsSavedRecipesModalOpen] = useState(false);

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(SAVED_RECIPES_KEY);
      if (storedRecipes) {
        setSavedRecipes(JSON.parse(storedRecipes));
      }
    } catch (e) {
      console.error("Failed to load recipes from local storage", e);
    }
  }, []);

  const isCurrentRecipeSaved = useMemo(() => {
    if (!recipe) return false;
    return savedRecipes.some(saved => saved.recipeName === recipe.recipeName);
  }, [recipe, savedRecipes]);

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeImage(null);

    try {
      setLoadingMessage('Crafting your recipe...');
      const generatedRecipe = await generateRecipe(ingredients, diet, cuisine);
      setRecipe(generatedRecipe);

      if (shouldGenerateImage) {
        setLoadingMessage('Generating a delicious image...');
        const imageUrl = await generateRecipeImage(generatedRecipe.recipeName, generatedRecipe.description);
        setRecipeImage(imageUrl);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSaveRecipe = () => {
    if (!recipe || isCurrentRecipeSaved) return;

    const recipeToSave: Recipe = {
      ...recipe,
      id: `${recipe.recipeName}-${Date.now()}`,
      imageUrl: recipeImage,
    };

    const updatedRecipes = [...savedRecipes, recipeToSave];
    setSavedRecipes(updatedRecipes);
    try {
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    } catch (e) {
      console.error("Failed to save recipes to local storage", e);
      setError("Could not save recipe. Your browser's storage might be full.");
    }
  };

  const handleDeleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updatedRecipes);
    try {
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    } catch (e) {
      console.error("Failed to update recipes in local storage", e);
    }
  };

  const handleViewSavedRecipe = (savedRecipe: Recipe) => {
    setRecipe(savedRecipe);
    setRecipeImage(savedRecipe.imageUrl || null);
    setIsSavedRecipesModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-green-50/50 text-slate-800">
      <Header onShowSavedRecipes={() => setIsSavedRecipesModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Your Kitchen</h2>
            <div className="space-y-6">
              <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
              <OptionsPanel 
                diet={diet} 
                setDiet={setDiet} 
                cuisine={cuisine} 
                setCuisine={setCuisine}
                shouldGenerateImage={shouldGenerateImage}
                setShouldGenerateImage={setShouldGenerateImage}
              />
              <button
                onClick={handleGenerateRecipe}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate Recipe
                  </>
                )}
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>

          {/* Recipe Display */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 min-h-[600px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner size="lg" />
                <p className="text-lg text-slate-500 mt-4">{loadingMessage || 'Getting things ready...'}</p>
              </div>
            )}
            {!isLoading && !recipe && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img src="https://picsum.photos/seed/recipe/400/300" alt="Food placeholder" className="rounded-lg mb-6 shadow-md" />
                <h2 className="text-3xl font-serif text-slate-700 mb-2">Ready for a culinary adventure?</h2>
                <p className="text-slate-500 max-w-md">
                  Add your ingredients, select your preferences, and let our AI chef create a unique recipe just for you.
                </p>
              </div>
            )}
            {recipe && <RecipeDisplay recipe={recipe} imageUrl={recipeImage} onSave={handleSaveRecipe} isSaved={isCurrentRecipeSaved} />}
          </div>
        </div>
      </main>
      <SavedRecipesModal
        isOpen={isSavedRecipesModalOpen}
        onClose={() => setIsSavedRecipesModalOpen(false)}
        recipes={savedRecipes}
        onView={handleViewSavedRecipe}
        onDelete={handleDeleteRecipe}
      />
    </div>
  );
};

export default App;
