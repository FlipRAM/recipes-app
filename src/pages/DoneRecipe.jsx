import React, { useState, useEffect } from 'react';
import copy from 'clipboard-copy';
import { useHistory, Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';

export default function DoneRecipe() {
  const [doneRecipes, setdoneRecipes] = useState([]);
  const [shared, setShared] = useState(false);
  const [filter, setFilter] = useState('');
  const history = useHistory();

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem('doneRecipes'));
    setdoneRecipes(recipes);
    console.log(history);
  }, []);

  const btnShare = {
    true: 'Link copied!',
    false: <img src={ shareIcon } alt="shareIcon" />,
  };
  const share = (foodOrDrink, id) => {
    copy(`http://localhost:3000/${foodOrDrink}/${id}`);
    setShared(true);
  };

  return (
    <div>
      <Header />
      <button
        type="button"
        data-testid="filter-by-all-btn"
        onClick={ () => setFilter('') }
      >
        All
      </button>
      <button
        type="button"
        data-testid="filter-by-food-btn"
        onClick={ () => setFilter('food') }
      >
        Food
      </button>
      <button
        type="button"
        data-testid="filter-by-drink-btn"
        onClick={ () => setFilter('drink') }
      >
        Drinks
      </button>
      {
        doneRecipes.filter((e) => e.type.includes(filter)).map((element, index) => {
          console.log(element);
          // const index = i - 1;
          if (element.type === 'food') {
            return (
              <div key={ index } id={ index }>
                <Link to={ { pathname: `/foods/${element.id}` } }>
                  <img
                    className="recipe-photo"
                    src={ element.image }
                    alt={ element.name }
                    data-testid={ `${index}-horizontal-image` }
                  />
                </Link>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  { `${element.nationality} - ${element.category}`}
                </p>
                <Link to={ { pathname: `/foods/${element.id}` } }>
                  <p data-testid={ `${index}-horizontal-name` }>{ element.name }</p>
                </Link>
                <p data-testid={ `${index}-horizontal-done-date` }>
                  { element.doneDate }
                </p>
                <button
                  src={ shareIcon }
                  onClick={ () => share('foods', element.id) }
                  data-testid={ `${index}-horizontal-share-btn` }
                  type="button"
                >
                  { btnShare[shared] }
                </button>
                { element.tags.map((element1, index1) => {
                  if (index1 < 2) {
                    return (
                      <p data-testid={ `${index}-${element1}-horizontal-tag` }>
                        { element1 }
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }
          if (element.type === 'drink') {
            return (
              <div key={ index } id={ index }>
                <Link to={ { pathname: `/drinks/${element.id}` } }>
                  <img
                    className="recipe-photo"
                    src={ element.image }
                    alt={ element.name }
                    data-testid={ `${index}-horizontal-image` }
                  />
                </Link>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${element.category} ${element.alcoholicOrNot}`}
                </p>
                <Link to={ { pathname: `/drinks/${element.id}` } }>
                  <p data-testid={ `${index}-horizontal-name` }>{ element.name }</p>
                </Link>
                <p data-testid={ `${index}-horizontal-done-date` }>
                  { element.doneDate }
                </p>
                <p>{ element.nationality }</p>
                <button
                  src={ shareIcon }
                  onClick={ () => share('drinks', element.id) }
                  data-testid={ `${index}-horizontal-share-btn` }
                  type="button"
                >
                  { btnShare[shared] }
                </button>
                {/* <p data-testid={ `${index}-${tagName}-horizontal-tag` }>
                  { element.tags }
                </p> */}
              </div>
            );
          }
          return null;
        })
      }
    </div>
  );
}
