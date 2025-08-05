import React from 'react';
import './Login.modules.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/authService';
import { showError, showSuccess } from '../utils/toast';

const Login: React.FC = () => {
    const { t } = useTranslation();


    return (<div>
        <div className="logo-row">
            <img src={Logo} alt="Logo" draggable={false} />
            <span className="logo-text">FixRoute</span>
        </div>
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>{t('login-welcome')}</h1>
                </div>
                <form noValidate onSubmit={async (e) => {e.preventDefault();
                     const form = e.target as HTMLFormElement;
                    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
                    const rememberMe = (form.elements.namedItem('remember') as HTMLInputElement).checked;
                    await loginUser({ email, password, rememberMe });
                }}>
                    <input type="email" placeholder={t('login-email')} name="email" required />
                    <input type="password" placeholder={t('login-password')} name="password" required />

                    <div className="options">
                        <label>
                           <div className="checkbox-wrapper">
  <input type="checkbox" id="remember" name="remember" />
  <label htmlFor="remember">{t('login-remember-me')}</label>
</div>
                        </label>
                        <a href="#">{t('login-forgot-password')}</a>
                    </div>
                    <button type="submit" className="primary-btn">{t('login-sign-in')}</button>
                </form>
                <div className="footer">
                    {t('login-no-account')} <a href="#">{t('login-sign-up')}</a>
                </div>
            </div>
        </div>
    </div>

    );
};

export default Login;
