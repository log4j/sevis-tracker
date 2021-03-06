import * as http from './http';
import ReactGA from './reactga';

export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_LOADING = 'UPDATE_LOADING';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_DATA = 'UPDATE_DATA';
export const UPDATE_NAME = 'UPDATE_NAME';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const TOKEN_ERROR = 'TOKEN_ERROR';
export const RESET = 'RESET';
export const ERROR = 'ERROR';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const UPDATE_SHOW_HISTORY = 'UPDATE_SHOW_HISTORY';
export const UPDATE_LOADING_HISTORY = 'UPDATE_LOADING_HISTORY';

const KEY_TOKEN = 'KEY_TOKEN';
const KEY_TOKEN_EXPIRE = 'KEY_TOKEN_EXPIRE';
const KEY_USER_ID = 'KEY_USER_ID';
const KEY_EMAIL = 'KEY_EMAIL';
const KEY_PASSWORD = 'KEY_PASSWORD';
const KEY_NAME = 'KEY_NAME';

const initialState = {
  email: localStorage.getItem(KEY_EMAIL),
  password: localStorage.getItem(KEY_PASSWORD),
  user: null,
  name: null,
  token: null,
  data: null,
  showHistory: false,
  loadingHistory: true,
  historys: null,
  error: null,
  loading: false,
};

// check local storage
const storedToken = localStorage.getItem(KEY_TOKEN);
const user = localStorage.getItem(KEY_USER_ID);
const expire = localStorage.getItem(KEY_TOKEN_EXPIRE);
if (storedToken && expire < Date.now()) {
  // valid token
  initialState.token = storedToken;
  initialState.user = user;
  initialState.name = localStorage.getItem(KEY_NAME);
}

// reduce
export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.payload,
      };

    case UPDATE_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };

    case LOGIN_ERROR:
      return {
        ...state,
        error: 'Credentials Error',
      };

    case UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };

    case UPDATE_DATA:
      return {
        ...state,
        data: action.payload,
      };

    case UPDATE_HISTORY:
      return {
        ...state,
        historys: action.payload,
      };

    case UPDATE_SHOW_HISTORY:
      return {
        ...state,
        showHistory: action.payload,
      };
    case UPDATE_LOADING_HISTORY:
      return {
        ...state,
        loadingHistory: action.payload,
      };

    case RESET:
      return {
        ...state,
        name: null,
        token: null,
        data: null,
        loading: false,
        showHistory: false,
        loadingHistory: true,
        user: null,
        historys: null,
        error: 'Please login again',
      };

    case ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};


// action creator
export const fetchInformation = (sub, token) => (dispatch) => {
  dispatch({
    type: UPDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: UPDATE_DATA,
    payload: null,
  });

  dispatch({
    type: UPDATE_HISTORY,
    payload: null,
  });

  dispatch({
    type: UPDATE_SHOW_HISTORY,
    payload: false,
  });

  dispatch({
    type: UPDATE_LOADING_HISTORY,
    payload: true,
  });

  dispatch({
    type: ERROR,
    payload: null,
  });

  ReactGA.event({
    category: 'Action',
    action: 'Fetch Information',
  });

  http
    .get(`https://sevp.ice.gov/optapp/rest/students/${sub}`, token)
    .then((res) => {
      if (res && res.id) {
        return res;
      }
      throw new Error('No Valid Data');
    })
    .then((userData) => {
      dispatch({
        type: UPDATE_DATA,
        payload: userData,
      });

      const name = `${userData.givenName} ${userData.surName}`;
      localStorage.setItem(KEY_NAME, name);
      dispatch({
        type: UPDATE_NAME,
        payload: name,
      });
      dispatch({
        type: UPDATE_LOADING,
        payload: false,
      });
    })
    .catch(() => {
      // error, clear all
      localStorage.removeItem(KEY_NAME);
      localStorage.removeItem(KEY_TOKEN);
      localStorage.removeItem(KEY_USER_ID);
      localStorage.removeItem(KEY_TOKEN_EXPIRE);
      dispatch({
        type: RESET,
      });
    });
};

export const fecthHistory = (sub, token) => (dispatch) => {
  dispatch({
    type: UPDATE_SHOW_HISTORY,
    payload: true,
  });

  dispatch({
    type: UPDATE_LOADING_HISTORY,
    payload: true,
  });

  ReactGA.event({
    category: 'Action',
    action: 'Fetch History',
  });
  http
    .postWithToken(
      `https://sevp.ice.gov/optapp/rest/students/studentHistory/${sub}`,
      null,
      token,
    )
    .then(res => (Array.isArray(res) ? res : []))
    .then((historys) => {
      dispatch({
        type: UPDATE_LOADING_HISTORY,
        payload: false,
      });
      dispatch({
        type: UPDATE_HISTORY,
        payload: historys,
      });
    });
};

export const login = (email, password) => (dispatch) => {
  dispatch({
    type: UPDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ERROR,
    payload: null,
  });

  ReactGA.event({
    category: 'Action',
    action: 'Login',
  });

  http
    .post('https://sevp.ice.gov/optapp/rest/loginLogout/login', {
      email,
      password,
    })
    .then((res) => {
      if (res && res.value) {
        // login!!
        ReactGA.event({
          category: 'Action',
          action: 'Login Success',
        });

        // extract token:
        const base64Id = res.value.split('.')[1];
        const userInfo = JSON.parse(atob(base64Id));

        localStorage.setItem(KEY_TOKEN, res.value);
        localStorage.setItem(KEY_USER_ID, userInfo.sub);
        localStorage.setItem(KEY_TOKEN_EXPIRE, userInfo.exp);

        dispatch({
          type: UPDATE_USER,
          payload: {
            user: userInfo.sub,
            token: res.value,
          },
        });

        dispatch(fetchInformation(userInfo.sub, res.value));

        return true;
      }
      ReactGA.event({
        category: 'Action',
        action: 'Login Fail',
      });
      dispatch({
        type: LOGIN_ERROR,
      });
      dispatch({
        type: UPDATE_LOADING,
        payload: false,
      });
      return false;
    });
};

export const logout = () => (dispatch) => {
  dispatch({
    type: UPDATE_DATA,
    payload: null,
  });

  dispatch({
    type: UPDATE_HISTORY,
    payload: null,
  });

  dispatch({
    type: UPDATE_NAME,
    payload: null,
  });

  dispatch({
    type: UPDATE_USER,
    payload: {},
  });
  localStorage.removeItem(KEY_NAME);
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_USER_ID);
  localStorage.removeItem(KEY_TOKEN_EXPIRE);
};

export const updateEmail = email => (dispatch) => {
  localStorage.setItem(KEY_EMAIL, email);
  dispatch({
    type: UPDATE_EMAIL,
    payload: email,
  });
};

export const updatePassword = password => (dispatch) => {
  localStorage.setItem(KEY_PASSWORD, password);
  dispatch({
    type: UPDATE_PASSWORD,
    payload: password,
  });
};
