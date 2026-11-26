import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/user-slice';
import { AppRoute } from '../../const';

function LoginPage() : JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authError } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  };

  const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (trimmedEmail && trimmedPassword) {
      const doLogin = async () => {
        const resultAction = await dispatch(login({ email: trimmedEmail, password: trimmedPassword }));
        if (login.fulfilled.match(resultAction)) {
          navigate(AppRoute.Main);
        }
      };

      void doLogin();
    }
  };

  return (
    <div className="page page--gray page--login">
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            {authError && <p className="login__error">{authError}</p>}
            <form className="login__form form" action="#" method="post" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  pattern="^(?=.*[a-zA-Z])(?=.*\d).+$"
                  title="Пароль должен содержать хотя бы одну букву и одну цифру"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
