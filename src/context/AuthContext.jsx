"use client";
import { auth, db } from "@/app/firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { onValue, push, ref, remove, set, update } from "firebase/database";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  const [success, setSuccess] = useState(null);


// get current user
  useEffect(() =>{
  try {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setCurrentUser(currentuser);
    });
    return () => unsubscribe();
    
  } catch (error) {
    throw error
  }
  },[])

//   get current tasks


  // auth email pass
  const emailPassRegister = async (name,email, pass) => {
    setLoading(true);
    try {
      const registerResponse = await createUserWithEmailAndPassword(
        auth,
        email,
        pass,
      );
      const finalResponse = registerResponse?.user;

      await set(ref(db, `user/${finalResponse.uid}`), {
        uid: finalResponse.uid,
        name: name || "",
        email: finalResponse.email,
      });
      setCurrentUser(finalResponse);
      console.log("registered", finalResponse);
      setLoading(false);
      setError(null);
      router("/")
    } catch (error) {
      setError(error?.message);
      setLoading(false);
    }
  };

  const emailPassLogin = async (email, pass) => {
    setLoading(true);
    try {
      const registerResponse = await signInWithEmailAndPassword(
        auth,
        email,
        pass,
      );
      const finalResponse = registerResponse?.user;
      setCurrentUser(finalResponse);
      console.log("registered", finalResponse);
      setLoading(false);
       router("/");
    } catch (error) {
      setError(error?.message);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  //   auth google
  const googleAuthProvider = new GoogleAuthProvider();

  const googleLogin = async () => {
    setLoading(true);

    try {
      const googleLoginResponse = await signInWithPopup(
        auth,
        googleAuthProvider,
      );

      const finalResponse = googleLoginResponse.user;

      await set(ref(db, `user/${finalResponse.uid}`), {
        uid: finalResponse.uid,
        name: finalResponse.displayName || "",
        email: finalResponse.email,
        photoURL: finalResponse.photoURL || "",
      });

      setCurrentUser(finalResponse);
      setError(null);
       router("/");
       
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // task
  const addTask = async (task, userId) => {
    setLoading(true);
    const finalResponse = {
      task,
      userId,
    };
    try {
      await push(ref(db, "task"), finalResponse);
      setLoading(false);
      setSuccess("Task created Successfully");
      setError(null);
      setTask(finalResponse);
    } catch (error) {
      setSuccess(null);
      setLoading(false);
      setError(error?.message);
    }
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const { id, ...rest } = task;
      await update(ref(db, `task/${id}`), rest);
      setLoading(false);
      setSuccess("updated successfully");
      setError(null);
    } catch (error) {
      setError(error?.message);
      setLoading(false);
      setSuccess(null);
    }
  };

  const deleteTask = async (task) => {
    setLoading(true);
    try {
      const { id } = task;
      await remove(ref(db, `task/${id}`));
      setLoading(false);
      setSuccess("updated successfully");
      setError(null);
    } catch (error) {
      setError(error?.message);
      setLoading(false);
      setSuccess(null);
    }
  };

  const values = {
    emailPassRegister,
    emailPassLogin,
    googleLogin,
    logOut,
    addTask,
    updateTask,
    deleteTask,
    currentUser,
    loading,
    error,
    task,
    success,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () =>{
   return useContext(AuthContext)
}