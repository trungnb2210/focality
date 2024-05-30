import React, { ReactNode, createContext, useContext, useState } from 'react';

interface SharedIngredient {
    ingredients: string[];
    addIngredients: (ingredient: string) => void;
}

interface SharedStateProviderProps {
    children: ReactNode;
  }

export const IngredientContext = createContext<SharedIngredient | undefined>(undefined);

export const SharedIngredientProvider: React.FC<SharedStateProviderProps> = ( {children} ) => {
    const [ingredients, setIngredients] = useState<string[]>([]);

    const addIngredients = (ingredient: string) => {
      setIngredients([...ingredients, ingredient]);
    };

    return (
      <IngredientContext.Provider value={{ ingredients, addIngredients }}>
        {children}
      </IngredientContext.Provider>
    );
  };

  export const useSharedIngredient = () => {
    const context = useContext(IngredientContext);
    if (!context) {
      throw new Error('useSharedState must be used within a SharedStateProvider');
    }
    return context;
  };