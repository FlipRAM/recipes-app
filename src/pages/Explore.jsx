import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LesserMenu from '../components/LesserMenu';

export default function Explore() {
  const history = useHistory();

  return (
    <div>
      <Header />
      <div>
        <button
          type="button"
          onClick={ () => history.push('/explore/foods') }
          data-testid="explore-foods"
        >
          Explore Foods
        </button>
        <button
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
