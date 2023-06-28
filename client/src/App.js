import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import NavBar from "./components/NavBar/NavBar";
import MeetupsPage from "./pages/MeetupsPage/MeetupsPage";
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import NewMeetupPage from './pages/NewMeetupPage/NewMeetupPage';
import MyMeetupsPage from './pages/MyMeetupsPage/MyMeetupsPage';
import MeetupInfoPage from './pages/MeetupInfoPage/MeetupInfoPage';
import DiscussionsPage from './pages/DiscussionsPage/DiscussionsPage';
import NewDiscussionPage from './pages/NewDiscussionPage/NewDiscussionPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import NewGroupPage from './pages/NewGroupPage/NewGroupPage';
import Group from './pages/Group/Group';
import GroupInfoPage from './pages/GroupInfoPage/GroupInfoPage';
import EditGroupPage from './pages/EditGroupPage/EditGroupPage';
import SearchPage from './pages/SearchPage/SearchPage';




function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <BrowserRouter>
        {user && <NavBar />}
        <Routes>
          <Route 
            path="/"
            element={user ? <Navigate to="/meetups"/> : <Navigate to="/login"/>}
          />

          <Route 
            path="/meetups"
            element={user ? <MeetupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/discussions"
            element={user ? <DiscussionsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newdiscussion"
            element={user ? <NewDiscussionPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/meetups/:meetupId"
            element={user ? <MeetupInfoPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/mymeetups"
            element={user ? <MyMeetupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/search"
            element={user ? <SearchPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newmeetup/:groupId"
            element={user ? <NewMeetupPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newmeetup"
            element={user ? <NewMeetupPage /> : <Navigate to="/login"/>}
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
            element={user ? <ProfilePage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/edit/:username"
            element={user ? <EditProfilePage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/notifications/:username"
            element={user ? <NotificationsPage /> : <Navigate to="/login"/>}
          />
          
          <Route 
            path="/mygroups"
            element={user ? <GroupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newgroup"
            element={user ? <NewGroupPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/:id"
            element={user ? <Group /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/info/:id"
            element={user ? <GroupInfoPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/edit/:id"
            element={user ? <EditGroupPage /> : <Navigate to="/login"/>}
          />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
