import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import MyContext from '../context/MyContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import {
  favoriteDrink, saveCompleteRecipe, saveRecipeDrink, unfavorite, verifyFavorite,
} from './DetailsExtra/Functions2';
import { extraVerifyAll } from './DetailsExtra/Functions';
import { fetchApi } from '../provider';

const FIFTEEN = 15;
const FIVE = 5;
const finishRecipe = 'Finish Recipe';
export default function InProgress() {
  const { recipes, setRecipes } = useContext(MyContext);
  const [render, setRender] = useState(false);
  const [startOrContinue, setStartOrContinue] = useState(finishRecipe);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shared, setShared] = useState(false);
  const [arrChecked, setArrChecked] = useState([]);
  const [listIngredients, setListIngredients] = useState([]);
  const [arrIngredients, setArrIngredients] = useState([]);
  const [isRecipeCompleted, setIsRecipeCompleted] = useState(true);
  const history = useHistory();
  const { id } = useParams();
  const verifyStatus = async () => {
    const status = extraVerifyAll(
      finishRecipe,
      history.location.pathname.includes('/foods'), recipes,
    );
    setIsFavorite(verifyFavorite(id));
    setStartOrContinue(status.value1);
    setArrChecked(status.value3.map(() => false));
    setListIngredients(status.value4);
    setRender(true);
  };
  useEffect(() => {
    if ((recipes.drinks.length === 1) && render === false) {
      extraVerifyAll(
        finishRecipe,
        history.location.pathname.includes('/foods'), recipes, arrChecked,
      );
    }
  }, [arrChecked, arrIngredients]);
  useEffect(() => {
    const attRecipes = async () => {
      const response = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipes({ ...response, meals: [] });
    };
    if (recipes.drinks.length === 1 && render === false) {
      verifyStatus();
    }
    if (recipes.drinks.length !== 1 && render === false) {
      attRecipes();
    }
    if (arrChecked.includes(false) === false && isRecipeCompleted === true) {
      setIsRecipeCompleted(false);
    }
    if (arrChecked.includes(false) === true && isRecipeCompleted === false) {
      setIsRecipeCompleted(true);
    }
  }, [recipes, render, arrChecked, listIngredients]);
  const favorite = () => {
    const trueOrFalse = {
      true: () => unfavorite(id),
      false: () => favoriteDrink(recipes.drinks[0]),
    };
    trueOrFalse[isFavorite]();
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
  const btnShare = {
    true: 'Link copied!',
    false: <img src={ shareIcon } alt="shareIcon" />,
  };
  const share = () => {
    copy(`http://localhost:3000/drinks/${id}`);
    setShared(true);
  };
  const findCheckIndex = (index) => {
    if (arrChecked.length > 0) {
      const arrCopy = [...arrChecked];
      let arrCopyIngredients = [...arrIngredients];
      if (arrCopy[index] === false) {
        arrCopy[index] = true;
        arrCopyIngredients.push(listIngredients[index]);
      } else {
        arrCopy[index] = false;
        arrCopyIngredients = arrCopyIngredients.filter(
          (ing) => ing !== listIngredients[index],
        );
      }
      setArrChecked(arrCopy);
      setArrIngredients(arrCopyIngredients);
      saveRecipeDrink(recipes.drinks[0], arrCopyIngredients);
    }
  };
  const checkChecked = (ingr) => {
    if (localStorage.getItem('inProgressRecipes') !== null) {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes.cocktails !== null) {
        const arrInProgressRecipes = inProgressRecipes.cocktails[id];
        const isIn = arrInProgressRecipes.find((e) => e === ingr);
        return isIn;
      }
    }
  };
  const renderIngredients = (recipe, quantity) => {
    const ingredients = [];
    const allIngredients = [];
    for (let index = 1; index < quantity + 1; index += 1) {
      const strIngredient = `strIngredient${index}`;
      const strMeasure = `strMeasure${index}`;
      const str = `-${recipe[0][strIngredient]} - ${recipe[0][strMeasure]}`;
      if (str.length > FIVE && str !== '-null - null') {
        ingredients.push(str);
        allIngredients.push(`${recipe[0][strIngredient]}`);
      }
    }
    if (ingredients.length > 0) {
      const ingredientsCheck = ingredients.map((str, index) => (
        <div key={ index } data-testid={ `${index}-ingredient-step` }>
          <input
            type="checkbox"
            checked={ checkChecked(allIngredients[index]) }
            onChange={ () => findCheckIndex(index) }
          />
          <p
            className={ (arrChecked[index] === true
              || checkChecked(allIngredients[index])) && 'risked' }
          >
            {str}
          </p>
        </div>
      ));
      return ingredientsCheck;
    }
  };
  const renderDrink = () => {
    const arrRecipes = recipes.drinks;
    return arrRecipes.map((e, i) => (
      <div key={ i }>
        <img
          className="recipe-photo"
          data-testid="recipe-photo"
          src={ e.strDrinkThumb }
          alt={ e.strDrink }
        />
        <div>
          <h1 data-testid="recipe-title">{e.strDrink}</h1>
          <p data-testid="recipe-category">{e.strAlcoholic}</p>
          <button onClick={ share } data-testid="share-btn" type="button">
            { btnShare[shared] }
          </button>
          {returnFavoriteButton()}
        </div>
        <div>
          <h3>Ingredients</h3>
          {renderIngredients(recipes.drinks, FIFTEEN)}
        </div>
        <div>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
      </div>));
  };
  const completeRecipe = () => {
    saveCompleteRecipe(recipes.drinks[0]);
    history.push('/done-recipes');
  };
  return (
    <div>
      {render === true && renderDrink()}
      <button
        data-testid="finish-recipe-btn"
        type="submit"
        className="footer"
        onClick={ completeRecipe }
        disabled={ isRecipeCompleted }
      >
        {startOrContinue}
      </button>
    </div>
  );
}
