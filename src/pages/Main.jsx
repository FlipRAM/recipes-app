import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';

function Main() {
  const {
    recipes, setRecipes, path, setPath, ingredientFilter, setIngredientFilter,
  } = useContext(MyContext);
  const [buttonsCategory, setButtonsCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState('');
  const history = useHistory();
  const { location: { pathname } } = history;
  const basicEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

  const getEach = async (endpoint) => {
    const maxLength = 12;
    if (endpoint === 'https://www.themealdb.com/api/json/v1/1/search.php?s=') {
      const listFood = [];
      const { meals } = await fetch(endpoint).then((response) => response.json());
      meals.forEach((element, index) => {
        if (index < maxLength) {
          listFood.push(element);
        }
      });
      return listFood;
    } if (endpoint === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=') {
      const listDrinks = [];
      const { drinks } = await fetch(endpoint).then((response) => response.json());
      drinks.forEach((element, index) => {
        if (index < maxLength) {
          listDrinks.push(element);
        }
      });
      return listDrinks;
    }
  };

  const getEachCategory = async (endpoint) => {
    const maxLength = 5;
    if (endpoint === 'https://www.themealdb.com/api/json/v1/1/list.php?c=list') {
      const listButtonsFood = [];
      const { meals } = await fetch(endpoint).then((response) => response.json());
      meals.forEach((element, index) => {
        if (index < maxLength) {
          listButtonsFood.push(element.strCategory);
        }
      });
      return listButtonsFood;
    } if (endpoint === basicEndpoint) {
      const listButtonsDrinks = [];
      const { drinks } = await fetch(endpoint).then((response) => response.json());
      drinks.forEach((element, index) => {
        if (index < maxLength) {
          listButtonsDrinks.push(element.strCategory);
        }
      });
      return listButtonsDrinks;
    }
  };

  const pushDrinks = async (arg, end) => {
    const listDrinkEnd = [];
    const maxLen = 12;
    let newEndpoint = end;
    if (arg) {
      newEndpoint = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientFilter}`;
    }
    const { drinks } = await fetch(newEndpoint).then((response) => response.json());
    drinks.forEach((element, index) => {
      if (index < maxLen) { listDrinkEnd.push(element); }
    });
    return listDrinkEnd;
  };

  const getSelected = async (endpoint) => {
    const maxLengthSelected = 12;
    if (endpoint.includes('www.themealdb.com/api/json/v1/1/filter.php?c=')) {
      const listCategoryFood = [];
      const { meals } = await fetch(endpoint).then((response) => response.json());
      meals.forEach((element, index) => {
        if (index < maxLengthSelected) {
          listCategoryFood.push(element);
        }
      });
      return listCategoryFood;
    } if (endpoint.includes('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=')) {
      const listCategoryDrink = pushDrinks(ingredientFilter !== '', endpoint);
      return listCategoryDrink;
    }
  };

  useEffect(() => {
    if (ingredientFilter !== '') { setCategorySelected(ingredientFilter); }
    if (pathname !== path) {
      setCategorySelected('');
      setPath(pathname);
    }
  });

  useEffect(() => {
    if (path === '/foods') {
      const getCategoriesFood = async () => {
        const urlButtons = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
        const buttons = await getEachCategory(urlButtons);
        setButtonsCategory(buttons);
      };
      getCategoriesFood();
      const getFood = async () => {
        if (categorySelected !== '') {
          const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorySelected}`;
          const categoryFood = await getSelected(url);
          setRecipes((state) => ({ ...state, meals: categoryFood }));
        } if (categorySelected === '') {
          const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
          const meals = await getEach(url);
          setRecipes((state) => ({ ...state, meals }));
        }
      };
      getFood();
    } if (path === '/drinks') {
      const getCategoriesDrink = async () => {
        const urlButtons = basicEndpoint;
        const buttons = await getEachCategory(urlButtons);
        setButtonsCategory(buttons);
      };
      getCategoriesDrink();
      const getDrink = async () => {
        if (categorySelected !== '') {
          const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categorySelected}`;
          const categoryDrink = await getSelected(url);
          setRecipes((state) => ({ ...state, drinks: categoryDrink }));
        } if (categorySelected === '') {
          const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
          const drinks = await getEach(url);
          setRecipes((state) => ({ ...state, drinks }));
        }
      };
      getDrink();
    }
  }, [path, categorySelected]);

  const handleSelected = ({ target: { value } }) => {
    setCategorySelected(value);
    if (ingredientFilter !== '') { setIngredientFilter(''); }
  };

  const checkIfEqual = ({ target: { value } }) => {
    if (value === categorySelected) { setCategorySelected(''); }
  };

  const renderButtonsCategories = () => {
    const list = buttonsCategory;
    return (
      <div>
        {list.map((strCategory, index) => (
          <label key={ index } htmlFor={ strCategory }>
            <input
              type="radio"
              name="category"
              value={ strCategory }
              id={ strCategory }
              checked={ categorySelected === strCategory }
              data-testid={ `${strCategory}-category-filter` }
              onChange={ handleSelected }
              onClick={ checkIfEqual }
            />
            {strCategory}
          </label>
        ))}
        <label htmlFor="all">
          <input
            type="radio"
            name="category"
            value=""
            id="all"
            checked={ categorySelected === '' }
            data-testid="All-category-filter"
            onChange={ handleSelected }
          />
          All
        </label>
      </div>
    );
  };

  const renderCards = () => {
    const maxLength = 12;
    if (path === '/foods' && recipes.meals !== null) {
      const arrMeals = recipes.meals;
      const arrCards = arrMeals.map((e, i) => {
        if (i < maxLength) {
          return (
            <Link key={ i } to={ { pathname: `/foods/${e.idMeal}` } }>
              <div data-testid={ `${i}-recipe-card` }>
                <img
                  data-testid={ `${i}-card-img` }
                  src={ e.strMealThumb }
                  alt={ e.strMeal }
                />
                <p data-testid={ `${i}-card-name` }>
                  {e.strMeal}
                </p>
              </div>
            </Link>
          );
        }
        return null;
      });
      return arrCards;
    } if (path === '/drinks' && recipes.drinks !== null) {
      const arrDrinks = recipes.drinks;
      const arrCards = arrDrinks.map((e, i) => {
        if (i < maxLength) {
          return (
            <Link key={ i } to={ { pathname: `/drinks/${e.idDrink}` } }>
              <div data-testid={ `${i}-recipe-card` }>
                <img
                  data-testid={ `${i}-card-img` }
                  src={ e.strDrinkThumb }
                  alt={ e.strDrink }
                />
                <p
                  data-testid={ `${i}-card-name` }
                >
                  {e.strDrink}
                </p>
              </div>
            </Link>
          );
        }
        return null;
      });
      return arrCards;
    }
  };

  return (
    <div>
      <Header />
      { renderButtonsCategories() }
      { renderCards() }
      <LesserMenu />
    </div>
  );
}

export default Main;
