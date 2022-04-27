import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MyContext from '../context/MyContext';
import { fetchApi } from '../provider';

function Header() {
  const [checkedRadios, setCheckedRadios] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const { recipes, setRecipes } = useContext(MyContext);
  const history = useHistory();

  const getSearchValue = ({ target }) => {
    setSearchValue(target.value);
  };

  const attCheckedRadios = ({ target }) => {
    const { id, checked } = target;
    setCheckedRadios({ ...checkedRadios, [id]: checked });
  };

  const searchInFoods = async () => {
    const {
      ingredientSearchRadio, nameSearchRadio, firstLetterSearchRadio,
    } = checkedRadios;

    if (ingredientSearchRadio === true) {
      const newRecipes = await fetchApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchValue}`);
      setRecipes(newRecipes);
    }
    if (nameSearchRadio === true) {
      const newRecipes = await fetchApi(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
      setRecipes(newRecipes);
    }
    if (firstLetterSearchRadio === true) {
      if (searchValue.length === 1) {
        const newRecipes = await fetchApi(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`,
        );
        setRecipes(newRecipes);
      } else {
        global.alert('Your search must have only 1 (one) character');
      }
    }
  };

  const searchInDrinks = async () => {
    const {
      ingredientSearchRadio, nameSearchRadio, firstLetterSearchRadio,
    } = checkedRadios;

    if (ingredientSearchRadio === true) {
      const newRecipes = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchValue}`);
      setRecipes(newRecipes);
    }
    if (nameSearchRadio === true) {
      const newRecipes = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`);
      setRecipes(newRecipes);
    }
    if (firstLetterSearchRadio === true) {
      if (searchValue.length === 1) {
        const newRecipes = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchValue}`);
        setRecipes(newRecipes);
      } else {
        global.alert('Your search must have only 1 (one) character');
      }
    }
  };

  const makeSearch = async () => {
    if (history.location.pathname === '/foods') {
      await searchInFoods();
    }
    if (history.location.pathname === '/drinks') {
      await searchInDrinks();
    }
  };

  useEffect(() => {
    const goToTheChosenOne = () => {
      if (history.location.pathname === '/foods') {
        const theChosen = recipes.meals[0].idMeal;
        history.push(`${history.location.pathname}/${theChosen}`);
      } else if (history.location.pathname === '/drinks') {
        const theChosen = recipes.drinks[0].idDrink;
        history.push(`${history.location.pathname}/${theChosen}`);
      }
    };
    if (recipes.meals && recipes.meals.length === 1) {
      goToTheChosenOne();
    }
    if (recipes.drinks && recipes.drinks.length === 1) {
      goToTheChosenOne();
    }

    if (recipes.meals === null || recipes.drinks === null) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  }, [recipes]);

  return (
    <div>
      <input
        onChange={ getSearchValue }
        value={ searchValue }
        data-testid="search-input"
        type="text"
        id="search-input"
        placeholder="Search Recipe"
      />
      <label htmlFor="ingredientSearchRadio">
        Ingredient
        <input
          onChange={ attCheckedRadios }
          data-testid="ingredient-search-radio"
          type="radio"
          id="ingredientSearchRadio"
          name="searchRadio"
        />
      </label>
      <label htmlFor="nameSearchRadio">
        Name
        <input
          onChange={ attCheckedRadios }
          data-testid="name-search-radio"
          type="radio"
          id="nameSearchRadio"
          name="searchRadio"
        />
      </label>
      <label htmlFor="firstLetterSearchRadio">
        First Letter
        <input
          onChange={ attCheckedRadios }
          data-testid="first-letter-search-radio"
          type="radio"
          id="firstLetterSearchRadio"
          name="searchRadio"
        />
      </label>
      <button
        onClick={ makeSearch }
        data-testid="exec-search-btn"
        type="button"
      >
        Search
      </button>
    </div>
  );
}

export default Header;
