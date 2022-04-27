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

  const renderCards = () => {
    let arrRecipes = [];
    const twelve = 12;
    if (history.location.pathname === '/foods' && recipes.meals !== null) {
      arrRecipes = recipes.meals;
      // O slice é para que o MAP pare quando tiver no Index 11 ou seja o 12 elemento.
      const arrCards = arrRecipes.slice(0, twelve).map((e, i) => (
        <div key={ i } data-testid={ `${i}-recipe-card` }>
          <img
            data-testid={ `${i}-card-img` }
            src={ e.strMealThumb }
            alt={ e.strMeal }
          />
          <p
            data-testid={ `${i}-card-name` }
          >
            {e.strMeal}
          </p>
        </div>
      ));
      return arrCards;
    }
    if (history.location.pathname === '/drinks' && recipes.drinks !== null) {
      arrRecipes = recipes.drinks;
      // O slice é para que o MAP pare quando tiver no Index 11 ou seja o 12 elemento.
      const arrCards = arrRecipes.slice(0, twelve).map((e, i) => (
        <div key={ i } data-testid={ `${i}-recipe-card` }>
          <img
            data-testid={ `${i}-card-img` }
            src={ e.strDrinkThumb }
            alt={ e.strDrink }
          />
          <p
            data-testid={ `${i}-card-name` }
          >
            {e.strDrink}
          </p>
        </div>
      ));
      return arrCards;
    }
  };
  return (
    <div>
      {render && renderCards() }
    </div>
  );
}
