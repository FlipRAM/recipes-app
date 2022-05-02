import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import MyContext from '../context/MyContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import {
  extraVerifyAll, renderRecommended,
} from './DetailsExtra/Functions';
import {
  verifyFavorite,
  verifyCompleteRate,
  verifyStartOrContinue,
  favoriteMeat,
  favoriteDrink,
  unfavorite,
  saveMeal,
  saveDrink,
} from './DetailsExtra/Functions2';
import { fetchApi } from '../provider';

export default function Details() {
  const { recipes, setRecipes } = useContext(MyContext);
  const [render, setRender] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [startOrContinue, setStartOrContinue] = useState('Start Recipe');
  const [finishedRecipe, setFinishedRecipe] = useState(false);
  const [shared, setShared] = useState(false);
  const [arrRecommended, setArrRecommended] = useState([]);
  const [ingredientsMaped, setIngredientsMaped] = useState([]);
  const history = useHistory();
  const { id } = useParams();
  const ELEVEN = 11;
  const verifyStatus = async () => {
    const status = extraVerifyAll(
      verifyStartOrContinue(id, history.location.pathname),
      history.location.pathname.includes('/foods'), recipes,
    );
    setIsFavorite(verifyFavorite(id));
    setFinishedRecipe(verifyCompleteRate(id));
    setStartOrContinue(status.value1);
    setArrRecommended(await status.value2);
    setIngredientsMaped(status.value3);
    setRender(true);
  };
  useEffect(() => {
    const attRecipes = async () => {
      const isMeal = {
        true: async () => {
          const response = await fetchApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          return response;
        },
        false: async () => {
          const response = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
          return response;
        },
      };
      const result = await isMeal[history.location.pathname.includes('/foods')]();
      const isDrinks = {
        true: () => setRecipes({ ...result, meals: [] }),
        false: () => setRecipes({ ...result, drinks: [] }),
      };
      if (result) {
        isDrinks[history.location.pathname.includes('/drinks')]();
      }
    };
    if ((recipes.meals.length === 1 || recipes.drinks.length === 1) && render === false) {
      verifyStatus();
    }
    if ((recipes.meals.length !== 1 && recipes.drinks.length !== 1) && render === false) {
      attRecipes();
    }
  }, [recipes, ingredientsMaped, arrRecommended]);
  const favoriteAndUnfavoriteMeat = () => {
    const trueOrFalse = {
      true: () => unfavorite(id),
      false: () => favoriteMeat(recipes.meals[0]),
    };
    return trueOrFalse[isFavorite]();
  };
  const favoriteAndUnfavoriteDrink = () => {
    const trueOrFalse = {
      true: () => unfavorite(id),
      false: () => favoriteDrink(recipes.drinks[0]),
    };
    return trueOrFalse[isFavorite]();
  };
  const favorite = () => {
    const trueOrFalse = {
      true: () => favoriteAndUnfavoriteMeat(),
      false: () => favoriteAndUnfavoriteDrink(),
    };
    trueOrFalse[history.location.pathname.includes('/foods')]();
    verifyStatus();
  };
  const returnFavoriteButton = () => {
    const trueOrFalse = {
      true: (
        <button
          onClick={ favorite }
          data-testid="favorite-btn"
          type="button"
          src={ blackHeartIcon }
        >
          <img src={ blackHeartIcon } alt="blackHeartIcon" />
        </button>
      ),
      false: (
        <button
          onClick={ favorite }
          data-testid="favorite-btn"
          type="button"
          src={ whiteHeartIcon }
        >
          <img src={ whiteHeartIcon } alt="whiteHeartIcon" />
        </button>
      ),
    };
    return trueOrFalse[isFavorite];
  };
  const youtubeParser = () => {
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    const url = recipes.meals[0].strYoutube;
    const regExp = (
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
    const match = url.match(regExp);
    const result = (match && match[7].length === ELEVEN) ? match[7] : false;
    return `http://www.youtube.com/embed/${result}`;
  };
  const btnShare = {
    true: 'Link copied!',
    false: <img src={ shareIcon } alt="shareIcon" />,
  };
  const share = () => {
    copy(`http://localhost:3000${history.location.pathname}`);
    setShared(true);
  };
  const renderMeal = () => {
    const arrRecipes = recipes.meals;
    return arrRecipes.map((e, index) => (
      <div key={ index }>
        <img
          data-testid="recipe-photo"
          src={ e.strMealThumb }
          alt={ e.strMeal }
        />
        <div>
          <h1 data-testid="recipe-title">{e.strMeal}</h1>
          <p data-testid="recipe-category">{e.strCategory}</p>
          <button onClick={ share } data-testid="share-btn" type="button">
            { btnShare[shared] }
          </button>
          {returnFavoriteButton()}
        </div>
        <div>
          <h3>Ingredients</h3>
          {ingredientsMaped}
        </div>
        <div>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
        <div>
          <h3>Video</h3>
          <iframe
            data-testid="video"
            width="310"
            height="315"
            src={ youtubeParser() }
            title="video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        <div>
          <h3>Recommended</h3>
          <div id="carousel">
            {renderRecommended(arrRecommended, 'drinks')}
          </div>
        </div>
      </div>));
  };
  const renderDrink = () => {
    const arrRecipes = recipes.drinks;
    return arrRecipes.map((e, i) => (
      <div key={ i }>
        <img
          data-testid="recipe-photo"
          src={ e.strDrinkThumb }
          alt={ e.strDrink }
        />
        <div>
          <h1 data-testid="recipe-title">
            {e.strDrink}
          </h1>
          <p data-testid="recipe-category">{e.strAlcoholic}</p>
          <button onClick={ share } data-testid="share-btn" type="button">
            { btnShare[shared] }
          </button>
          {returnFavoriteButton()}
        </div>
        <div>
          <h3>Ingredients</h3>
          {ingredientsMaped}
        </div>
        <div>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
        <div>
          <h3>Recommended</h3>
          <div id="carousel">
            {renderRecommended(arrRecommended, 'meals')}
          </div>
        </div>
      </div>));
  };
  const renderRecipe = () => {
    const trueOrFalse = {
      true: () => renderMeal(),
      false: () => renderDrink(),
    };
    return trueOrFalse[history.location.pathname.includes('/foods')]();
  };
  const startResumeRecipe = () => {
    const isMeal = {
      true: () => saveMeal(recipes.meals[0]),
      false: () => saveDrink(recipes.drinks[0]),
    };
    isMeal[history.location.pathname.includes('/foods')]();
    history.push(`${history.location.pathname}/in-progress`);
  };
  return (
    <div>
      {render && renderRecipe() }
      {finishedRecipe ? '' : (
        <button
          data-testid="start-recipe-btn"
          type="submit"
          className="footer"
          onClick={ startResumeRecipe }
        >
          {startOrContinue}
        </button>
      )}
    </div>
  );
}
