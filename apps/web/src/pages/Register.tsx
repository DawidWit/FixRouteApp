import React, { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { showError } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { register } = useAuth(); // Assumes `register` exists in your hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showError(t('register-enter-valid-email'));
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      showError(t('register-password-length'));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showError(t('register-passwords-dont-match'));
      setIsLoading(false);
      return;
    }

    try {
      await register({ email, password, fullName}); 
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
            <h1>{t('register-welcome')}</h1>
          </div>
          <form noValidate onSubmit={handleSubmit}>
            <input type="email" placeholder={t('register-email')} name="email" required />
            <input type="text" placeholder={t('register-fullName')} name="fullName" required />
            <input type="password" placeholder={t('register-password')} name="password" required />
            <input type="password" placeholder={t('register-confirm-password')} name="confirmPassword" required />

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loader-button-wrapper">
                  <Loader size={20} color="#fff" thickness={3} />
                </div>
              ) : (
                t('register-sign-up')
              )}
            </button>
          </form>
          <div className="footer">
            {t('register-have-account')} <a href="/login">{t('register-login')}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
