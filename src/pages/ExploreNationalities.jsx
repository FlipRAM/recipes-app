import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import MyContext from '../context/MyContext';
import { fetchApi } from '../provider';
import styles from './css/ExploreNationalities.module.css';

function ExploreNationalities() {
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [render, setRender] = useState(false);
  const { recipes, setRecipes } = useContext(MyContext);
  const TWELVE = 12;
  useEffect(() => {
    const getCategories = async () => {
      const arrCategories = await fetchApi('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      setCategories(arrCategories.meals);
    };
    if (categories.length === 0 && render === false) {
      getCategories();
    }
    const getCards = async () => {
      let arrRecipes = [];
      if (selectedCategorie === 'all') {
        arrRecipes = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      } else {
        arrRecipes = await fetchApi(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedCategorie}`,
        );
      }
      setRecipes({ ...arrRecipes, drinks: [] });
    };
    if (render === false && selectedCategorie.length > 2) {
      getCards();
      setRender(true);
    }
    if (currentFilter !== selectedCategorie) {
      getCards();
      setCurrentFilter(selectedCategorie);
    }
  }, [categories, selectedCategorie, recipes, render]);
  return (
    <div className={ styles.main }>
      <Header />
      <div className={ styles.wrapper }>

        <select
          className={ styles.select }
          data-testid="explore-by-nationality-dropdown"
          onChange={ ({ target }) => setSelectedCategorie(target.value) }
          name="area"
          id="area"
        >
          <option
            className={ styles.option }
            data-testid="All-option"
            value="all"
          >
            All
          </option>
          {categories.map((obj) => (
            <option
              className={ styles.option }
              data-testid={ `${obj.strArea}-option` }
              key={ obj.strArea }
              value={ obj.strArea }
            >
              {obj.strArea}
            </option>))}
        </select>
        {render === true && recipes.meals.slice(0, TWELVE).map((obj, index) => (
          <a
            className={ styles.link }
            key={ obj.idMeal }
            href={ `http://localhost:3000/foods/${obj.idMeal}` }
          >
            <div
              className={ styles.eachCard }
              data-testid={ `${index}-recipe-card` }
            >
              <p
                className={ styles.name }
                data-testid={ `${index}-card-name` }
              >
                { obj.strMeal }
              </p>
              <img
                className={ styles.recipePhoto }
                data-testid={ `${index}-card-img` }
                src={ obj.strMealThumb }
                alt={ obj.idMeal }
              />
            </div>
          </a>
        ))}
      </div>
      <LesserMenu />
    </div>
  );
}

export default ExploreNationalities;
