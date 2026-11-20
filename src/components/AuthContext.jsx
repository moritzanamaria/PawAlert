import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import OperaterService from '../services/operateri/OperaterService';
import useLoading from '../hooks/useLoading';

export const AuthContext = createContext();

function procitajOperatera() {
  try {
    return JSON.parse(localStorage.getItem('operater'));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => procitajOperatera() ?? {});
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!procitajOperatera());
  const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

  async function login(email, lozinka) {
      showLoading();
    try {
    const odgovor = await OperaterService.prijava(email, lozinka);
    if (odgovor.success) {
      localStorage.setItem('operater', JSON.stringify(odgovor.data));
      setAuthUser(odgovor.data);
      setIsLoggedIn(true);
      navigate(odgovor.data.uloga === 'admin' ? RouteNames.NADZORNA_PLOCA : RouteNames.MOJ_PROFIL);
    } else {
      alert(odgovor.message);localStorage.removeItem('operater');
setAuthUser({});
      localStorage.setItem('operater', '');
      setAuthUser('');
      setIsLoggedIn(false);
    }
     } catch (e) {
      alert(e.message);
    } finally {
      hideLoading();
    }
  }

  function logout() {

    localStorage.removeItem('operater');
    setAuthUser({});
    setIsLoggedIn(false);
    navigate(RouteNames.HOME);
  }

  const value = {
    isLoggedIn,
    authUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}