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
        {(user && user.verified) && <NavBar />}
        <Routes>
          <Route 
            path="/"
            element={(user && user.verified) ? <Navigate to="/meetups"/> : <Navigate to="/login"/>}
          />

          <Route 
            path="/meetups"
            element={(user && user.verified) ? <MeetupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/discussions"
            element={(user && user.verified) ? <DiscussionsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newdiscussion"
            element={(user && user.verified) ? <NewDiscussionPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/meetups/:meetupId"
            element={(user && user.verified) ? <MeetupInfoPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/mymeetups"
            element={(user && user.verified) ? <MyMeetupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/search"
            element={(user && user.verified) ? <SearchPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newmeetup/:groupId"
            element={(user && user.verified) ? <NewMeetupPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newmeetup"
            element={(user && user.verified) ? <NewMeetupPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/login"
            element={(!user || (user && !user.verified)) ? <LoginPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/signup"
            element={(!user || (user && !user.verified)) ? <SignupPage /> : <Navigate to="/"/>}
          />

          <Route 
            path="/profile/:username"
            element={(user && user.verified) ? <ProfilePage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/edit/:username"
            element={(user && user.verified) ? <EditProfilePage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/notifications/:username"
            element={(user && user.verified) ? <NotificationsPage /> : <Navigate to="/login"/>}
          />
          
          <Route 
            path="/mygroups"
            element={(user && user.verified) ? <GroupsPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/newgroup"
            element={(user && user.verified) ? <NewGroupPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/:id"
            element={(user && user.verified) ? <Group /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/info/:id"
            element={(user && user.verified) ? <GroupInfoPage /> : <Navigate to="/login"/>}
          />

          <Route 
            path="/group/edit/:id"
            element={(user && user.verified) ? <EditGroupPage /> : <Navigate to="/login"/>}
          />
          <Route 
            path="*" 
            element={(user && user.verified) ? <Navigate to="/"/> : <Navigate to="/login"/>} 
          /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
