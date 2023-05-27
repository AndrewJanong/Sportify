import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import NavBar from "./components/NavBar/NavBar";
import EmptyPage from './pages/EmptyPage/EmptyPage';
import MeetupsPage from "./pages/MeetupsPage/MeetupsPage";
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewMeetupPage from './pages/NewMeetupPage/NewMeetupPage';
import MyMeetupsPage from './pages/MyMeetupsPage/MyMeetupsPage';
import MeetupInfoPage from './pages/MeetupInfoPage/MeetupInfoPage';
import DiscussionsPage from './pages/DiscussionsPage/DiscussionsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';




function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route 
            path="/"
            element={user ? <MeetupsPage /> : <EmptyPage />}
          />

          <Route 
            path="/meetups"
            element={user ? <MeetupsPage /> : <EmptyPage />}
          />

          <Route 
            path="/discussions"
            element={user ? <DiscussionsPage /> : <EmptyPage />}
          />

          <Route 
            path="/meetups/:meetupId"
            element={user ? <MeetupInfoPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/mymeetups"
            element={user ? <MyMeetupsPage /> : <EmptyPage />}
          />

          <Route 
            path="/newmeetup"
            element={user ? <NewMeetupPage /> : <Navigate to="/"/>}
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
            path="/profile/:userId"
            element={user ? <ProfilePage /> : <Navigate to="/"/>}
          />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
