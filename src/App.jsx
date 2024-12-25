import React from 'react';
    import { Routes, Route, Link } from 'react-router-dom';
    import UserManagement from './components/UserManagement';
    import ProductManagement from './components/ProductManagement';
    import SalesManagement from './components/SalesManagement';
    import Login from './components/Login';
    import { AuthProvider } from './contexts/AuthContext';
    import { RequireAuth } from './components/RequireAuth';
    import SalesHistory from './components/SalesHistory';
    import { useTranslation } from './hooks/useTranslation';
    import LanguageSelector from './components/LanguageSelector';
    import Dashboard from './components/Dashboard';

    function App() {
      const { t } = useTranslation();

      return (
        <AuthProvider>
          <div className="container">
            <nav>
              <div>
                <Link to="/">{t('home')}</Link>
                <Link to="/products">{t('products')}</Link>
                <Link to="/sales">{t('sales')}</Link>
                <Link to="/users">{t('users')}</Link>
                <Link to="/sales-history">{t('salesHistory')}</Link>
              </div>
              <LanguageSelector />
            </nav>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/users"
                element={
                  <RequireAuth>
                    <UserManagement />
                  </RequireAuth>
                }
              />
              <Route
                path="/products"
                element={
                  <RequireAuth>
                    <ProductManagement />
                  </RequireAuth>
                }
              />
              <Route
                path="/sales"
                element={
                  <RequireAuth>
                    <SalesManagement />
                  </RequireAuth>
                }
              />
              <Route
                path="/sales-history"
                element={
                  <RequireAuth>
                    <SalesHistory />
                  </RequireAuth>
                }
              />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </AuthProvider>
      );
    }

    export default App;
