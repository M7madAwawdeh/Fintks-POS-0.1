import React, { createContext, useState, useContext, useEffect } from 'react';
    import { getUsers } from '../services/userService';
    import localforage from 'localforage';

    const AuthContext = createContext();

    export function AuthProvider({ children }) {
      const [currentUser, setCurrentUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const loadUser = async () => {
          try {
            const storedUser = await localforage.getItem('user');
            if (storedUser) {
              setCurrentUser(storedUser);
            }
          } catch (error) {
            console.error('Error loading user from storage:', error);
          } finally {
            setLoading(false);
          }
        };
        loadUser();
      }, []);

      const login = async (username, password) => {
        const users = await getUsers();
        const user = users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          setCurrentUser(user);
          await localforage.setItem('user', user);
        } else {
          throw new Error('Invalid username or password');
        }
      };

      const logout = async () => {
        setCurrentUser(null);
        await localforage.removeItem('user');
      };

      const value = {
        currentUser,
        login,
        logout,
        loading,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    export function useAuth() {
      return useContext(AuthContext);
    }
