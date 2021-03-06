import "./ProfilePage.css";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import Modal from '../AAPopups/Modals';

import ProfilePostsNav from "../ProfilePostsNav";
import ProfileFeed from "../ProfileFeed";
import UserRow, { handleFollowClick } from "./UserRow";
import { fetchUserProfile } from "../../store/profile";
import { fetchNotifications } from "../../store/notifications";
import ChangePasswordForm from '../auth/ChangePasswordForm';
import { UpdateProfileModal } from '../auth/SignUpForm';
import { AddAPostForm } from '../Post';
import { PostModal } from '../AAAMainComponents/SingleCard';
import { EquipmentDiv } from "./Equipment";

export const notFollowedYet = (userId, myself) => {
  if (userId === myself.id) return false; //I'm not going to follow myself!
  if (myself.following) {
    return !myself.following.some((fl) => fl.id === userId);
  }
  return true;
};

const ProfilePage = ({ tagged, liked, saved, create }) => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const myself = useSelector((state) => state.session.user);
  const singlePost = useSelector((state) => state.posts.singlePost);
  const history = useHistory();
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [numberOfOwnPosts, setNumberOfOwnPosts] = useState(0);
  const [numberOfLikeds, setNumberOfLikeds] = useState(0);
  const [numberOfVieweds, setNumberOfVieweds] = useState(0);
  const [numberOfDrones, setNumberOfDrones] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, profile.ownPosts, username]);

  useEffect(() => {
    dispatch(fetchNotifications());

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!profile.user) return;
    if (profile.user.followers && Array.isArray(profile.user.followers)) {
      setNumberOfFollowers(profile.user.followers.length);
    }
    if (profile.user.following && Array.isArray(profile.user.following)) {
      setNumberOfFollowing(profile.user.following.length);
    }
    if (profile.user.ownPosts && Array.isArray(profile.user.ownPosts)) {
      setNumberOfOwnPosts(profile.user.ownPosts.length);
      setNumberOfLikeds(profile.user.ownPosts.map(p => p.likes).reduce((acum, current) => acum + current, 0));
      setNumberOfVieweds(profile.user.ownPosts.map(p => p.views).reduce((acum, current) => acum + current, 0));
    }
    if (profile.user.equipmentList && Array.isArray(profile.user.equipmentList)) {
      setNumberOfDrones(profile.user.equipmentList.length);
    }
  }, [profile]);

  useEffect(() => {
    if (showPostModal !== false) {
      const post = profile.user.ownPosts.find(p => p.id === showPostModal);
      if (post) setModalPost(post);
      else
        if (singlePost.images) setModalPost(singlePost);
    } else {
      setModalPost(null);
    }
  }, [showPostModal]);

  const handleFollowersClick = (e) => {
    e.preventDefault();
    setShowFollowersModal(true);
  };

  const handleFollowingClick = (e) => {
    e.preventDefault();
    setShowFollowingModal(true);
  };


  const FollowModal = ({ setShowModal, listOfUsers = [], title = "Followers" }) => {
    const [listOfUsersWithoutMe] = useState(
      listOfUsers.filter((user) => user.id !== myself.id)
    );
    const [amIIntheList] = useState(
      listOfUsers.length !== listOfUsersWithoutMe.length
    );

    return (
      <Modal setShowModal={setShowModal} title={title} dronestLogo={false} needsEscapeInput={true}>
        <div className="modal-content-scroll">
          {amIIntheList && (
            <UserRow
              user={myself}
              modal={true}
              myId={myself.id}
              notFollowedYet={false}
            />
          )}
          {listOfUsersWithoutMe.map((u) => (
            <div key={nanoid()}>
              <UserRow
                modal={true}
                onClose={() => {
                  setShowFollowersModal(false);
                  setShowFollowingModal(false);
                }}
                user={u}
                myId={myself.id}
                notFollowedYet={notFollowedYet(u.id, myself)}
                followlist={true}
              />
            </div>
          ))}
        </div>
      </Modal>
    );
  };

  const handelChangePassword = e => {
    e.preventDefault();
    setShowChangePasswordModal(true);
  }

  const handleEditProfile = e => {
    e.preventDefault();
    setShowUpdateProfileModal(true);
  }


  return (
    <div className="profile-page-container" >
      {profile.user && (
        <>
          <div className='profile-info-and-right-div'>
            <div className="profile-info">
              <img
                draggable="false"
                src={`${profile.user.profilePicUrl}`}
                className="profile-pic"
              />
              <div className="profile-text">
                <div className="profile-username-and-button">
                  <span className="profile-username">{profile.user.username}</span>
                  {notFollowedYet(profile.user.id, myself) ? (
                    <button
                      className="profile-follow-button"
                      onClick={(e) =>
                        handleFollowClick(
                          e,
                          profile.user.id,
                          profile.user.id,
                          true,
                          dispatch
                        )
                      }
                    >
                      Follow
                    </button>
                  ) : myself.id === profile.user.id ? (
                    <>
                      <button className="profile-edit-button"
                        onClick={handleEditProfile}
                      >Edit Profile</button>
                      <button className="profile-edit-button"
                        style={{ fontSize: '10px' }}
                        onClick={handelChangePassword}
                      >Change <br />Password</button>
                    </>
                  ) : (
                        <>
                          <button className="profile-edit-button"
                            onClick={e => history.push(`/messages/${profile.user.id}`)}
                          >Message</button>
                          <button
                            className="profile-following-button"
                            onClick={(e) =>
                              handleFollowClick(
                                e,
                                profile.user.id,
                                profile.user.id,
                                false,
                                dispatch
                              )
                            }
                          >
                            Unfollow
                          </button>
                        </>
                      )}
                </div>
                <div className="profile-numbers">
                  <div className="profile-posts-numbers">
                    <span className="profile-number">{numberOfOwnPosts}</span>
                    <span className="profile-number-text"> posts</span>
                  </div>
                  <div className="profile-posts-numbers">
                    <span className="profile-number">{numberOfLikeds}</span>
                    <span className="profile-number-text"> liked</span>
                  </div>
                  <div className="profile-posts-numbers">
                    <span className="profile-number">{numberOfVieweds}</span>
                    <span className="profile-number-text"> viewed</span>
                  </div>
                  <div
                    className="profile-follower-numbers"
                    onClick={handleFollowersClick}
                  >
                    <span className="profile-number">{numberOfFollowers}</span>
                    <span className="profile-number-text"> followers</span>
                  </div>
                  <div
                    className="profile-follower-numbers"
                    onClick={handleFollowingClick}
                  >
                    <span className="profile-number">{numberOfFollowing}</span>
                    <span className="profile-number-text"> following</span>
                  </div>
                  <div className="profile-posts-numbers">
                    <span className="profile-number">{numberOfDrones}</span>
                    <span className="profile-number-text"> drones</span>
                  </div>
                </div>
                <div className="profile-display-name">{profile.user.name}</div>
                <div className="profile-bio">{profile.user.bio}</div>
                <a
                  className="profile-website-url"
                  href={`${profile.user.websiteUrl}`}
                >
                  {profile.user.websiteUrl}
                </a>
              </div>
            </div>
            <EquipmentDiv equipmentList={profile.user.equipmentList} />
          </div>
        </>
      )}
      {profile && <ProfilePostsNav />}
      {profile.user && !tagged && !liked && !saved && !create && (
        <ProfileFeed posts={profile.user.ownPosts} setShowPostModal={setShowPostModal} />
      )}
      {profile.user && create && <AddAPostForm />}
      {profile.user && tagged && <ProfileFeed posts={profile.user.taggedInPosts} setShowPostModal={setShowPostModal} />}
      {profile.user && saved && <ProfileFeed posts={profile.user.savedPosts} setShowPostModal={setShowPostModal} />}
      {profile.user && liked && <ProfileFeed posts={profile.user.likedPosts} setShowPostModal={setShowPostModal} />}
      {
        modalPost && profile.user && !create &&
        <PostModal user={profile.user} posts={[modalPost]} setShowModal={setShowPostModal} />
      }
      {showFollowersModal && (
        <FollowModal setShowModal={setShowFollowersModal} listOfUsers={profile.user.followers} title="Followers" />
      )}
      {showFollowingModal && (
        <FollowModal setShowModal={setShowFollowingModal} listOfUsers={profile.user.following} title="Following" />
      )}
      {showChangePasswordModal &&
        <ChangePasswordForm setShowModal={setShowChangePasswordModal} />
      }
      {showUpdateProfileModal &&
        <UpdateProfileModal setShowModal={setShowUpdateProfileModal} />
      }
    </div>
  );
};

export function CreateAPostPage() {

  return (
    <div>
      <form>

      </form>
    </div>
  );
}

export default ProfilePage;
