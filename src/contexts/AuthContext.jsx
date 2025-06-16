import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Definir um usuário padrão para desenvolvimento
    const userData = { 
      id: 1, 
      name: 'Administrador', 
      email: 'admin@coldtech.com',
      role: 'admin'
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoading(false);
  }, []);

  const login = (credentials) => {
    // Simulação de autenticação - em produção, isso seria uma chamada API
    if (credentials.email === 'admin@coldtech.com' && credentials.password === 'admin123') {
      const userData = { 
        id: 1, 
        name: 'Administrador', 
        email: credentials.email,
        role: 'admin'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;