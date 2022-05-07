import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";

const Login = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const usersCollectionRef = collection(db, "users");
  const { userDispatch } = useUser();

  const googleSignInHandler = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userObj = {
        userName: result.user.displayName,
        email: result.user.email,
        id: result.user.uid,
      };
      const response = await getDocs(usersCollectionRef);
      const demoUsers = response.docs.map((doc) => ({
        ...doc.data(),
      }));
      const checkUser = demoUsers.find((user) => user.id !== userObj.id);
      if (checkUser) {
        await addDoc(usersCollectionRef, userObj);
      }
      userDispatch({ type: "SIGNIN", payload: userObj });
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={googleSignInHandler}>Google SignIn</button>;
};

export { Login };
