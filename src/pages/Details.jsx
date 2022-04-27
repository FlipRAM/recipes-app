import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MyContext from '../context/MyContext';

export default function Details() {
  const [render, setRender] = useState(false);
  const { recipes } = useContext(MyContext);

  const history = useHistory();

  useEffect(() => {
    if (recipes.meals || recipes.drinks) {
      setRender(true);
    }
  }, [recipes]);

  const meal = () => {
    const arrRecipes = recipes.meals[0];
    // O slice é para que o MAP pare quando tiver no Index 11 ou seja o 12 elemento.
    return (
      <div>
        <img
          src={ arrRecipes.strMealThumb }
          alt={ arrRecipes.strMeal }
        />
        <p>
          {arrRecipes.strMeal}
        </p>
      </div>
    );
  };

  const drink = () => {
    const arrRecipes = recipes.drinks[0];
    // O slice é para que o MAP pare quando tiver no Index 11 ou seja o 12 elemento.
    return (
      <div>
        <img
          src={ arrRecipes.strDrinkThumb }
          alt={ arrRecipes.strDrink }
        />
        <p>
          {arrRecipes.strDrink}
        </p>
      </div>
    );
  };

  const renderRecipe = () => {
    if (history.location.pathname.includes('/foods')) {
      return meal();
    }
    if (history.location.pathname.includes('/drinks')) {
      return drink();
    }
  };

  return (
    <div>
      {render && renderRecipe() }
    </div>
  );
}
