import * as http from "./http.js";

export const INCREMENT_REQUESTED = "counter/INCREMENT_REQUESTED";
export const INCREMENT = "counter/INCREMENT";
export const DECREMENT_REQUESTED = "counter/DECREMENT_REQUESTED";
export const DECREMENT = "counter/DECREMENT";

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const UPDATE_LOADING = "UPDATE_LOADING";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_DATA = "UPDATE_DATA";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const RESET = "RESET";

const KEY_TOKEN = "KEY_TOKEN";
const KEY_TOKEN_EXPIRE = "KEY_TOKEN_EXPIRE";
const KEY_USER_ID = "KEY_USER_ID";
const KEY_EMAIL = "KEY_EMAIL";
const KEY_PASSWORD = "KEY_PASSWORD";

const initialState = {
  email: "",
  password: "",
  user: null,
  token: null,
  data: null,
  error: null,
  loading: false
};

//TEST
initialState.user = "5ab78d1c9607ec2df547a542";
initialState.data = {
  id: "5ab78d1c9607ec2df547a542",
  givenName: "Mang",
  surName: "Yang",
  email: "yangmang@gwu.edu",
  confirmHash: "7f29134f-0abe-43de-8ec7-001f6500035c",
  confirmHashCreationDate: 1521978652944,
  confirmHashExpirationDate: 1524657052944,
  sevisId: "N0011404096",
  studentIdentifier: "8252170",
  registerState: "REGISTERED",
  registerFailureCount: 0,
  modificationDate: 1523930837387,
  modifyingUserId: "5ab78d1c9607ec2df547a542",
  modifyingRole: "STUDENT",
  modifyMessage: "",
  dateOfBirth: 650541600856,
  homeAddress: {
    streetAddress: "7911 Westpark Dr",
    address2: "#1402",
    city: "McLean",
    state: "VA",
    zipCode: "22102",
    poBox: null,
    borderCommuter: false,
    missedValidation: false
  },
  mailingAddress: null,
  countryCode: "1",
  foreignPhone: "867286490006",
  phone: "2025380005",
  noNumber: false,
  statusCode: "ACTIVE",
  employmentAuthorizations: [
    {
      sevisEmploymentId: "4140019",
      authorizationSchedule: "FULLTIME",
      authorizationType: "POSTCOMPLETION",
      authorizationState: "ACTIVE",
      startDate: 1464602400856,
      endDate: 1496052000856,
      employmentRemarks:
        "The student is requesting OPT employment authorization.  The student intends to seek a position in the area of Computer Science. This proposed training is directly related to the student's field and is commensurate with the student's level of study.",
      deleteFlag: false,
      employerCount: 1,
      employers: [
        {
          sevisEmployerId: 4438557,
          employerIdentificationNumber: "",
          name: "Xteros Inc.",
          jobTitle: "",
          supervisorFirstName: "",
          supervisorLastName: "",
          supervisorTelephoneNumber: "",
          supervisorTelephoneNumberExt: "",
          supervisorEmail: "",
          employmentSchedule: "FULL TIME",
          relationToField:
            "The position of Software Engineer will allow me to apply the knowledge I acquired while pursuing a degree in Computer Science and to gain practical training in that field by performing the following duties and tasks: website system development.",
          employerNumber: 1,
          deletedFlag: false,
          isSelfEmployedInd: false,
          address: {
            streetAddress: "15201 SHADY GROVE RD",
            address2: "103",
            city: "ROCKVILLE",
            state: "MD",
            zipCode: "20850",
            poBox: null,
            borderCommuter: null,
            missedValidation: false
          },
          startDate: 1464775200856,
          endDate: null
        }
      ]
    },
    {
      sevisEmploymentId: "6336565",
      authorizationSchedule: "FULLTIME",
      authorizationType: "STEM",
      authorizationState: "ACTIVE",
      startDate: 1496138400856,
      endDate: 1559124000856,
      employmentRemarks:
        "The student is requesting OPT employment authorization.  The student intends to seek a position in the area of Computer Science. This proposed training is directly related to the student's field and is commensurate with the student's level of study.",
      deleteFlag: false,
      employerCount: 2,
      employers: [
        {
          sevisEmployerId: 6227676,
          employerIdentificationNumber: "471051092",
          name: "xTeros Inc.",
          jobTitle: "Software Engineer",
          supervisorFirstName: "William",
          supervisorLastName: "Wynn",
          supervisorTelephoneNumber: "3012767121",
          supervisorTelephoneNumberExt: "",
          supervisorEmail: "william.wynn@xteros.com",
          employmentSchedule: "FULL TIME",
          relationToField:
            "I have reviewed the Form I-983. It is completed signed and addresses all program requirements.",
          employerNumber: 1,
          deletedFlag: false,
          isSelfEmployedInd: false,
          address: {
            streetAddress: "15201 SHADY GROVE RD",
            address2: "103",
            city: "ROCKVILLE",
            state: "MD",
            zipCode: "20850",
            poBox: null,
            borderCommuter: null,
            missedValidation: false
          },
          startDate: 1496138400856,
          endDate: 1510394400856
        },
        {
          sevisEmployerId: 7747425,
          employerIdentificationNumber: "510323571",
          name: "MICROSTRATEGY INCORPORATED",
          jobTitle: "Software Engineer",
          supervisorFirstName: "Joty",
          supervisorLastName: "Paparello",
          supervisorTelephoneNumber: "7038488600",
          supervisorTelephoneNumberExt: "",
          supervisorEmail: "jpaparello@microstrategy.com",
          employmentSchedule: "FULL TIME",
          relationToField:
            "I have reviewed the Form I-983. It is completed signed and addresses all program requirements.",
          employerNumber: 2,
          deletedFlag: false,
          isSelfEmployedInd: false,
          address: {
            streetAddress: "1850 TOWERS CRESCENT PLZ",
            address2: "",
            city: "TYSONS CORNER",
            state: "VA",
            zipCode: "22182",
            poBox: null,
            borderCommuter: null,
            missedValidation: false
          },
          startDate: 1510567200856,
          endDate: 1559124000856
        }
      ]
    }
  ]
};

