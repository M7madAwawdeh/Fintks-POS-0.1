import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';
    import { useTranslation } from '../hooks/useTranslation';

    function Login() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const { login } = useAuth();
      const navigate = useNavigate();
      const { t } = useTranslation();

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await login(username, password);
          navigate('/');
        } catch (error) {
          alert(`${t('loginFailed')} ${error.message}`);
        }
      };

      return (
        <div>
          <h2>{t('login')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">{t('login')}</button>
          </form>
        </div>
      );
    }

    export default Login;
