import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "./App.css";
import AddColumn from "./components/addColumn/AddColumn";
import Column from "./components/column/Column";
import Header from "./components/header/Header";
import SignInWithGoogle from "./components/signInWithGoogle/SignInWithGoogle";
import { Toaster } from "./components/ui/sonner";
import { db } from "./firebase-config";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [columnData, setColumnData] = useState([]);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const handleSuccessSignIn = () => {
    console.log("Signed in successfully");
    setIsUserSignedIn(true);
    const localUserDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (localUserDetails) {
      setUserDetails(localUserDetails);
      getColumnsOfUser(localUserDetails.uid);
    }
  };

  // Get columns from Firestore for the current user
  const getColumnsOfUser = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Ensure each column has all required properties
        const columns = Array.isArray(userData.columns) ? userData.columns : [];
        const validatedColumns = columns.map(column => ({
          ...column,
          data: Array.isArray(column.data) ? column.data : [],
          count: column.count || column.data?.length || 0
        }));
        
        setColumnData(validatedColumns);
        
        // Also update localStorage as backup
        if (validatedColumns.length > 0) {
          localStorage.setItem("columnData", JSON.stringify(validatedColumns));
        }
      } else {
        // Create a new user document if it doesn't exist
        await setDoc(docRef, { columns: [] });
        setColumnData([]);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load tasks from cloud!");
      
      // Fallback to localStorage if Firestore fails
      try {
        const columns = localStorage.getItem("columnData");
        if (columns) {
          const parsedColumns = JSON.parse(columns);
          // Validate columns from localStorage too
          const validatedColumns = parsedColumns.map(column => ({
            ...column,
            data: Array.isArray(column.data) ? column.data : [],
            count: column.count || column.data?.length || 0
          }));
          setColumnData(validatedColumns);
        }
      } catch (parseError) {
        console.error("Error parsing columns from local storage:", parseError);
      }
    }
  };

  // Update user's columns in Firestore
  const updateUserColumns = async (columns) => {
    if (!userDetails) return;
    
    try {
      const userRef = doc(db, "users", userDetails.uid);
      await updateDoc(userRef, {
        columns: columns
      });
      
      // Also update localStorage as backup
      localStorage.setItem("columnData", JSON.stringify(columns));
    } catch (error) {
      console.error("Error updating columns in Firestore:", error);
      toast.error("Failed to sync with cloud!");
      
      // Still update localStorage even if Firestore fails
      localStorage.setItem("columnData", JSON.stringify(columns));
    }
  };

  useEffect(() => {
    const localUserDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (localUserDetails) {
      setIsUserSignedIn(true);
      setUserDetails(localUserDetails);
      getColumnsOfUser(localUserDetails.uid);
    }
  }, []);

  const openAddColumnDialog = () => {
    setIsAddColumnDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddColumnDialogOpen(false);
  };

  // Add a new column and update Firestore
  const addColumn = async (column) => {
    // Ensure the new column has all required properties
    const newColumn = {
      ...column,
      data: Array.isArray(column.data) ? column.data : [],
      count: column.count || column.data?.length || 0
    };
    
    const updatedColumns = [...columnData, newColumn];
    setColumnData(updatedColumns);
    setIsAddColumnDialogOpen(false);
    
    // Update Firestore
    await updateUserColumns(updatedColumns);
  };

  // Update column data and sync with Firestore
  const updateColumnData = async (columnKey, newData) => {
    const updatedColumns = columnData.map((column) =>
      column.value === columnKey
        ? { 
            ...column, 
            data: Array.isArray(newData) ? newData : [], 
            count: newData.length 
          }
        : column
    );
    
    setColumnData(updatedColumns);
    
    // Update Firestore
    await updateUserColumns(updatedColumns);
  };

  const handleTasksArrayChange = (updatedTasks, taskType) => {
    updateColumnData(taskType.split(" ").join("").toLowerCase(), updatedTasks);
  };

  return (
    <>
      {!userDetails && !isUserSignedIn && (
        <div className="app">
          <SignInWithGoogle signInSuccess={handleSuccessSignIn} />
        </div>
      )}
      {userDetails && isUserSignedIn && (
        <div className="app">
          <Toaster className="dark" />

          <Header onAddColumnClick={openAddColumnDialog} />
          <div className="main">
            <AddColumn
              isOpen={isAddColumnDialogOpen}
              onClose={handleDialogClose}
              onSaveColumn={addColumn}
            />
            <div className="columns flex gap-3">
              {columnData.map((column, index) => (
                <Column
                  title={column.title}
                  count={column.count || 0}
                  key={index}
                  tasks={Array.isArray(column.data) ? column.data : []}
                  onTasksChange={handleTasksArrayChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;