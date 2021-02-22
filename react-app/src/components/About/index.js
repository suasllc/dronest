import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Iframe from 'react-iframe';
import ReactMarkdown from 'react-markdown';
import { render } from 'react-dom';
import MiniProfile from '../MiniProfile';

import { fetchAllUsers } from '../../store/users';


import './About.css';


export function About() {
  const users = useSelector(state => state.users.allUsers);
  const url = 'https://api.github.com/repos/suasllc/dronest/contents/README.md';
  let [gotContents, setGetContents] = useState(false)
  const dispatch = useDispatch();
  const [author, setAuthor] = useState(null);


  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
    if (users.length >= 3) setAuthor(users[2]);
  }, [dispatch]);
  useEffect(() => {
    if (!author && users.length >= 3) setAuthor(users[2]);
  }, [users]);


  const fetchGit = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      const res2 = await res.json()
      const markdown = new Buffer.from(res2.content, 'base64').toString('ascii')
      setGetContents(true);
      render(<ReactMarkdown children={markdown}></ReactMarkdown>, document.getElementById('markdown'));
    }
  }

  useEffect(() => {
    fetchGit(url);
  }, [url]);


  return (
    <div className='about_page_container'>
      <div className='technology-and-author'>
        <div>
          <div>
            <div>
              Package
            </div>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1280px-Npm-logo.svg.png' className='technology-icon' />
            <img src='https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png' className='technology-icon' />
            <img src='https://cdn.iconscout.com/icon/free/png-512/postgresql-11-1175122.png' className='technology-icon' />
            <img src='https://cdn.worldvectorlogo.com/logos/heroku.svg' className='technology-icon' />
            <div>
              Frontend
            </div>
            <img src={require('../../pictures/javascript.svg')} className='technology-icon' />
            <img src={require('../../pictures/iconfinder_React.js_logo_1174949.svg')} className='technology-icon' />
            <img src={require('../../pictures/iconfinder_redux_4691205.svg')} className='technology-icon' />
            <img src={require('../../pictures/css.svg')} className='technology-icon' />
            <img src={require('../../pictures/html5.png')} className='technology-icon' />
          </div>
          <div>
            <div>
              Backend
            </div>
            <div>
              Main Server
            </div>
            <img src={require('../../pictures/python.png')} className='technology-icon' />
            <img src={'https://miro.medium.com/max/800/1*Q5EUk28Xc3iCDoMSkrd1_w.png'} className='technology-icon' />
            <img src={'https://flask-sqlalchemy.palletsprojects.com/en/2.x/_static/flask-sqlalchemy-logo.png'} className='technology-icon' />
            <div>
              Instant Messaging Server
            </div>
            <img src={require('../../pictures/nodejs.svg')} className='technology-icon' />
            <img src={'https://www.logolynx.com/images/logolynx/5b/5bf98b408fb57fec23637f44edd79138.jpeg'} className='technology-icon' />
          </div>
        </div>
        <div>
          <div className='social-links'>
            <div className='social-icon-and-text'>
              <a href='https://github.com/suasllc/dronest' target='_blank'>
                <img src={'https://git-scm.com/images/logos/downloads/Git-Icon-Black.png'} className='social-icon' />
              </a>
              <div>
                Git Repo
              </div>
            </div>
            <div className='social-icon-and-text'>
              <a href='https://github.com/suasllc' target='_blank'>
                <img src={'https://image.flaticon.com/icons/png/512/25/25231.png'} className='social-icon' />
              </a>
              <div>
                GitHub
              </div>
            </div>
            <div className='social-icon-and-text'>
              <a href='https://www.linkedin.com/in/tony-ngo-suas/' target='_blank'>
                <img src={'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-linkedin-circle-512.png'} className='social-icon' />
              </a>
              <div>
                LinkedIn
              </div>
            </div>
            <div className='social-icon-and-text'>
              <a href='https://angel.co/u/tony-ngo-11' target='_blank'>
                <img src={'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/angellist-512.png'} className='social-icon' />
              </a>
              <div>
                Angellist
              </div>
            </div>
            <div className='social-icon-and-text'>
              <a href='https://www.youtube.com/c/sUAScom/videos' target='_blank'>
                <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Youtube_icon.svg/768px-Youtube_icon.svg.png'} className='social-icon' />
              </a>
              <div>
                YouTube
              </div>
            </div>
            <div className='social-icon-and-text'>
              <a href='https://www.tonyngo.us' target='_blank'>
                <img src={'https://cdn0.iconfinder.com/data/icons/web-design-21/50/44-512.png'} className='social-icon' />
              </a>
              <div>
                My site
              </div>
            </div>
          </div>
          {author && <MiniProfile user={author} hover={true} className='miniprofile-container-div static' />}
        </div>
      </div>
      <div id='markdown'></div>
    </div>
  );
}