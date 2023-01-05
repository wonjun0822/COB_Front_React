import React, { useEffect, useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRouter from './Router';

function App() {
  const [isLogin, setLogin] = useState(false);
  
  useEffect(() => {
    checkLogin();
      
    function checkLogin() {
      const token = localStorage.getItem('token')

      if (token) {
        setLogin(true);
      }

      else {
        setLogin(false);
      }
    }

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    }
  }, [])

  return (
    <BrowserRouter>
      <AppRouter isLogin={isLogin} />
    </BrowserRouter>
  );
}

export default App;