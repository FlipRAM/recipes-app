import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';
import styles from './css/Explore.module.css';

export default function ExploreDrink() {
  const { setRecipes } = useContext(MyContext);
  const history = useHistory();

  const generateRandomDrink = async () => {
    const { drinks } = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').then((response) => response.json());
    setRecipes((state) => ({
      ...state,
      drinks: drinks[0],
    }));
    history.push(`/drinks/${drinks[0].idDrink}`);
  };

  return (
    <div className={ styles.main }>
      <Header />
      <div className={ styles.btnsFilter }>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/explore/drinks/ingredients') }
          data-testid="explore-by-ingredient"
        >
          By Ingredient
        </button>
        <button
          className={ styles.btns }
          type="button"
          onClick={ generateRandomDrink }
          data-testid="explore-surprise"
        >
          Surprise me!
        </button>
      </div>
      <LesserMenu />
    </div>
  );
}
