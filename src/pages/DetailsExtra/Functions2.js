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
    const isMeal = {
      true: () => inProgressRecipes.meals[id],
      false: () => inProgressRecipes.cocktails[id],
    };
    if (isMeal[pathname.includes('/foods')]()) {
      return true;
    }
  }
  return false;
};
export const favoriteMeat = (recipe) => {
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
export const saveMeal = (recipe) => {
  let newRecipe = {
    cocktails: {

    },
    meals: {
      [recipe.idMeal]: [recipe.ingredients],
    },
  };
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (inProgressRecipes !== null) {
    newRecipe = {
      cocktails: {
        ...inProgressRecipes.cocktails,
      },
      meals: {
        ...inProgressRecipes.meals,
        ...newRecipe.meals,
      },
    };
  }
  localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipe));
};
export const saveDrink = (recipe) => {
  let newRecipe = {
    cocktails: {
      [recipe.idDrink]: [recipe.ingredients],
    },
    meals: {

    },
  };
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (inProgressRecipes !== null) {
    newRecipe = {
      cocktails: {
        ...inProgressRecipes.cocktails,
        ...newRecipe.cocktails,
      },
      meals: {
        ...inProgressRecipes.meals,
      },
    };
  }
  localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipe));
};
