import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MeetupsContextProvider } from './context/MeetupContext';
import { DiscussionsContextProvider } from './context/DiscussionContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MeetupsContextProvider>
        <DiscussionsContextProvider>
          <App />
        </DiscussionsContextProvider>
      </MeetupsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

