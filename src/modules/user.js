import * as http from "./http.js";

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const UPDATE_LOADING = "UPDATE_LOADING";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_DATA = "UPDATE_DATA";
export const UPDATE_NAME = "UPDATE_NAME";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const TOKEN_ERROR = "TOKEN_ERROR";
export const RESET = "RESET";
export const ERROR = "ERROR";

const KEY_TOKEN = "KEY_TOKEN";
const KEY_TOKEN_EXPIRE = "KEY_TOKEN_EXPIRE";
const KEY_USER_ID = "KEY_USER_ID";
const KEY_EMAIL = "KEY_EMAIL";
const KEY_PASSWORD = "KEY_PASSWORD";
const KEY_NAME = "KEY_NAME";

const initialState = {
  email: localStorage.getItem(KEY_EMAIL),
  password: localStorage.getItem(KEY_PASSWORD),
  user: null,
  name: null,
  token: null,
  data: null,
  error: null,
  loading: false
};

//check local storage
const token = localStorage.getItem(KEY_TOKEN);
const user = localStorage.getItem(KEY_USER_ID);
const expire = localStorage.getItem(KEY_TOKEN_EXPIRE);
if (token && expire < Date.now()) {
  //valid token
  initialState.token = token;
  initialState.user = user;
  initialState.name = localStorage.getItem(KEY_NAME);
}

// reduce
export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.payload
      };

    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.payload
      };

    case LOGIN_ERROR:
      return {
        ...state,
        error: "Credentials Error"
      };

    case UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token
      };

    case UPDATE_NAME:
      return {
        ...state,
        name: action.payload
      };

    case UPDATE_DATA:
      return {
        ...state,
        data: action.payload
      };

    case RESET:
      return {
        ...state,
        error: "Please login again"
      };

    case ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};

//action creator
export const login = (email, password) => {
  return dispatch => {
    dispatch({
      type: UPDATE_LOADING,
      payload: true
    });

    dispatch({
      type: ERROR,
      payload: null
    });

    http
      .post("https://sevp.ice.gov/optapp/rest/loginLogout/login", {
        email,
        password
      })
      .then(res => {
        if (res && res.value) {
          // login!!

          // extract token:
          const base64Id = res.value.split(".")[1];
          const userInfo = JSON.parse(atob(base64Id));

          localStorage.setItem(KEY_TOKEN, res.value);
          localStorage.setItem(KEY_USER_ID, userInfo.sub);
          localStorage.setItem(KEY_TOKEN_EXPIRE, userInfo.exp);

          dispatch({
            type: UPDATE_USER,
            payload: {
              user: userInfo.sub,
              token: res.value
            }
          });

          dispatch(fetchInformation(userInfo.sub, res.value));

          return true;
        } else {
          dispatch({
            type: LOGIN_ERROR
          });
          dispatch({
            type: UPDATE_LOADING,
            payload: false
          });
          return false;
        }
      });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({
      type: UPDATE_DATA,
      payload: null
    });

    dispatch({
      type: UPDATE_NAME,
      payload: null
    });

    dispatch({
      type: UPDATE_USER,
      payload: {}
    });
    localStorage.removeItem(KEY_NAME);
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER_ID);
    localStorage.removeItem(KEY_TOKEN_EXPIRE);
  };
};

export const fetchInformation = (sub, token) => {
  return dispatch => {
    dispatch({
      type: UPDATE_LOADING,
      payload: true
    });

    dispatch({
      type: ERROR,
      payload: null
    });

    http
      .get("https://sevp.ice.gov/optapp/rest/students/" + sub, token)
      .then(res => {
        if (res && res.id) {
          dispatch({
            type: UPDATE_DATA,
            payload: res
          });
          const name = res.givenName + " " + res.surName;
          localStorage.setItem(KEY_NAME, name);
          dispatch({
            type: UPDATE_NAME,
            payload: name
          });
          dispatch({
            type: UPDATE_LOADING,
            payload: false
          });
        } else {
          // error, clear all
          dispatch({
            type: RESET
          });
        }
      });
  };
};

export const updateEmail = email => {
  return dispatch => {
    localStorage.setItem(KEY_EMAIL, email);
    dispatch({
      type: UPDATE_EMAIL,
      payload: email
    });
  };
};

export const updatePassword = password => {
  return dispatch => {
    localStorage.setItem(KEY_PASSWORD, password);
    dispatch({
      type: UPDATE_PASSWORD,
      payload: password
    });
  };
};
