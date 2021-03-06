import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import Iframe from 'react-iframe';
import ReactMarkdown from 'react-markdown';
import { render } from 'react-dom';
import MiniProfile from '../MiniProfile';
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineGithub } from 'react-icons/ai';

import { fetchAllUsers } from '../../store/users';


import './About.css';

function SocialLinks({ className, innerClassName = 'social-links', sidebar = false }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={className}>
      <div className={innerClassName}>
        {
          sidebar && <div className='social-icon-and-text'
            onMouseEnter={() => setTimeout(() => setShowInfo(true), 600)}
            onMouseLeave={() => setTimeout(() => setShowInfo(false), 200)}
          >
            <Link to='/about'>
              <AiOutlineInfoCircle className='social-icon' />
            </Link>
            <div>
              Info
              </div>
          </div>
        }
        {showInfo && <div className='moreinfo-tooltip'>
          <span>Click for</span> <span>more info</span>
        </div>
        }

        <div className='social-icon-and-text'>
          <a href='https://github.com/tonyngophd/dronest' target='_blank'>
            <img src={'https://o.dlf.pt/dfpng/smallpng/159-1596784_git-logo-png-transparent-background-icon-logo-git.png'} className='social-icon' />
            {/* <img src={'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg'} className='social-icon' />             */}
          </a>
          <div>
            Git Repo
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
          <a href='https://github.com/tonyngophd' target='_blank'>
            {/* <img src={'https://image.flaticon.com/icons/png/512/25/25231.png'} className='social-icon' /> */}
            <AiOutlineGithub className='social-icon' />
          </a>
          <div>
            GitHub
              </div>
        </div>
        <div className='social-icon-and-text'>
          <a href='https://tonyngo.me' target='_blank'>
            <img src={'https://cdn0.iconfinder.com/data/icons/web-design-21/50/44-512.png'} className='social-icon' />
          </a>
          <div>
            My site
              </div>
        </div>
      </div>
      <div className={innerClassName}>
        <div className='social-icon-and-text'>
          <a href='https://angel.co/u/tony-ngo-11' target='_blank'>
            <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwQ-b2UyYRrlUUE-l3m-BUtBJSXHU2aRXC1w&usqp=CAU'} className='social-icon' />
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
          <a href='https://scholar.google.com/citations?user=P8aALscAAAAJ&hl=en' target='_blank'>
            <img src={'data:image/png;base64,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'} className='social-icon' />
          </a>
          <div>
            Scholar
              </div>
        </div>
        <div className='social-icon-and-text'>
          <a href='https://github.com/tonyngophd/dronestms' target='_blank'>
            <img src={'https://o.dlf.pt/dfpng/smallpng/159-1596784_git-logo-png-transparent-background-icon-logo-git.png'} className='social-icon' />
            {/* <img src={'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg'} className='social-icon' />             */}
          </a>
          <div>
            GitRepo2
              </div>
        </div>
      </div>
    </div>
  );
}

export function SideInfoNav() {

  return (
    <div className='sideinfo-nav-container'>
      <div className='sideinfo-nav-div'>
        <SocialLinks
          className='social-links-sidenav'
          innerClassName='social-links column'
          sidebar={true}
        />
      </div>
    </div>
  );
}

function reactSkipperRemoved(string) {

  const arr = string.split('\n');
  let skip = false;
  const filteredArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '<!--ReactSkipperStart -->') {
      skip = true;
    } else if (arr[i] === '<!--ReactSkipperEnd -->') {
      skip = false;
    }
    if (!skip) {
      if (arr[i] !== '<!--ReactSkipperEnd -->') {
        filteredArr.push(arr[i]);
      }
    }
  }
  return filteredArr.join('\n');
}

