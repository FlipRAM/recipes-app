/* eslint-disable */
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
  verifyFavorite, verifyCompleteRate,
  verifyStartOrContinue, favoriteMeal, favoriteDrink,
  unfavorite, saveRecipeDrink, saveRecipeMeal,
} from './DetailsExtra/Functions2';
import { fetchApi } from '../provider';
import styles from './css/Details.module.css';

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
      isDrinks[history.location.pathname.includes('/drinks')]();
    };
    if ((recipes.meals.length === 1 || recipes.drinks.length === 1) && render === false) {
      verifyStatus();
    }
    if ((recipes.meals.length !== 1 && recipes.drinks.length !== 1) && render === false) {
      attRecipes();
    }
  }, [recipes, ingredientsMaped, arrRecommended]);
  const favoriteAndUnfavoriteMeal = () => {
    const trueOrFalse = {
      true: () => unfavorite(id),
      false: () => favoriteMeal(recipes.meals[0]),
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
      true: () => favoriteAndUnfavoriteMeal(),
      false: () => favoriteAndUnfavoriteDrink(),
    };
    trueOrFalse[history.location.pathname.includes('/foods')]();
    verifyStatus();
  };
  const returnFavoriteButton = () => {
    const trueOrFalse = {
      true: (
        <button
          className={ styles.btnFavorite }
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
          className={ styles.btnFavorite }
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
      <div className={ styles.recipesContainer } key={ index }>
        <img
          className={ styles.recipePhoto }
          data-testid="recipe-photo"
          src={ e.strMealThumb }
          alt={ e.strMeal }
        />
        <div className={ styles.details }>
          <h1 data-testid="recipe-title">{e.strMeal}</h1>
          <hr className={ styles.division } />
          <p className={ styles.category } data-testid="recipe-category">{e.strCategory}</p>
          <div className={ styles.shareAndLike }>
            <button className={ styles.btnShare } onClick={ share } data-testid="share-btn" type="button">
              { btnShare[shared] }
            </button>
            {returnFavoriteButton()}
          </div>
        </div>
        <div className={ styles.ingredients }>
          <h3>Ingredients</h3>
          {ingredientsMaped}
        </div>
        <div className={ styles.instructions }>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
        <div className={ styles.video }>
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
        <div className={ styles.recommended }>
          <h3>Recommended</h3>
          <div className={ styles.carousel }>
            {renderRecommended(arrRecommended, 'drinks')}
          </div>
        </div>
      </div>));
  };
  const renderDrink = () => {
    const arrRecipes = recipes.drinks;
    return arrRecipes.map((e, i) => (
      <div className={ styles.recipesContainer } key={ i }>
        <img
          className={ styles.recipePhoto }
          data-testid="recipe-photo"
          src={ e.strDrinkThumb }
          alt={ e.strDrink }
        />
        <div className={ styles.details }>
          <h1 data-testid="recipe-title">{e.strDrink}</h1>
          <hr className={ styles.division } />
          <p className={ styles.category } data-testid="recipe-category">{e.strAlcoholic}</p>
          <div className={ styles.shareAndLike }>
            <button className={ styles.btnShare } onClick={ share } data-testid="share-btn" type="button">
              { btnShare[shared] }
            </button>
            {returnFavoriteButton()}
          </div>
        </div>
        <div className={ styles.ingredients }>
          <h3>Ingredients</h3>
          {ingredientsMaped}
        </div>
        <div className={ styles.instructions }>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
        <div className={ styles.recommended }>
          <h3>Recommended</h3>
          <div className={ styles.carousel }>
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
      true: () => saveRecipeMeal(recipes.meals[0], []),
      false: () => saveRecipeDrink(recipes.drinks[0], []),
    };
    if (startOrContinue === 'Start Recipe') {
      isMeal[history.location.pathname.includes('/foods')]();
    }
    history.push(`${history.location.pathname}/in-progress`);
  };
  return (
    <div className={ styles.main }>
      {render && renderRecipe() }
      {finishedRecipe ? '' : (
        <button
          data-testid="start-recipe-btn"
          type="submit"
          className={ styles.footer }
          onClick={ startResumeRecipe }
        >
          {startOrContinue}
        </button>
      )}
    </div>
  );
}
