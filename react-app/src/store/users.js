const LOAD_ALL_USERS = "users/LOAD_ALL_USERS";
const LOAD_MORE_USERS = "users/LOAD_MORE_USERS";
const UPDATE_A_USER = "users/UPDATE_A_USER";
const UPDATE_A_USER_POST = "users/UPDATE_A_USER_POST";
const UPDATE_A_USER_POST_VIEW = "users/UPDATE_A_USER_POST_VIEW";
// const ADD_SUGGESTED_USERS = "users/ADD_SUGGESTED_USERS";

//TODO: work on an algorithm to suggest a small list of people only

export const loadAllUsersPOJO = (allUsers) => ({
  type: LOAD_ALL_USERS,
  payload: allUsers,
});

export const loadMoreUsersPOJO = (users) => ({
  type: LOAD_MORE_USERS,
  payload: users,
});

export const updateAUserPOJO = (user) => ({
  type: UPDATE_A_USER,
  payload: user,
});

export const updateAUsersPostViewPOJO = (post) => ({
  type: UPDATE_A_USER_POST_VIEW,
  payload: post,
});

export const updateAUsersPostPOJO = (post) => ({
  type: UPDATE_A_USER_POST,
  payload: post,
});

export const fetchAUsersPostView = (postId, mediaId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/posts/${postId}/addaview/${mediaId}`);
    // console.log(`/api/posts/${postId}/addaview/${mediaId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(updateAUsersPostViewPOJO(data.post));
      return true;
    }
  } catch (e) {

  }

}

export const fetchAllUsers = () => async (dispatch) => {
  try {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      dispatch(loadAllUsersPOJO(data.users));
    }
  } catch (e) {

  }
};

export const fetchANumberOfUsers = (startNum, unum) => async (dispatch) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({startNum, unum})
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(loadMoreUsersPOJO(data.users));
    }
  } catch (e) {

  }
};

export const fetchOneUser = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(updateAUserPOJO(data.user));
    }
  } catch (e) {

  }
};

const initialState = {
  allUsers: [],
};

const reducer = (state = initialState, action) => {
  let newState;
  let user;
  switch (action.type) {
    case LOAD_ALL_USERS:
      newState = Object.assign({}, state);
      newState.allUsers = action.payload;
      return newState;
    case LOAD_MORE_USERS:
      newState = Object.assign({}, state);
      newState.allUsers = [...newState.allUsers, ...action.payload];
      return newState;
    case UPDATE_A_USER:
      newState = Object.assign({}, state);
      user = newState.allUsers.find(u => u.id === action.payload.id);
      if (user) {
        for (let key in action.payload)
          user[key] = action.payload[key]
      } else {
        newState.allUsers.push(action.payload);
      }
      return newState;
    case UPDATE_A_USER_POST:
      newState = Object.assign({}, state);
      user = newState.allUsers.find(u => u.id === action.payload.userId);
      if (user && user.ownPosts.length) {
        const post = user.ownPosts.find(p => p.id === action.payload.id);
        for (let key in action.payload)
          post[key] = action.payload[key]
      }
      return newState;
    case UPDATE_A_USER_POST_VIEW:
      newState = Object.assign({}, state);
      user = newState.allUsers.find(u => u.id === action.payload.userId);
      if (user && user.ownPosts.length) {
        const post = user.ownPosts.find(p => p.id === action.payload.id);
        if(post){
          post.views = action.payload.views;
          post.images = action.payload.images;
        }
      }
      return newState;
    default:
      return state;
  }
};

export default reducer;
