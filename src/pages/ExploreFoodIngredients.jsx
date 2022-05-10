import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';
import styles from './css/ExploreIngredient.module.css';

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
    <div className={ styles.main }>
      <Header />
      <div className={ styles.wrapper }>
        { ingredients && ingredients.map((element, index) => {
          const maxLength = 12;
          if (index < maxLength) {
            return (
              <Link
                className={ styles.link }
                key={ index }
                to={ { pathname: '/foods' } }
                onClick={ () => setIngredientFilter(element.strIngredient) }
              >
                <div
                  className={ styles.eachIngredient }
                  data-testid={ `${index}-ingredient-card` }
                >
                  <img
                    className={ styles.recipePhoto }
                    src={ `https://www.themealdb.com/images/ingredients/${element.strIngredient}-Small.png` }
                    alt={ element.strIngredient }
                    data-testid={ `${index}-card-img` }
                  />
                  <p
                    className={ styles.name }
                    data-testid={ `${index}-card-name` }
                  >
                    { element.strIngredient }
                  </p>
                </div>
              </Link>
            );
          }
          return null;
        })}
      </div>
      <LesserMenu />
    </div>
  );
}
