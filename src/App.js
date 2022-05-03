import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Provider from './provider';
import Login from './pages/Login';
import Main from './pages/Main';
import Explore from './pages/Explore';
import ExploreFood from './pages/ExploreFood';
import ExploreDrink from './pages/ExploreDrink';
import ExploreIngredients from './pages/ExploreIngredients';
import Profile from './pages/Profile';
import DoneRecipe from './pages/DoneRecipe';
import FavoritesRecipes from './pages/FavoritesRecipes';
import Details from './pages/Details';
import ExploreNationalities from './pages/ExploreNationalities';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route exact path="/foods" component={ Main } />
          <Route exact path="/drinks" component={ Main } />
          <Route exact path="/explore" component={ Explore } />
          <Route exact path="/foods/:id" component={ Details } />
          <Route exact path="/drinks/:id" component={ Details } />
          <Route exact path="/explore/foods" component={ ExploreFood } />
          <Route exact path="/explore/drinks" component={ ExploreDrink } />
          <Route
            exact
            path="/explore/foods/ingredients"
            component={ ExploreIngredients }
          />
          <Route
            exact
            path="/explore/drinks/ingredients"
            component={ ExploreIngredients }
          />
          <Route
            exact
            path="/explore/foods/nationalities"
            component={ ExploreNationalities }
          />
          <Route exact path="/profile" component={ Profile } />
          <Route exact path="/done-recipes" component={ DoneRecipe } />
          <Route exact path="/favorite-recipes" component={ FavoritesRecipes } />
          <Route path="" component={ NotFound } />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
