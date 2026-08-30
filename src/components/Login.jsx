import { useState } from 'react';
import { validateLogin } from '../utils/validation';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');

    const { valid, errors: fieldErrors } = validateLogin(usuario, contrasena);
    setErrors(fieldErrors);
    if (!valid) return;

    setLoading(true);

    // Simulación de autenticación asíncrona (demostración únicamente).
    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('ipsopol_session', JSON.stringify({ usuario, ts: Date.now() }));
      onLoginSuccess(usuario);
    }, 700);
  }

  return (
    <div className="login-screen">
      <div className="login-card card">
        <div className="login-logo">
          <img
            src="/logo-ipsopol.png"
            alt="Logotipo institucional IPSOPOL (placeholder)"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="login-brand-fallback visually-hidden">IPSOPOL</div>

        <div className="login-banner" role="note">
          Prototipo de demostración. Cualquier usuario y contraseña válidos (mínimo 3 y 4
          caracteres) permiten ingresar.
        </div>

        <p className="login-eyebrow">Acceso institucional</p>
        <h1 className="login-title">Dashboard Ejecutivo de Gestión</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <div className="login-input-wrap">
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={errors.usuario ? 'input-error' : ''}
                aria-invalid={Boolean(errors.usuario)}
                aria-describedby={errors.usuario ? 'usuario-error' : undefined}
              />
            </div>
            {errors.usuario && (
              <p id="usuario-error" className="login-error" role="alert">
                {errors.usuario}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="login-input-wrap">
              <input
                id="contrasena"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className={errors.contrasena ? 'input-error' : ''}
                aria-invalid={Boolean(errors.contrasena)}
                aria-describedby={errors.contrasena ? 'contrasena-error' : undefined}
                style={{ paddingRight: 64 }}
              />
              <button
                type="button"
                className="login-toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'OCULTAR' : 'MOSTRAR'}
              </button>
            </div>
            {errors.contrasena && (
              <p id="contrasena-error" className="login-error" role="alert">
                {errors.contrasena}
              </p>
            )}
          </div>

          {authError && (
            <p className="login-error" role="alert">
              {authError}
            </p>
          )}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading && <span className="loading-spinner" aria-hidden="true" />}
            {loading ? 'Ingresando…' : 'INGRESAR AL SISTEMA'}
          </button>
        </form>

        <p className="login-disclaimer">
          Esta autenticación es solo de demostración (frontend, con sessionStorage) y no debe
          usarse en producción. Un despliegue real requiere backend, base de datos, hash de
          contraseñas, HTTPS, cookies seguras, expiración de sesión, roles, límite de intentos
          y auditoría.
        </p>
      </div>
    </div>
  );
}