//check local storage
const token = localStorage.getItem(KEY_TOKEN);
const user = localStorage.getItem(KEY_USER_ID);
const expire = localStorage.getItem(KEY_TOKEN_EXPIRE);
if (token && expire < Date.now()) {
  //valid token
  initialState.token = token;
  initialState.user = user;
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
        error: "Credential Error"
      };

    case UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };

    case UPDATE_DATA:
      return {
        ...state,
        data: action.payload
      };

    case RESET:
      return {
        ...initialState,
        error: "Please login again"
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
    http
      .post("http://localhost:3000/api/user/auth", { email, password })
      .then(res => {
        console.log(res);
        res = {
          value:
            "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiU1RVREVOVCIsInN1YiI6IjVhYjc4ZDFjOTYwN2VjMmRmNTQ3YTU0MiIsImV4cCI6MTUyNDAxMTE2NiwiaWF0IjoxNTIzOTkzMTY2fQ.lNi1zGlUp1Sn91ORKl_7QBFPQQWtiPmfky8Pppe9q7A0fKkORXNVNQRiQvr49u5u7YdtfeNyhsAZRvBYD7KG4w"
        };
        if (res && res.value) {
          // login!!
          http.setToken(res.value);

          // extrack token:
          const base64Id = res.value.split(".")[1];
          const userInfo = JSON.parse(atob(base64Id));
          //userInfo: {role: "STUDENT", sub: "5ab78d1c9607ec2df547a542", exp: 1524011166, iat: 1523993166}

          dispatch({
            type: UPDATE_USER,
            payload: userInfo.sub
          });

          dispatch(fetchInformation(userInfo.sub));

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

export const fetchInformation = sub => {
  return dispatch => {
    http.get("https://sevp.ice.gov/optapp/rest/students/" + sub).then(res => {
      if (res && res.id) {
        dispatch({
          type: UPDATE_DATA,
          payload: res
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
    dispatch({
      type: UPDATE_EMAIL,
      payload: email
    });
  };
};

export const updatePassword = password => {
  return dispatch => {
    dispatch({
      type: UPDATE_PASSWORD,
      payload: password
    });
  };
};
