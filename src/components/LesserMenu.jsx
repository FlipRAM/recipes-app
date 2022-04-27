import React from 'react';
import propTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import exploreIcon from '../images/exploreIcon.svg';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

export default function LesserMenu() {
  const history = useHistory();
  return (
    <footer data-testid="footer">
      <button
        onClick={ () => history.push('/drinks') }
        data-testid="drinks-bottom-btn"
        type="button"
        src={ drinkIcon }
      >
        <img src={ drinkIcon } alt="drink icon" />
      </button>
      <button
        onClick={ () => history.push('/explore') }
        data-testid="explore-bottom-btn"
        type="button"
        src={ exploreIcon }
      >
        <img src={ exploreIcon } alt="explore icon" />
      </button>
      <button
        onClick={ () => history.push('/foods') }
        data-testid="food-bottom-btn"
        type="button"
        src={ mealIcon }
      >
        <img src={ mealIcon } alt="meal icon" />
      </button>
    </footer>
  );
}

LesserMenu.propTypes = {
  history: propTypes.shape,
}.isRequired;
