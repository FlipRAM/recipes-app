import React from 'react';
import { fetchApi } from '../../provider';
import styles from '../css/Details.module.css';

const SIX = 6;
const FIFTEEN = 15;
const TWENTY = 20;
const FIVE = 5;

export const renderIngredients = (recipe, quantity) => {
  const ingredients = [];
  const arrIngredients = [];
  for (let index = 1; index < quantity + 1; index += 1) {
    const strIngredient = `strIngredient${index}`;
    const strMeasure = `strMeasure${index}`;
    const str = `-${recipe[0][strIngredient]} - ${recipe[0][strMeasure]}`;
    if (str.length > FIVE && str !== '-null - null') {
      ingredients.push(str);
      arrIngredients.push(`${recipe[0][strIngredient]}`);
    }
  }
  if (ingredients.length > 0) {
    const savedIngredients = arrIngredients;
    const ingredientsMaped = ingredients.map((str, index) => (
      <p key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>{str}</p>
    ));
    return { savedIngredients, ingredientsMaped };
  }
};
export const renderRecommended = (arr, type) => {
  let arrRecommended = arr;
  if (arr.length !== null && type === 'meals') {
    arrRecommended = arr.meals;
    return arrRecommended.slice(0, SIX).map((obj, index) => (
      <div
        className={ styles.eachRecommended }
        key={ index }
        data-testid={ `${index}-recomendation-card` }
      >
        <img
          src={ obj.strMealThumb }
          alt={ obj.strMeal }
        />
        <p>{obj.strCategory}</p>
        <hr className={ styles.divisionWhite } />
        <h4 data-testid={ `${index}-recomendation-title` }>{obj.strMeal}</h4>
      </div>
    ));
  }
  if (arr.length !== null && type === 'drinks') {
    arrRecommended = arr.drinks;
    return arrRecommended.slice(0, SIX).map((obj, index) => (
      <div
        className={ styles.eachRecommended }
        key={ index }
        data-testid={ `${index}-recomendation-card` }
      >
        <img
          src={ obj.strDrinkThumb }
          alt={ obj.strDrink }
        />
        <p>{obj.strAlcoholic}</p>
        <hr className={ styles.divisionWhite } />
        <h4 data-testid={ `${index}-recomendation-title` }>{obj.strDrink}</h4>
      </div>
    ));
  }
};
export const searchRecommended = async (type) => {
  const isMeal = {
    true: async () => {
      const response = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      return response;
    },
    false: async () => {
      const response = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      return response;
    },
  };
  const response = await isMeal[type === 'meals']();
  return response;
};
export const extraVerifyAll = (one, two, three) => {
  const testStartOrContinue = {
    true: () => 'Continue Recipe',
    false: () => 'Start Recipe',
  };
  let value1 = 'Finish Recipe';
  if (one === true || one === false) {
    value1 = testStartOrContinue[one]();
  }
  const mealOrDrink = {
    true: () => renderIngredients(three.meals, TWENTY),
    false: () => renderIngredients(three.drinks, FIFTEEN),
  };
  const { ingredientsMaped, savedIngredients } = mealOrDrink[two]();
  const value3 = ingredientsMaped;
  const value4 = savedIngredients;
  let value2 = '';
  if (three.meals.length === 1 || three.drinks.length === 1) {
    const isRecipeMeal = {
      true: async () => {
        const response = await searchRecommended(
          'drinks',
        );
        return response;
      },
      false: async () => {
        const response = await searchRecommended(
          'meals',
        );
        return response;
      },
    };
    value2 = isRecipeMeal[two]();
  }
  const status = {
    value1, value2, value3, value4,
  };
  return status;
};
