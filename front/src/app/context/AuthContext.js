import { createContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const token = Cookies.get('authToken');
    const token = localStorage.getItem('authToken');

    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    // try {
    //   // Simuler une récupération de l'utilisateur via une requête avec le token
    //   const response = await fetch('https://127.0.0.1:8000/user', {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   });
    //   const userData = await response.json();
    //   setUser(userData);
    // } catch (error) {
    //   console.error('Failed to fetch user data', error);
    // } finally {
    //   setLoading(false);
    // }
      const decodedToken = jwtDecode(token);
      
      localStorage.setItem('userData', JSON.stringify(decodedToken));
      setUser({
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      });
      setLoading(false);
  };

  const login = (token, userData) => {
    // Stocker le token dans les cookies
    Cookies.set('authToken', token, { expires: 7 });
    // Mettre à jour l'état utilisateur
    setUser(userData);
  };

  const logout = () => {
    // Supprimer le token
    // Cookies.remove('authToken');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};