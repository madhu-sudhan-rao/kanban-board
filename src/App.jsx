import { useEffect, useState } from "react";
import "./App.css";
import Column from "./components/column/Column";
import Header from "./components/header/Header";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { toast } from "sonner";
import AddColumn from "./components/addColumn/AddColumn";

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
    toast.error("Failed to load tasks!")
    return [];
  }
}

function App() {

  const [columnData, setColumnData] = useState(getColumnsFromLocalStorage())
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen ] = useState(false)

  const openAddColumnDialog = () => {
    setIsAddColumnDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsAddColumnDialogOpen(close)
  }

  const addColumn = (column) => {
    const updatedColumns = [...columnData, column];
    setColumnData(updatedColumns)
    setIsAddColumnDialogOpen(false)
  }



  const updateColumnData = (columnKey, newData) => {
      setColumnData(
        columnData.map((column) =>
          column.value === columnKey ? { ...column, data: newData, count: newData.length } : column
        )
      );
  };

  useEffect(() => {
    if (columnData && columnData.length > 0) {
      localStorage.setItem("columnData", JSON.stringify(columnData));
    }
  }, [columnData])



  const handleTasksArrayChange = (updatedTasks, taskType) => {
    updateColumnData(taskType.split(' ').join('').toLowerCase(), updatedTasks)
  };

  useEffect(() => {
    addColumnsToLocalStorage(columnData);
  }, [columnData]);

  return (
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
              <TooltipContent className="dark">
                Add column
              </TooltipContent>
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
              tasks={column.data}
              onTasksChange={handleTasksArrayChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
