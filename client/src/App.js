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
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import NewGroupPage from './pages/NewGroupPage/NewGroupPage';
import Group from './pages/Group/Group';
import GroupInfoPage from './pages/GroupInfoPage/GroupInfoPage';
import SearchPage from './pages/SearchPage/SearchPage';




function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route 
            path="/"
            element={user ? <MyMeetupsPage /> : <EmptyPage />}
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
            path="/search"
            element={user ? <SearchPage /> : <EmptyPage />}
          />

          <Route 
            path="/newmeetup/:groupId"
            element={user ? <NewMeetupPage /> : <Navigate to="/"/>}
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
            path="/profile/:username"
            element={user ? <ProfilePage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/edit/:username"
            element={user ? <EditProfilePage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/notifications/:username"
            element={user ? <NotificationsPage /> : <Navigate to="/"/>}
          />
          
          <Route 
            path="/mygroups"
            element={user ? <GroupsPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/newgroup"
            element={user ? <NewGroupPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/group/:id"
            element={user ? <Group /> : <Navigate to="/"/>}
          />

          <Route 
            path="/group/info/:id"
            element={user ? <GroupInfoPage /> : <Navigate to="/"/>}
          />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
