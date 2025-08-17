import React, { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { showError } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RegisterCredentials } from '../types/auth.types';
import type { RegisterResult } from '../types/auth.types';

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerData, setRegisterData] = useState<RegisterCredentials>({ email: '', password: '', fullName: '', confirmPassword: '' });
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password, fullName, confirmPassword } = registerData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showError(t('register-enter-valid-email'));
      setIsLoading(false);
      return;
    }

    if (!fullName) {
      showError(t('register-enter-fullName'));
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 12) {
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
      const data: RegisterResult = await register(registerData);
      if (data.success) {
        navigate("/login");
      }
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
            <input type="email" onChange={e => setRegisterData(prev => ({ ...prev, email: e.target.value }))} placeholder={t('register-email')} name="email" required />
            <input type="text" onChange={n => setRegisterData(prev => ({ ...prev, fullName: n.target.value }))} placeholder={t('register-fullName')} name="fullName" required />
            <input type="password" onChange={p => setRegisterData(prev => ({ ...prev, password: p.target.value }))} placeholder={t('register-password')} name="password" required />
            <input type="password" onChange={cp => setRegisterData(prev => ({ ...prev, confirmPassword: cp.target.value }))} placeholder={t('register-confirm-password')} name="confirmPassword" required />

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
