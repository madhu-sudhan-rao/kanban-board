import { useContext, useEffect, useState } from "react";
import "./App.css";
import Column from "./components/column/Column";
import Header from "./components/header/Header";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { toast } from "sonner";
import AddColumn from "./components/addColumn/AddColumn";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase-config";
import SignInWithGoogle from "./components/signInWithGoogle/SignInWithGoogle";

function addColumnsToLocalStorage(columns) {
  if (columns && columns.length > 0) {
    localStorage.setItem("columnData", JSON.stringify(columns));
  }
}

function getColumnsFromLocalStorage() {
  try {
    const columns = localStorage.getItem("columnData");
    return columns ? JSON.parse(columns) : [];
  } catch (error) {
    console.error("Error parsing columns from local storage:", error);
    toast.error("Failed to load tasks!");
    return [];
  }
}

function App() {
  // const { userDetails, loading, columns } = useContext(UserContext);

  const [userDetails, setUserDetails] = useState(null);
  const [columnData, setColumnData] = useState(getColumnsFromLocalStorage());
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const handleSuccessSignIn = () => {
    console.log("Signed in successfully");

    setIsUserSignedIn(true);
    const localuserDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log("🚀 ~ useEffect ~ localuserDetails:", localuserDetails);
    if (localuserDetails) {
      setIsUserSignedIn(true);
      setUserDetails(localuserDetails);
      // getColumnsFromLocalStorage();
      getColumnsOfUser(localuserDetails.uid);
    }
  };

  const getAllColumns = async () => {
    try {
      const colRef = collection(db, "columns");

      const querySnapshot = await getDocs(colRef);

      const columns = [];

      querySnapshot.forEach((doc) => {
        columns.push({ id: doc.id, ...doc.data() });
      });
      return columns;
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const getColumnsOfUser = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedColumns = docSnap.data();
        console.log("🚀 ~ getColumnsOfUser ~ fetchedColumns:", fetchedColumns);
        setColumnData(
          Array.isArray(fetchedColumns.columns) ? fetchedColumns.columns : []
        );
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ userDetails:", userDetails);
    const localuserDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log("🚀 ~ useEffect ~ localuserDetails:", localuserDetails);
    if (localuserDetails) {
      setIsUserSignedIn(true);
      setUserDetails(localuserDetails);
      // getColumnsFromLocalStorage();
      getColumnsOfUser(localuserDetails.uid);
    }
  }, []);


  const openAddColumnDialog = () => {
    setIsAddColumnDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddColumnDialogOpen(false);
  };

  const addColumn = (column) => {
    const updatedColumns = [...columnData, column];
    setColumnData(updatedColumns);
    setIsAddColumnDialogOpen(false);
  };

  const updateColumnData = (columnKey, newData) => {
    setColumnData(
      columnData.map((column) =>
        column.value === columnKey
          ? { ...column, data: newData, count: newData.length }
          : column
      )
    );
  };

  useEffect(() => {
    if (columnData && columnData.length > 0) {
      localStorage.setItem("columnData", JSON.stringify(columnData));
    }
  }, [columnData]);

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

          <Header />
          <div className="main">
            <div className=" border-red-100">
              <TooltipProvider className="dark">
                <Tooltip className="dark">
                  <TooltipTrigger className="dark" asChild>
                    <Button
                      className="dark add-column-button"
                      size="icon"
                      variant="outline"
                      onClick={openAddColumnDialog}
                    >
                      <Plus className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="dark">Add column</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AddColumn
                isOpen={isAddColumnDialogOpen}
                onClose={handleDialogClose}
                onSaveColumn={addColumn}
              />
            </div>
            <div className="columns flex gap-3">
              {columnData.map((column, index) => (
                <Column
                  title={column.title}
                  count={column.count}
                  key={index}
                  // tasks={tasks.filter((task) => task.status === column?.title)}
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
