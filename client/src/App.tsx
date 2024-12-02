import './App.css';
import './components/Styles/styles.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as paths from "./constants/routes";
import React, { useState } from 'react';
import Login from './components/pages/Login';
import SignUp from './components/pages/Signup';
import Home from "./components/pages/Home";
import Messages from "./components/pages/Messages";
import MyProjects from "./components/pages/MyProjects";
import Profile from "./components/pages/Profile";
import NewProfile from "./components/pages/NewProfile"
import Project from "./components/pages/Project";
import NewProject from "./components/pages/NewProject";
import ProjectPostPage from "./components/pages/ProjectPostPage";
import {Discover,Meet} from "./components/pages/DiscoverAndMeet";
import Settings from "./components/pages/Settings";
import NotFound from "./components/pages/NotFound";
import SideBar from "./components/Sidebar";
import MessageHistory from './components/pages/MessageHistory';
import CreateProject from './components/pages/CreateProject';
import CreditsFooter from './components/CreditsFooter';
import Credits from './components/pages/CreditsPage';
import EmailConfirmPage from './components/pages/EmailConfirmPage';

import uselocalstorage from 'use-local-storage';
import { useEffect } from 'react';


function App() {
  const [avatarImage, setAvatarImage] = useState('images/tempProfilePic.png');
  const [profileImage, setProfileImage] = useState('');

  // https://css-tricks.com/easy-dark-mode-and-multiple-color-themes-in-react/
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = uselocalstorage('theme', defaultDark ? 'dark' : 'light');

  // whenever the theme changes, set the images src for every page
  useEffect(() => {
    const themeIcon = document.getElementsByClassName('theme-icon');
    for (let i = 0; i < themeIcon.length; i++) {
      const icon = themeIcon[i] as HTMLImageElement;
      const src = themeIcon[i].getAttribute('src-' + theme) || 'default-' + theme + '-src.png';
      icon.src = src;
    }
  }, [theme]);


  return (
    <BrowserRouter>
      <div className="App" data-theme={theme} >
        <SideBar avatarImage={avatarImage} setAvatarImage={setAvatarImage} />
        <Routes>
          <Route path={paths.routes.DEFAULT} element={<Discover theme={theme} setTheme={setTheme}/>} />
          <Route path={paths.routes.LOGIN} element={<Login theme={theme}/>} />
          <Route path={paths.routes.SIGNUP} element={<SignUp theme={theme} avatarImage={avatarImage} setAvatarImage={setAvatarImage} profileImage={profileImage} setProfileImage={setProfileImage} />} />
          <Route path={paths.routes.HOME} element={<Discover theme={theme} setTheme={setTheme}/>} />
          <Route path={paths.routes.MEET} element={<Meet theme={theme} setTheme={setTheme}/>} />
          <Route path={paths.routes.MESSAGES} element={<Messages />} />
          <Route path={paths.routes.MYPROJECTS} element={<MyProjects theme={theme} setTheme={setTheme} />} />
          <Route path={paths.routes.PROFILE} element={<NewProfile theme={theme} setTheme={setTheme}/>} />
          <Route path={paths.routes.NEWPROFILE} element={<NewProfile theme={theme} setTheme={setTheme} />} />
          <Route path={paths.routes.PROJECT} element={<Project />}/>
          <Route path={paths.routes.NEWPROJECT} element={<NewProject />} />
          <Route path={paths.routes.CREATEPROJECT} element={<CreateProject />}/>
          <Route path={paths.routes.PROJECTPOST} element={<ProjectPostPage />} />
          <Route path={paths.routes.SETTINGS} element={<Settings avatarImage={avatarImage} setAvatarImage={setAvatarImage} profileImage={profileImage} setProfileImage={setProfileImage} />} />
          <Route path={paths.routes.NOTFOUND} element={<NotFound />} />
          <Route path={paths.routes.MESSAGEHISTORY} element={<MessageHistory />} />
          <Route path={paths.routes.CREDITS} element={<Credits />} />
          <Route path={paths.routes.EMAILCONFIRM} element={<EmailConfirmPage />}/>
        </Routes>
        {/* <CreditsFooter /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
