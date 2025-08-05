import React, { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';
import { showError } from '../utils/toast';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
   const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const rememberMe = (form.elements.namedItem('remember') as HTMLInputElement).checked;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      
      showError(t('login-enter-email'));
      setIsLoading(false);
      return;
    }

    if (!password) {
      showError(t('login-enter-password'));
      setIsLoading(false);
      return;
    }

    try {
      await login({ email, password, rememberMe });
    } catch (err) {
  
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="logo-row">
        <img src={Logo} alt="Logo" draggable={false} />
        <span className="logo-text">FixRoute</span>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>{t('login-welcome')}</h1>
            <h2></h2>
          </div>
          <form noValidate onSubmit={handleSubmit}>
            <input type="email" placeholder={t('login-email')} name="email" required />
            <input type="password" placeholder={t('login-password')} name="password" required />

            <div className="options">
              <div className="checkbox-wrapper">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">{t('login-remember-me')}</label>
              </div>
              <a href="/forgot-password">{t('login-forgot-password')}</a>
            </div>

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loader-button-wrapper">
                  <Loader size={20} color="#fff" thickness={3} />
                </div>
              ) : (
                t('login-sign-in')
              )}
            </button>
          </form>
         <div className="footer">
  {t('login-no-account')} <a href="/register">{t('login-sign-up')}</a>
</div>

        </div>
      </div>
    </div>
  );
};

export default Login;
