import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import NavBar from "./components/NavBar/NavBar";
import MeetupsPage from "./pages/MeetupsPage/MeetupsPage";
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewMeetupPage from './pages/NewMeetupPage/NewMeetupPage';
import MyMeetupsPage from './pages/MyMeetupsPage/MyMeetupsPage';




function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route 
            path="/"
            element={<MeetupsPage />}
          />

          <Route 
            path="/mymeetups"
            element={<MyMeetupsPage />}
          />

          <Route 
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/newmeetup"
            element={<NewMeetupPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
