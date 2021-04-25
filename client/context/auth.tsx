import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { User } from "../types";

import Axios from "axios";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispathContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: payload,
      };
    default:
      throw new Error(`Unknown Action type : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    authenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    Axios.get("/auth/isAuthenticated")
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.data });
        dispatch({ type: "STOP_LOADING", payload: false });
      })
      .catch((error) => {
        console.log("Error While Checking Auth");
        dispatch({ type: "STOP_LOADING", payload: false });
      });
  }, []);
  return (
    <DispathContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispathContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispath = () => useContext(DispathContext);
