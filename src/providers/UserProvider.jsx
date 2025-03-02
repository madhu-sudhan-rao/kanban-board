import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { auth, db } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";

// UserProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// Create the UserContext
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // Fetch user details from Firestore
  const fetchUserData = async (uid) => {
    console.log("🚀 ~ fetchUserData ~ uid:", uid)
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedColumns = docSnap.data()
        setColumns(fetchedColumns);
        localStorage.setItem("columnData", JSON.stringify(fetchedColumns.columns))
      } else {
        console.log("No such document!");
      }
      console.log("🚀 ~ fetchUserData ~ docSnap.data():", docSnap.data());
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    if(localStorage.getItem("userDetails")) {
        const user = JSON.parse(localStorage.getItem("userDetails"));
        console.log("🚀 ~ useEffect ~ user:", user)
      setUserDetails(user);
      fetchUserData(user.uid);
      setLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("🚀 ~ unsubscribe ~ user:", user)
        setUserDetails(user);
        fetchUserData(user.uid);
      } else {
        setUserDetails(null);
        setLoading(false);
        localStorage.removeItem("userDetails");
        localStorage.removeItem("columnData");
        setColumns([]);
        localStorage.clear()
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, loading, columns }}>
      {children}
    </UserContext.Provider>
  );
};
