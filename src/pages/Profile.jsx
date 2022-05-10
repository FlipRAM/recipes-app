import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import styles from './css/Profile.module.css';

export default function Profile() {
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const checkData = () => {
      if (localStorage.getItem('user') !== null) {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserEmail(user.email);
      }
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
    <div className={ styles.main }>
      <Header />
      <div className={ styles.profileWrapper }>
        <p className={ styles.email } data-testid="profile-email">{ userEmail }</p>
        <hr className={ styles.division } />
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/done-recipes') }
          data-testid="profile-done-btn"
        >
          Done Recipes
        </button>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/favorite-recipes') }
          data-testid="profile-favorite-btn"
        >
          Favorite Recipes
        </button>
        <button
          className={ styles.btns }
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
