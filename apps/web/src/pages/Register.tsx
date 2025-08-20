import React, { useState } from "react";
import "../styles/Login.css";
import Logo from "../components/icons/logo.png";
import { Trans, useTranslation } from "react-i18next";
import Loader from "../components/ui/Loader";
import { showError, showSuccess } from "../utils/toast";
import { useAuth } from "../hooks/useAuth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { RegisterCredentials, RegisterResult } from "../types/auth.types";

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
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [capsOn, setCapsOn] = useState(false);

  const score = passwordScore(registerData.password);

  const validate = (): boolean => {
    const e: FieldErrors = {};
    const { email, password, fullName, confirmPassword } = registerData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // email
    if (!email || !emailRegex.test(email)) {
      e.email = t("register-enter-valid-email") || "register-enter-valid-email";
    }

    // name
    if (!fullName) {
      e.fullName = t("register-enter-fullName") || "register-enter-fullName";
    }

    const passOk =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password);

    if (!passOk) {
      e.password =
        t("register-form-help-password-rules") ||
        "register-form-help-password-rules";
    }

    if (password !== confirmPassword) {
      e.confirmPassword =
        t("register-form-password-dont-match") || "register-form-password-dont-match";
    }

    if (!acceptTerms) {
      e.terms = t("register-form-accept-terms") || "register-form-accept-terms";
    }

    setErrors(e);

    const firstMsg =
      e.email || e.fullName || e.password || e.confirmPassword || e.terms;
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
        showSuccess(t("register-check-email") || "register-check-email");
        navigate("/login");
      } else {
        showError(t("register-generic-error") || "register-generic-error");
      }
    } catch {
      showError(t("register-generic-error") || "register-generic-error");
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
        <div
          className="login-box"
          role="region"
          aria-labelledby="register-title"
        >
          <div className="login-header">
            <h1 id="register-title">
              {t("register-welcome") || "register-welcome"}
            </h1>
            <h2>{t("register-subtitle") || "register-subtitle"}</h2>
          </div>
          <form noValidate onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">
              {t("register-email") || "register-email"}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              name="email"
              placeholder={t("register-email") || "register-email"}
              value={registerData.email}
              onChange={(e) =>
                setRegisterData((p) => ({ ...p, email: e.target.value }))
              }
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="error-text">
                {errors.email}
              </p>
            )}
            <label className="sr-only" htmlFor="fullName">
              {t("register-fullName") || "register-fullName"}
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              name="fullName"
              placeholder={t("register-fullName") || "register-fullName"}
              value={registerData.fullName}
              onChange={(e) =>
                setRegisterData((p) => ({ ...p, fullName: e.target.value }))
              }
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "name-error" : undefined}
              required
            />
            {errors.fullName && (
              <p id="name-error" className="error-text">
                {errors.fullName}
              </p>
            )}
            <div className="password-wrapper">
              <label className="sr-only" htmlFor="password">
                {t("register-password") || "register-password"}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                name="password"
                placeholder={t("register-password") || "register-password"}
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData((p) => ({ ...p, password: e.target.value }))
                }
                onKeyUp={(e) =>
                  setCapsOn(
                    (e as any).getModifierState &&
                      (e as any).getModifierState("CapsLock")
                  )
                }
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : "password-help"
                }
                required
              />
            </div>
            <div className="strength-meter" aria-hidden="true">
              <div className={`strength-meter-fill strength-${score}`} />
            </div>
            <ol id="password-help" className="help-text">
              <li className={registerData.password.length >= 8 ? "ok" : ""}>
                {t("register-form-help-8-characters")}
              </li>
              <li
                className={
                  /[a-z]/.test(registerData.password) &&
                  /[A-Z]/.test(registerData.password)
                    ? "ok"
                    : ""
                }
              >
                {t("register-form-help-lowercase-uppercase")}
              </li>
              <li className={/\d/.test(registerData.password) ? "ok" : ""}>
                {t("register-form-help-number")}
              </li>
              <li
                className={/[@$!%*?&]/.test(registerData.password) ? "ok" : ""}
              >
                {t("register-form-help-symbols")}
              </li>
            </ol>
            {capsOn && (
              <div className="caps">
                {t("register-capslock") || "Włączony Caps Lock"}
              </div>
            )}
            {errors.password && (
              <p id="password-error" className="error-text">
                {errors.password}
              </p>
            )}
            <div className="password-wrapper">
              <label className="sr-only" htmlFor="confirmPassword">
                {t("register-confirm-password") || "register-confirm-password"}
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                name="confirmPassword"
                placeholder={
                  t("register-confirm-password") || "register-confirm-password"
                }
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-error" : undefined
                }
                required
              />
            </div>
            {errors.confirmPassword && (
              <p id="confirm-error" className="error-text">
                {errors.confirmPassword}
              </p>
            )}
            <div className="checkbox-wrapper" style={{ marginTop: "1.2rem" }}>
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "terms-error" : undefined}
              />
              <label htmlFor="terms">
                <Trans
                  i18nKey="register-form-terms-label"
                  className="footer"
                  components={[
                    <span style={{ fontSize: "15px"}} />,
                    <Link
                      to="/terms"
                      style={{
                        color: "#4285f4",
                        textDecoration: "none",
                        fontSize: "15px",
                      }}
                    />,
                  ]}
                />
              </label>
            </div>
            {errors.terms && (
              <p id="terms-error" className="error-text">
                {errors.terms}
              </p>
            )}
            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading}
              style={{ marginTop: "1.2rem" }}
            >
              {isLoading ? (
                <div className="loader-button-wrapper">
                  <Loader size={20} color="#fff" thickness={3} />
                </div>
              ) : (
                t("register-sign-up") || "register-sign-up"
              )}
            </button>
          </form>

          <div className="footer">
            {t("register-have-account") || "register-have-account"}{" "}
            <Link to="/login">{t("register-login") || "register-login"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
("register-login");
