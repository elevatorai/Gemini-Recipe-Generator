import React from 'react';

interface OptionsPanelProps {
  diet: string;
  setDiet: (diet: string) => void;
  cuisine: string;
  setCuisine: (cuisine: string) => void;
  shouldGenerateImage: boolean;
  setShouldGenerateImage: (value: boolean) => void;
}

const dietOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'];
const cuisineOptions = ['None', 'Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Japanese', 'Mediterranean'];

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ diet, setDiet, cuisine, setCuisine, shouldGenerateImage, setShouldGenerateImage }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="diet-select" className="block text-sm font-medium text-slate-600 mb-2">
          Dietary Preference
        </label>
        <select
          id="diet-select"
          value={diet}
          onChange={(e) => setDiet(e.target.value === 'None' ? '' : e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {dietOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="cuisine-select" className="block text-sm font-medium text-slate-600 mb-2">
          Cuisine Style
        </label>
        <select
          id="cuisine-select"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value === 'None' ? '' : e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {cuisineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="generate-image-checkbox" className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
          <input
            id="generate-image-checkbox"
            type="checkbox"
            checked={shouldGenerateImage}
            onChange={(e) => setShouldGenerateImage(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span>Generate Recipe Image</span>
        </label>
      </div>
    </div>
  );
};
