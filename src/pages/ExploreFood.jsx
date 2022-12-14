import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';
import styles from './css/Explore.module.css';

export default function ExploreFood() {
  const { setRecipes } = useContext(MyContext);
  const history = useHistory();

  const generateRandomFood = async () => {
    const { meals } = await fetch('https://www.themealdb.com/api/json/v1/1/random.php').then((response) => response.json());
    setRecipes((state) => ({
      ...state,
      meals: meals[0],
    }));
    history.push(`/foods/${meals[0].idMeal}`);
  };

  return (
    <div className={ styles.main }>
      <Header />
      <div className={ styles.btnsFilter }>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/explore/foods/ingredients') }
          data-testid="explore-by-ingredient"
        >
          By Ingredient
        </button>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/explore/foods/nationalities') }
          data-testid="explore-by-nationality"
        >
          By Nationality
        </button>
        <button
          className={ styles.btns }
          type="button"
          onClick={ generateRandomFood }
          data-testid="explore-surprise"
        >
          Surprise me!
        </button>
      </div>
      <LesserMenu />
    </div>
  );
}
