import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';

export default function ExploreDrinkIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const { setIngredientFilter } = useContext(MyContext);

  useEffect(() => {
    const getIngredients = async () => {
      const { drinks } = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list').then((response) => response.json());
      setIngredients(drinks);
    };
    getIngredients();
  }, []);

  return (
    <div>
      <Header />
      { ingredients && ingredients.map((element, index) => {
        const maxLength = 12;
        if (index < maxLength) {
          return (
            <Link
              key={ index }
              to={ { pathname: '/drinks' } }
              onClick={ () => setIngredientFilter(element.strIngredient1) }
            >
              <div key={ index } data-testid={ `${index}-ingredient-card` }>
                <img
                  src={ `https://www.thecocktaildb.com/images/ingredients/${element.strIngredient1}-Small.png` }
                  alt={ element.strIngredient }
                  data-testid={ `${index}-card-img` }
                />
                <p data-testid={ `${index}-card-name` }>{ element.strIngredient1 }</p>
              </div>
            </Link>
          );
        }
        return null;
      })}
      <LesserMenu />
    </div>
  );
}
