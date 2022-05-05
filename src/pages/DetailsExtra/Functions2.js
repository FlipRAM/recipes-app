export const verifyFavorite = (id) => {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes !== null) {
    return favoriteRecipes.some((e) => e.id === id);
  }
  return false;
};
export const verifyCompleteRate = (id) => {
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  if (doneRecipes !== null) {
    return doneRecipes.some((e) => e.id === id);
  }
  return false;
};
export const verifyStartOrContinue = (id, pathname) => {
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (inProgressRecipes !== null) {
    const { meals, cocktails } = inProgressRecipes;
    const isMeal = {
      true: () => Object.keys(meals).includes(id),
      false: () => Object.keys(cocktails).includes(id),
    };
    return isMeal[pathname.includes('/foods')]();
  }
  return false;
};
export const favoriteMeal = (recipe) => {
  let arrFavorites = [{
    id: recipe.idMeal,
    type: 'food',
    nationality: recipe.strArea || '',
    category: recipe.strCategory || '',
    alcoholicOrNot: '',
    name: recipe.strMeal,
    image: recipe.strMealThumb,
  }];
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes !== null) {
    arrFavorites = [...favoriteRecipes, {
      id: recipe.idMeal,
      type: 'food',
      nationality: recipe.strArea || '',
      category: recipe.strCategory || '',
      alcoholicOrNot: '',
      name: recipe.strMeal,
      image: recipe.strMealThumb,
    }];
  }
  localStorage.setItem('favoriteRecipes', JSON.stringify(arrFavorites));
};
export const favoriteDrink = (recipe) => {
  let arrFavorites = [{
    id: recipe.idDrink,
    type: 'drink',
    nationality: recipe.strArea || '',
    category: recipe.strCategory || '',
    alcoholicOrNot: recipe.strAlcoholic,
    name: recipe.strDrink,
    image: recipe.strDrinkThumb,
  }];
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes !== null) {
    arrFavorites = [...favoriteRecipes, {
      id: recipe.idDrink,
      type: 'drink',
      nationality: recipe.strArea || '',
      category: recipe.strCategory || '',
      alcoholicOrNot: recipe.strAlcoholic,
      name: recipe.strDrink,
      image: recipe.strDrinkThumb,
    }];
  }
  localStorage.setItem('favoriteRecipes', JSON.stringify(arrFavorites));
};
export const saveCompleteRecipe = (recipe) => {
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const arrInProgressRecipes = recipe.idMeal
    ? inProgressRecipes.meals
    : inProgressRecipes.cocktails;
  delete arrInProgressRecipes[recipe.idMeal || recipe.idDrink];
  localStorage.setItem('inProgressRecipes', JSON.stringify(arrInProgressRecipes));
  const today = new Date();
  const date = `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`;
  console.log(recipe);
  let newRecipe = [{
    id: recipe.idMeal || recipe.idDrink,
    type: recipe.idMeal ? 'food' : 'drink',
    nationality: recipe.strArea || '',
    category: recipe.strCategory || '',
    alcoholicOrNot: recipe.strAlcoholic || '',
    name: recipe.strMeal || recipe.strDrink,
    image: recipe.strMealThumb || recipe.strDrinkThumb,
    doneDate: date,
    tags: recipe.strTags && [...recipe.strTags.split(',')],
  }];
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  if (doneRecipes !== null) {
    newRecipe = [...doneRecipes, ...newRecipe];
  }
  localStorage.setItem('doneRecipes', JSON.stringify(newRecipe));
};
export const saveRecipeMeal = (recipe, ingredients) => {
  let newRecipe = {
    cocktails: {},
    meals: {
      [recipe.idMeal]: ingredients,
    },
  };
  const savedRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (savedRecipes !== null) {
    const savedDrinks = savedRecipes.cocktails;
    const savedMeals = savedRecipes.meals;
    newRecipe = {
      meals: { ...savedMeals, [recipe.idMeal]: ingredients },
      cocktails: { ...savedDrinks } };
  }
  localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipe));
};
export const saveRecipeDrink = (recipe, ingredients) => {
  let newRecipe = {
    cocktails: {
      [recipe.idDrink]: ingredients,
    },
    meals: {},
  };
  const savedRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (savedRecipes !== null) {
    const savedDrinks = savedRecipes.cocktails;
    const savedMeals = savedRecipes.meals;
    newRecipe = {
      meals: { ...savedMeals },
      cocktails: { ...savedDrinks, [recipe.idDrink]: ingredients } };
  }
  localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipe));
};
export const unfavorite = (id) => {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes !== null) {
    const arrFavorites = favoriteRecipes.filter((e) => e.id !== id);
    if (arrFavorites.length === 0) {
      // localStorage.removeItem('favoriteRecipes');
      localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify(arrFavorites));
    }
  }
};
