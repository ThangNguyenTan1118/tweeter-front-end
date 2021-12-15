import React, { useReducer, createContext } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AuthUser, User } from "../generated/graphql";

const initialState: {
  user: User | null;
} = {
  user: null,
};

type AuthJwtPayload = JwtPayload & User;

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(
    localStorage.getItem("jwtToken")!
  ) as AuthJwtPayload;

  if (decodedToken.exp! * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  // eslint-disable-next-line no-unused-vars
  login: (userData: AuthUser) => {},
  logout: () => {},
});

function authReducer(
  state: {
    user: AuthUser | null;
  },
  action: any
) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: AuthUser) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData.user,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
