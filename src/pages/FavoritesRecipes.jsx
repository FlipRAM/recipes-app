import React, { useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { unfavorite } from './DetailsExtra/Functions2';

export default function FavoritesRecipes() {
  const [shared, setShared] = useState(false);
  const [filter, setFilter] = useState({ all: 'on', food: 'off', drinks: 'off' });
  const [favorites, setFavorites] = useState([]);
  const [reload, setReload] = useState(false);
  const [render, setRender] = useState(false);
  useEffect(() => {
    const arrFavorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (arrFavorites && arrFavorites.length > 0 && render === false) {
      setFavorites(arrFavorites);
      setRender(true);
    }
    if (arrFavorites === null && render === true) {
      setFavorites([]);
      setRender(false);
    }
    if (arrFavorites && arrFavorites.length !== favorites.length && render === true) {
      setFavorites(arrFavorites);
    }
    if (reload === true) {
      setReload(false);
    }
  }, [favorites, filter, reload]);
  const btnShare = {
    true: 'Link copied!',
    false: <img src={ shareIcon } alt="shareIcon" />,
  };
  const share = (id, type) => {
    const urlFoods = `http://localhost:3000/foods/${id}`;
    const urlDrinks = `http://localhost:3000/drinks/${id}`;
    const url = type === 'food' ? urlFoods : urlDrinks;
    copy(url);
    setShared(true);
  };
  const unfavoriteAndReload = (id) => {
    unfavorite(id);
    setReload(true);
  };
  const redirectToDetails = (id, type) => {
    const urlFoods = `http://localhost:3000/foods/${id}`;
    const urlDrinks = `http://localhost:3000/drinks/${id}`;
    const url = type === 'food' ? urlFoods : urlDrinks;
    return url;
  };
  const renderAll = () => {
    const favoritesFoods = favorites.filter((obj) => obj.type === 'food');
    const favoritesDrink = favorites.filter((obj) => obj.type === 'drink');
    let renderFavorites = favorites;
    if (filter.all === 'off') {
      renderFavorites = filter.food === 'on' ? favoritesFoods : favoritesDrink;
    }
    return renderFavorites.map((obj, index) => (
      <div key={ obj.id }>
        <a href={ redirectToDetails(obj.id, obj.type) }>
          <img
            className="recipe-photo"
            data-testid={ `${index}-horizontal-image` }
            src={ obj.image }
            alt={ obj.name }
          />
        </a>
        <p
          data-testid={ `${index}-horizontal-top-text` }
        >
          {obj.alcoholicOrNot || (`${obj.nationality} - ${obj.category}`)}
        </p>
        <a href={ redirectToDetails(obj.id, obj.type) }>
          <p
            data-testid={ `${index}-horizontal-name` }
          >
            { obj.name }

          </p>
        </a>
        <button
          data-testid={ `${index}-horizontal-share-btn` }
          onClick={ () => share(obj.id, obj.type) }
          src={ shareIcon }
          type="button"
        >
          { btnShare[shared] }
        </button>
        <button
          onClick={ () => unfavoriteAndReload(obj.id) }
          type="button"
          src={ blackHeartIcon }
        >
          <img
            data-testid={ `${index}-horizontal-favorite-btn` }
            src={ blackHeartIcon }
            alt="blackHeartIcon"
          />
        </button>
      </div>
    ));
  };
  return (
    <div>
      <Header />
      <div>
        <button
          data-testid="filter-by-all-btn"
          type="button"
          onClick={ () => setFilter({ all: 'on', food: 'off', drinks: 'off' }) }
        >
          All

        </button>
        <button
          data-testid="filter-by-food-btn"
          type="button"
          onClick={ () => setFilter({ all: 'off', food: 'on', drinks: 'off' }) }
        >
          Food
        </button>
        <button
          data-testid="filter-by-drink-btn"
          type="button"
          onClick={ () => setFilter({ all: 'off', food: 'off', drinks: 'on' }) }
        >
          Drinks

        </button>
      </div>
      {render === true && renderAll()}
    </div>
  );
}
