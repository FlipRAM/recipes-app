import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';

function Header() {
  const [isSearchOnScreen, setIsSearchOnScreen] = useState(false);
  const history = useHistory();

  const { location: { pathname } } = history;

  const title = {
    '/foods': 'Foods',
    '/drinks': 'Drinks',
    '/explore': 'Explore',
    '/explore/foods': 'Explore Foods',
    '/explore/drinks': 'Explore Drinks',
    '/explore/foods/ingredients': 'Explore Ingredients',
    '/explore/drinks/ingredients': 'Explore Ingredients',
    '/explore/foods/nationalities': 'Explore Nationalities',
    '/done-recipes': 'Done Recipes',
    '/favorite-recipes': 'Favorite Recipes',
    '/profile': 'Profile',
  };

  const toProfile = () => {
    history.push('/profile');
  };

  const showSearchBar = () => {
    if (isSearchOnScreen === false) {
      setIsSearchOnScreen(true);
    } else {
      setIsSearchOnScreen(false);
    }
  };

  return (
    <header>
      <button
        onClick={ toProfile }
        data-testid="profile-top-btn"
        type="button"
        src={ profileIcon }
      >
        <img src={ profileIcon } alt="profileIcon" />
      </button>
      <h1
        data-testid="page-title"
      >
        {title[pathname]}
      </h1>
      {(
        (!pathname.includes('explore')
        && !pathname.includes('profile')
        && !pathname.includes('recipes'))
        || pathname === '/explore/foods/nationalities'
      )
        && (
          <button
            onClick={ showSearchBar }
            data-testid="search-top-btn"
            type="button"
            src={ searchIcon }
          >
            <img src={ searchIcon } alt="searchIcon" />
          </button>)}
      {isSearchOnScreen && <SearchBar />}
    </header>
  );
}

export default Header;
