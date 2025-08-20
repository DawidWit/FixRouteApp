import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Login.css";
import Logo from "../components/icons/logo.png";
import { useTranslation } from "react-i18next";
import Loader from "../components/ui/Loader";
import { showError, showSuccess } from "../utils/toast";
import { Link } from "react-router-dom";

const COOLDOWN_SECONDS = 30;

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validate = (value: string) => {
    if (!value) return t("login-enter-email");
    if (!emailRegex.test(value)) return t("login-enter-email");
    return null;
  };

  useEffect(() => {
    if (emailSent) inputRef.current?.blur();
  }, [emailSent]);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const onBlur = () => {
    setTouched(true);
    setError(validate(email));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched) setError(validate(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentError = validate(email);
    if (currentError) {
      setTouched(true);
      setError(currentError);
      showError(currentError);
      return;
    }

    try {
      setIsLoading(true);

      // TODO: podłącz do API, np.:
      // await api.auth.requestPasswordReset({ email });
      await new Promise((r) => setTimeout(r, 1500));

      setEmailSent(true);
      setCooldown(COOLDOWN_SECONDS);
      liveRegionRef.current!.textContent = t("forgot-password-email-sent");
    } catch {
      showError(t("forgot-password-error"));
      liveRegionRef.current!.textContent = t("forgot-password-error");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = !isLoading && !validate(email);

  return (
    <div>
      <div className="logo-row" aria-hidden="true">
        <img src={Logo} alt="" draggable={false} />
      </div>

      <div className="login-container">
        <div className="login-box" aria-busy={isLoading ? "true" : "false"}>
          <div className="login-header">
            <h1>{t("forgot-password-title")}</h1>
            <h2>{t("forgot-password-subtitle")}</h2>
          </div>
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            ref={liveRegionRef}
          />
          {!emailSent ? (
            <form noValidate onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  id="email"
                  ref={inputRef}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("login-email")}
                  value={email}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={!!error}
                  aria-describedby="email-help email-error"
                  required
                  autoFocus
                />
                {touched && error && (
                  <p id="email-error" className="error-text">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="primary-btn"
                disabled={!canSubmit}
                style={{ marginTop: "20px" }}
              >
                {isLoading ? (
                  <div className="loader-button-wrapper">
                    <Loader size={20} color="#fff" thickness={3} />
                  </div>
                ) : (
                  t("forgot-password-send-link")
                )}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="banner banner-success">
                {t("forgot-password-check-email")}
              </div>
              <button
                type="button"
                className="secondary-btn"
                disabled={cooldown > 0 || isLoading}
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await new Promise((r) => setTimeout(r, 1200));
                    setCooldown(COOLDOWN_SECONDS);
                    liveRegionRef.current!.textContent = t(
                      "forgot-password-email-resent"
                    );
                  } catch {
                    showError(t("forgot-password-error"));
                    liveRegionRef.current!.textContent = t(
                      "forgot-password-error"
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {cooldown > 0
                  ? t("forgot-password-resend-wait", { seconds: cooldown })
                  : t("forgot-password-resend")}
              </button>
              <ul className="help-text">
                <li>{t("forgot-password-tips-spam")}</li>
                <li>{t("forgot-password-tips-correct-email")}</li>
              </ul>
            </div>
          )}
          <div className="footer">
            <Link to="/login">{t("forgot-password-back-to-login")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
