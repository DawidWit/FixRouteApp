import React, { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { showError, showSuccess } from '../utils/toast';

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(t('login-enter-email'));
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
      showSuccess(t('forgot-password-email-sent'));
    } catch (err) {
      showError(t('forgot-password-error'));
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
            <h1>{t('forgot-password-title')}</h1>
            <h2>{t('forgot-password-subtitle')}</h2>
          </div>

          {emailSent ? (
            <p>{t('forgot-password-check-email')}</p>
          ) : (
            <form noValidate onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={t('login-email')}
                name="email"
                required
              />

              <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loader-button-wrapper">
                    <Loader size={20} color="#fff" thickness={3} />
                  </div>
                ) : (
                  t('forgot-password-send-link')
                )}
              </button>
            </form>
          )}

          <div className="footer">
            <a href="/login">{t('forgot-password-back-to-login')}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
