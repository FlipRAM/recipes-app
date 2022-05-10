import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';
import styles from './css/Explore.module.css';

export default function Explore() {
  const history = useHistory();

  return (
    <div className={ styles.main }>
      <Header />
      <div className={ styles.btnsFilter }>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/explore/foods') }
          data-testid="explore-foods"
        >
          Explore Foods
        </button>
        <button
          className={ styles.btns }
          type="button"
          onClick={ () => history.push('/explore/drinks') }
          data-testid="explore-drinks"
        >
          Explore Drinks
        </button>
      </div>
      <LesserMenu />
    </div>
  );
}
