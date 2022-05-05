import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';

export default function ExploreFoodIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const { setIngredientFilter } = useContext(MyContext);

  useEffect(() => {
    const getIngredients = async () => {
      const { meals } = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list').then((response) => response.json());
      setIngredients(meals);
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
              to={ { pathname: '/foods' } }
              onClick={ () => setIngredientFilter(element.strIngredient) }
            >
              <div data-testid={ `${index}-ingredient-card` }>
                <img
                  src={ `https://www.themealdb.com/images/ingredients/${element.strIngredient}-Small.png` }
                  alt={ element.strIngredient }
                  data-testid={ `${index}-card-img` }
                />
                <p data-testid={ `${index}-card-name` }>{ element.strIngredient }</p>
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
