import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';

export default function Profile() {
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const checkData = () => {
      const { email } = JSON.parse(localStorage.getItem('user'));
      setUserEmail(email);
    };
    checkData();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('mealsToken');
    localStorage.removeItem('cocktailsToken');
    localStorage.removeItem('doneRecipes');
    localStorage.removeItem('favoriteRecipes');
    localStorage.removeItem('inProgressRecipes');
    history.push('/');
  };

  return (
    <div>
      <Header />
      <div>
        <p data-testid="profile-email">{ userEmail }</p>
        <button
          type="button"
          onClick={ () => history.push('/done-recipes') }
          data-testid="profile-done-btn"
        >
          Done Recipes
        </button>
        <button
          type="button"
          onClick={ () => history.push('/favorite-recipes') }
          data-testid="profile-favorite-btn"
        >
          Favorite Recipes
        </button>
        <button
          type="button"
          onClick={ logout }
          data-testid="profile-logout-btn"
        >
          Logout
        </button>
      </div>
      <LesserMenu />
    </div>
  );
}