export function About() {
  const users = useSelector(state => state.users.allUsers);
  const url = 'https://api.github.com/repos/tonyngophd/dronest/contents/README.md';
  let [gotContents, setGetContents] = useState(false)
  const dispatch = useDispatch();
  const [author, setAuthor] = useState(null);


  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());
    }
    if (users.length >= 5) setAuthor(users.find(u => u.username === 'TonySE'));
  }, [dispatch]);
  useEffect(() => {
    if (!author && users.length >= 5) setAuthor(users.find(u => u.username === 'TonySE'));
  }, [users]);


  const fetchGit = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      const res2 = await res.json()
      let markdown = new Buffer.from(res2.content, 'base64').toString('ascii');
      markdown = reactSkipperRemoved(markdown);
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
          <div className='about-project-title'>
            <h3>About The Project</h3>
            <div>
              A Full-Stack Web Application (Social Network, Instagram/FaceBook/Skypixel-like) for users to host and share their drone arts (pics/vids) and get socialized on the platform.
              This application features one React/Redux frontend and two backend servers, one main server serving all database and api routes, and one extra websocket server for instant messaging.
              <br />
              This is an experimental project.
            </div>
          </div>
          <h4>Technologies used</h4>
          <div>
            <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
              <h5>Package</h5>
            </div>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1280px-Npm-logo.svg.png' className='technology-icon' />
            <img src='https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png' className='technology-icon' />
            <img src='https://github.com/tonyngophd/tonyngophd.github.io/blob/master/images/heroku.svg' className='technology-icon' />
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzSXTzu-_Vxa4Bw2U1vfH8QLHsAXv1KAGZKQ&usqp=CAU' className='technology-icon' />
            <hr />
            <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
              <h5>Frontend - react/redux server</h5>
            </div>
            <img src={'https://images.squarespace-cdn.com/content/v1/5df7d8d44b9a7a49b2e475ac/1576526689110-QJM10YTHVZYU7Z7D2YLE/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/js-logo.png'} className='technology-icon' />
            <img src={'https://www.yaya.today/img/referral/Technologies/tech_react.png'} className='technology-icon' />
            <img src={'https://miro.medium.com/max/819/1*SRL22ADht1NU4LXUeU4YVg.png'} className='technology-icon' />
            <img src={'https://www.logolynx.com/images/logolynx/7e/7eed17a45f24e41077eb7cad1d031492.png'} className='technology-icon' />
            <img src={require('../../pictures/html5.png')} className='technology-icon' />
          </div>
          <hr />
          <div>
            <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
              <h5>Backend - 2 servers</h5>
            </div>
            <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
              <h6>Main Server</h6>
            </div>
            <img src='https://library.kissclipart.com/20181208/pwe/kissclipart-python-programming-a-beginners-guide-to-learn-py-c106bf0c27f1f5a5.jpg' className='technology-icon' />
            <img src={'https://miro.medium.com/max/800/1*Q5EUk28Xc3iCDoMSkrd1_w.png'} className='technology-icon graybackground' />
            <img src={'https://flask-sqlalchemy.palletsprojects.com/en/2.x/_static/flask-sqlalchemy-logo.png'} className='technology-icon graybackground' />
            <img src='https://cdn.iconscout.com/icon/free/png-512/postgresql-11-1175122.png' className='technology-icon' />
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/AWS_Simple_Icons_AWS_Cloud.svg/1024px-AWS_Simple_Icons_AWS_Cloud.svg.png' className='technology-icon' />
            <div style={{ marginTop: '-10px', marginBottom: '-10px' }}>
              <h6>Instant Messaging Server</h6>
            </div>
            <img src={'https://icon-library.com/images/node-js-icon/node-js-icon-8.jpg'} className='technology-icon' />
            <img src={'https://www.logolynx.com/images/logolynx/5b/5bf98b408fb57fec23637f44edd79138.jpeg'} className='technology-icon' />
            <img src={'https://jasonpallone.com/Sequelize-icon.png'} className='technology-icon' />
            <img src={'https://miro.medium.com/max/250/1*3ABPMVLRjEvRWJejNY5YOw.png'} className='technology-icon' />
          </div>
        </div>
        <div className='about-author-div'>
          <h3>About The Author</h3>
          <SocialLinks />
          {author && <MiniProfile user={author} hover={true} className='miniprofile-container-div static' />}
        </div>
      </div>
      <div className='github_readme_excerpt_header'>
        <h1 style={{ marginBottom: '-10px' }}>More Information</h1>
        <h3>(GitHub README excerpts)</h3>
      </div>
      <div id='markdown' className='readme-markdown'></div>
    </div>
  );
}