import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/axiosPublic";
import useAxiosSecure from "../hooks/useAxiosSecure";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosSecure.get("/check-auth");
        if (res.data.authenticated) {
            setUser(res.data.user);
        } else {
            setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [axiosSecure]);

  const createUser = async (email, password, name = "", otherData = {}) => {
    // 1. Register user
    const res = await axiosPublic.post("/add-user", {
      email,
      password,
      name,
      ...otherData
    });
    // Optional: Auto login after creation? 
    // For now we just return the result, user will redirect to login or we login here.
    // Let's keep it defined by the caller, but often caller expects a promise.
    return res;
  };

  const signIn = async (email, password) => {
    const res = await axiosPublic.post("/login", { email, password });
    if (res.data.user) {
        setUser(res.data.user);
    }
    return res;
  };

  const logOut = async () => {
    try {
      await axiosSecure.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateUser = async (userInfo) => {
    if (!user?._id && !user?.id) return;
    const id = user._id || user.id;
    // We assume userInfo contains fields to update
    const res = await axiosSecure.patch(`/update-user/${id}`, userInfo);
    // Refresh user data
    if (res.status === 200) {
       const userRes = await axiosSecure.get("/get-user");
       setUser(userRes.data);
    }
    return res;
  };

  // Google Sign In - Removed for Session Auth migration as requested
  // Implementing Google Auth with Session requires backend OAuth flow (Passport.js etc)
  const googleSignIn = async () => {
      console.warn("Google Sign In not implemented for Session Auth yet");
      throw new Error("Google Sign In not available");
  };

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    setUser,
    logOut,
    googleSignIn,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
