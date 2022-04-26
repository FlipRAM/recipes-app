import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';

function Header() {
  const [isSearchOnScreen, setIsSearchOnScreen] = useState(false);
  const history = useHistory();

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
      <button onClick={ toProfile } data-testid="profile-top-btn" type="button">
        <img src={ profileIcon } alt="profileIcon" />
      </button>
      <h1 data-testid="page-title">Foods</h1>
      <button onClick={ showSearchBar } data-testid="search-top-btn" type="button">
        <img src={ searchIcon } alt="searchIcon" />
      </button>
      {isSearchOnScreen && <SearchBar />}
    </header>
  );
}

export default Header;
