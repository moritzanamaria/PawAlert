import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import OperaterService from '../services/operateri/OperaterService';
import useLoading from '../hooks/useLoading';
import useModal from '../hooks/useModal';

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
  const { showModal } = useModal();

  async function login(email, lozinka, povratak = RouteNames.HOME) {
    showLoading();
    try {
      const odgovor = await OperaterService.prijava(email, lozinka);
      if (odgovor.success) {
        localStorage.setItem('operater', JSON.stringify(odgovor.data));
        setAuthUser(odgovor.data);
        setIsLoggedIn(true);
        navigate(povratak, { replace: true });
      } else {
        localStorage.removeItem('operater');
        setAuthUser({});
        setIsLoggedIn(false);
        showModal(odgovor.message);
      }
    } catch (e) {
      showModal(e.message);
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