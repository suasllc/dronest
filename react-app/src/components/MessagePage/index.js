import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EditorState, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "draft-js-mention-plugin";
import "draft-js/dist/Draft.css";
import { Link } from "react-router-dom";
import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
import { uploadPost } from "../../store/posts";
import UserRow from "../ProfilePage/UserRow";

import sendAMessage from "../../store/messages";

import "./MessagePage.css";
import { nanoid } from "nanoid";
import User from "../User";

function MessagePage() {
  const myself = useSelector((state) => state.session.user);
  const [currentMsg, setCurrentMsg] = useState("");
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const dispatch = useDispatch();
  const [allReceivers, setAllReceivers] = useState(
    myself.followers.concat(myself.following)
  );

  const receiverClick = (e) => {
    e.preventDefault();
    const receiverId = Number(e.target.id.split("-")[0]);
    setCurrentReceiver(allReceivers.filter((u) => u.id === receiverId)[0]);
  };

  const msgClick = (e) => {
    e.preventDefault();
    sendAMessage(myself.id, currentReceiver.id, currentMsg, dispatch);
    setCurrentMsg("");
  };

  return (
    <div className="message-page-main-div">
      <div className="message-page-left-panel">
        <div className="top-left-div">
          <h1 className="top-left hvr-wobble-bottom"> Contacts</h1>
        </div>
        <div className="middle-left-div"></div>
        <div className="main-left-div">
          {allReceivers.map((u) => (
            <div key={nanoid()} id={`${u.id}-receiver`} onClick={receiverClick}>
              <UserRow
                user={u}
                myId={myself.id}
                showFollowButtonOrText={false}
                gotoUserPage={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="message-page-right-panel">
        <div className="top-right-div">
          {currentReceiver && (
            <UserRow
              user={currentReceiver}
              myId={myself.id}
              showFollowButtonOrText={false}
              gotoUserPage={false}
            />
          )}
          <h1 className="top-right hvr-wobble-bottom">Inbox</h1>
        </div>
        <div className="main-right-div">
          <div className="message-pannel-div">
            <div className="messages-div">
              {myself.messages &&
                myself.messages.map((msg) => (
                  <div key={nanoid()}>{msg.message}</div>
                ))}
            </div>
            <div className="message-typing-box-div">
              <form className="message-input-form">
                <input
                  type="text"
                  className="message-input-box"
                  value={currentMsg}
                  onChange={(e) => setCurrentMsg(e.target.value)}
                />
                {/* <textarea className='message-input-box'></textarea> */}
                <button type="submit" onClick={msgClick}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;
