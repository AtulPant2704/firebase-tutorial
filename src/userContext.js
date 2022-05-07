import { createContext, useContext, useReducer, useEffect } from "react";
import { userReducer } from "./userReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.config";

const initialState = {
  userName: "",
  email: "",
  id: "",
};

const UserContext = createContext(initialState);

const UserProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        const userObj = {
          userName: data.displayName,
          email: data.email,
          id: data.uid,
        };
        userDispatch({ type: "SIGNIN", payload: userObj });
        console.log("logged in");
      } else {
        console.log("logged out");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { useUser, UserProvider };
