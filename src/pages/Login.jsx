import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';

export default function Login({ history }) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [isBtnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    const { email, password } = data;
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    const passwordMinLength = 6;
    if (emailRegex.test(email) && password.length > passwordMinLength) {
      setBtnDisabled(false);
    } if (!emailRegex.test(email) || password.length <= passwordMinLength) {
      setBtnDisabled(true);
    }
  }, [data]);

  function handleChange({ target: { name, value } }) {
    setData((state) => ({ ...state, [name]: value }));
  }

  function saveToken() {
    const { email } = data;
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/foods');
  }

  return (
    <div>
      <form>
        <input
          type="email"
          name="email"
          data-testid="email-input"
          value={ data.email }
          onChange={ handleChange }
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          data-testid="password-input"
          value={ data.password }
          onChange={ handleChange }
          placeholder="Senha"
        />
        <button
          type="button"
          data-testid="login-submit-btn"
          disabled={ isBtnDisabled }
          onClick={ saveToken }
        >
          Enter
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  history: propTypes.shape,
}.isRequired;
