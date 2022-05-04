import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import MyContext from '../context/MyContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import {
  favoriteMeal, saveCompleteRecipe, saveRecipeMeal, unfavorite, verifyFavorite,
} from './DetailsExtra/Functions2';
import { extraVerifyAll } from './DetailsExtra/Functions';
import { fetchApi } from '../provider';

const TWENTY = 20;
const FIVE = 5;
const finishRecipe = 'Finish Recipe';
export default function InProgressFood() {
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
    if ((recipes.meals.length === 1) && render === false) {
      extraVerifyAll(
        finishRecipe,
        history.location.pathname.includes('/foods'), recipes, arrChecked,
      );
    }
  }, [arrChecked, arrIngredients]);
  useEffect(() => {
    const attRecipes = async () => {
      const response = await fetchApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipes({ ...response, drinks: [] });
    };
    if (recipes.meals.length === 1 && render === false) {
      verifyStatus();
    }
    if (recipes.meals.length !== 1 && render === false) {
      attRecipes();
    }
    if (arrChecked.includes(false) !== true && isRecipeCompleted === true) {
      setIsRecipeCompleted(false);
    }
    if (arrChecked.includes(false) === true && isRecipeCompleted === false) {
      setIsRecipeCompleted(true);
    }
    console.log('arrIngredients', arrIngredients);
  }, [recipes, render, arrChecked, listIngredients]);
  const favorite = () => {
    const trueOrFalse = {
      true: () => unfavorite(id),
      false: () => favoriteMeal(recipes.meals[0]),
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
    copy(`http://localhost:3000/foods/${id}`);
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
      saveRecipeMeal(recipes.meals[0], arrCopyIngredients);
    }
  };
  const checkChecked = (ingr) => {
    if (localStorage.getItem('inProgressRecipes') !== null) {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes.meals !== null) {
        const arrInProgressRecipes = inProgressRecipes.meals[id];
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
  const renderMeal = () => {
    const arrRecipes = recipes.meals;
    return arrRecipes.map((e, index) => (
      <div key={ index }>
        <img
          className="recipe-photo"
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
          {renderIngredients(recipes.meals, TWENTY)}
        </div>
        <div>
          <h3>Instructions</h3>
          <p data-testid="instructions">{e.strInstructions}</p>
        </div>
      </div>));
  };
  const completeRecipe = () => {
    saveCompleteRecipe(recipes.meals[0]);
    history.push('/done-recipes');
  };
  return (
    <div>
      {render === true && renderMeal()}
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
