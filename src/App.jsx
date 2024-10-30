import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Timer from './components/Timer'
import LoginForm from './components/Login'
// import { useNavigate } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLogin(true);
      // navigate("/");
    };
  }, [])


  return (
    <>
      {(isLogin ? <Timer /> : <LoginForm />)}
      
    </>
  )
}

export default App
