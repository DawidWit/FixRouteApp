import React from 'react';
import './Login.modules.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';

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
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder={t('login-email')} required />
                    <input type="password" placeholder={t('login-password')} required />

                    <div className="options">
                        <label>
                            <input type="checkbox" /> {t('login-remember-me')}
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
