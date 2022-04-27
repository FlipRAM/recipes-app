import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';

export default function Provider({ children }) {
  const [recipes, setRecipes] = useState({ meals: [], drinks: [] });
  const context = {
    recipes,
    setRecipes,
  };

  return (
    <MyContext.Provider value={ context }>
      {children}
    </MyContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

const fetchApi = async (url) => {
  const response = await fetch(url);
  const data = response.json();
  return data;
};

export { fetchApi };
