import React, { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/icons/logo.png';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { showError, showSuccess } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { RegisterCredentials, RegisterResult } from '../types/auth.types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type FieldErrors = {
  email?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

const passwordScore = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[@$!%*?&]/.test(pw)) score++;
  return Math.min(score, 4);
};

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const score = passwordScore(registerData.password);

  const validate = (): boolean => {
    const e: FieldErrors = {};
    const { email, password, fullName, confirmPassword } = registerData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // email
    if (!email || !emailRegex.test(email)) {
      e.email = t('register-enter-valid-email') || 'Wpisz poprawny adres e-mail.';
    }

    // name
    if (!fullName) {
      e.fullName = t('register-enter-fullName') || 'Podaj imię i nazwisko.';
    }

    // password – match backend: min 8 + [a-z] + [A-Z] + \d + [@$!%*?&]
    const passOk =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password);

    if (!passOk) {
      e.password =
        t('register-password-rules') ||
        'Hasło: min. 8 znaków oraz małe i DUŻE litery, cyfra i znak specjalny (@$!%*?&).';
    }

    if (password !== confirmPassword) {
      e.confirmPassword = t('register-passwords-dont-match') || 'Hasła nie są identyczne.';
    }

    if (!acceptTerms) {
      e.terms = t('register-accept-terms') || 'Zaakceptuj regulamin i politykę prywatności.';
    }

    setErrors(e);

    // show first error via toast
    const firstMsg = e.email || e.fullName || e.password || e.confirmPassword || e.terms;
    if (firstMsg) showError(firstMsg);

    return !firstMsg;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data: RegisterResult = await register(registerData);
      if (data?.success) {
        showSuccess(t('register-check-email') || 'Konto utworzone. Sprawdź e-mail, aby potwierdzić rejestrację.');
        navigate('/login');
      } else {
        showError(t('register-generic-error') || 'Nie udało się utworzyć konta. Spróbuj ponownie.');
      }
    } catch {
      showError(t('register-generic-error') || 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="logo-row">
        <img src={Logo} alt="Logo" draggable={false} />
      </div>

      <div className="login-container">
        <div className="login-box" role="region" aria-labelledby="register-title">
          <div className="login-header">
            <h1 id="register-title">{t('register-welcome') || 'Witaj w FixRoute!'}</h1>
            <h2>{t('register-subtitle') || 'Załóż konto, aby zarządzać zgłoszeniami i trasami.'}</h2>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            {/* EMAIL */}
            <label className="sr-only" htmlFor="email">{t('register-email') || 'Adres e-mail'}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              name="email"
              placeholder={t('register-email') || 'Adres e-mail'}
              value={registerData.email}
              onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {errors.email && <p id="email-error" className="error-text">{errors.email}</p>}

            {/* FULL NAME */}
            <label className="sr-only" htmlFor="fullName">{t('register-fullName') || 'Imię i nazwisko'}</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              name="fullName"
              placeholder={t('register-fullName') || 'Imię i nazwisko'}
              value={registerData.fullName}
              onChange={(e) => setRegisterData((p) => ({ ...p, fullName: e.target.value }))}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'name-error' : undefined}
              required
            />
            {errors.fullName && <p id="name-error" className="error-text">{errors.fullName}</p>}

            {/* PASSWORD */}
            <div className="password-wrapper">
              <label className="sr-only" htmlFor="password">{t('register-password') || 'Hasło'}</label>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                name="password"
                placeholder={t('register-password') || 'Hasło'}
                value={registerData.password}
                onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                onKeyUp={(e) => setCapsOn((e as any).getModifierState && (e as any).getModifierState('CapsLock'))}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPwd ? (t('register-hide') || 'Ukryj hasło') : (t('register-show') || 'Pokaż hasło')}
                aria-pressed={showPwd}
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Strength meter + helpers (cosmetic) */}
            <div className="strength-meter" aria-hidden="true">
              <div className={`strength-meter-fill strength-${score}`} />
            </div>
            <ul id="password-help" className="help-text">
              <li className={registerData.password.length >= 8 ? 'ok' : ''}>• min. 8 znaków</li>
              <li className={/[a-z]/.test(registerData.password) ? 'ok' : ''}>• mała litera</li>
              <li className={/[A-Z]/.test(registerData.password) ? 'ok' : ''}>• DUŻA litera</li>
              <li className={/\d/.test(registerData.password) ? 'ok' : ''}>• cyfra</li>
              <li className={/[@$!%*?&]/.test(registerData.password) ? 'ok' : ''}>• znak (@$!%*?&)</li>
              {capsOn && <li className="caps">{t('register-capslock') || 'Włączony Caps Lock'}</li>}
            </ul>
            {errors.password && <p id="password-error" className="error-text">{errors.password}</p>}

            {/* CONFIRM */}
            <div className="password-wrapper">
              <label className="sr-only" htmlFor="confirmPassword">{t('register-confirm-password') || 'Powtórz hasło'}</label>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                name="confirmPassword"
                placeholder={t('register-confirm-password') || 'Powtórz hasło'}
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData((p) => ({ ...p, confirmPassword: e.target.value }))}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showConfirm ? (t('register-hide') || 'Ukryj hasło') : (t('register-show') || 'Pokaż hasło')}
                aria-pressed={showConfirm}
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p id="confirm-error" className="error-text">{errors.confirmPassword}</p>}

            {/* TERMS */}
            <div className="checkbox-wrapper" style={{ marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <label htmlFor="terms">
                {t('register-terms-label') || <>Akceptuję <a href="/terms">Regulamin</a> i <a href="/privacy">Politykę prywatności</a>.</>}
              </label>
            </div>
            {errors.terms && <p id="terms-error" className="error-text">{errors.terms}</p>}

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loader-button-wrapper">
                  <Loader size={20} color="#fff" thickness={3} />
                </div>
              ) : (
                t('register-sign-up') || 'Zarejestruj się'
              )}
            </button>
          </form>

          <div className="footer">
            {t('register-have-account') || 'Masz już konto?'} <Link to="/login">{t('register-login') || 'Zaloguj się'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
