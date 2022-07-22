// Hook (use-auth.js)
import React, { useContext, createContext } from "react";

const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({
  children,
  userData,
  userSignIn,
  userSignUp,
  userSignOut,
  isLoggedIn,
  resetUserError
}) {
  const auth = {
    userData,
    isLoggedIn,
    userSignIn,
    userSignUp,
    userSignOut,
    resetUserError
  }
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};