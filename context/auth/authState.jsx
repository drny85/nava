import React, { useReducer } from "react";
import authReducer from "./authReducer";
import AuthContext from "./authContext";

import { auth, db } from "../../services/database";
import { SET_LOADING, SIGNUP, LOGOUT } from "../types";

const AuthState = (props) => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const signup = async (email, password) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  };

  const setUser = async (userInfo) => {
    try {
      const data = db
        .collection("appUser")
        .doc(userInfo.id)
        .set({ ...userInfo, createdAt: new Date().toISOString() });
      dispatch({ type: SIGNUP, payload: userInfo });
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    setLoading();
    await auth.signOut();
    dispatch({ type: LOGOUT });
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        signup,
        logout,
        setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
