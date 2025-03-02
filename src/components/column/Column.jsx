import { useState } from "react";
import Task from "../task/Task";
import { Badge } from "../ui/badge";
import "./Column.css";
import PropTypes from "prop-types";
import TaskSheet from "../taskSheet/TaskSheet";
import { Button } from "../ui/button";
import { Ellipsis, Plus } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import AddColumn from "../addColumn/AddColumn";

Column.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  key: PropTypes.number,
  tasks: PropTypes.array,
  onTasksChange: PropTypes.func,
};

// Column.defaultProps = {
//   title: "To-do",
//   count: 0,
//   key: 0,
//   tasks: [],
//   onTasksChange: () => {},
// };



function Column({ title, count, tasks, onTasksChange, onColumnEdit }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen ] = useState(false)

  const openAddColumnDialog = () => {
    setIsAddColumnDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsAddColumnDialogOpen(close)
  }

  const addColumn = (column) => {
    console.log("🚀 ~ addColumn ~ column:", column)
    // const updatedColumns = [...columnData, column];
    // setColumnData(updatedColumns)
    setIsAddColumnDialogOpen(false)
    // onColumnEdit({
    //   title: 
    // })
    
  }

  const columnMenu = [
    {
      title: "Edit Column",
      disable: false,
      value: "edit",
      click: (value) => {
        setIsAddColumnDialogOpen(true)
      },
      styleClass: "default",
    },
    {
      title: "Delete",
      disable: false,
      value: "delete",
      click: (value) => {
        console.log(`Clicked ${value}`);
      },
      styleClass: "danger",
    },
  ];
  
  // const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  // const handleColumnMenuOpen = () => {
  //   setIsColumnMenuOpen(true);
  // };

  // const handleColumnMenuClose = () => {
  //   setIsColumnMenuOpen(false);
  // };

  // const handleColumnMenuOptionClick = () => {
  //   console.log("Clicked");
  // };

  const handleSheetOpen = (task) => {
    setIsSheetOpen(true);
    setSelectedTask(task);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (task, sheetType) => {
    if (sheetType === "edit") {
      const matchedTask = tasks?.find((t) => t?.id === task?.id);
      if (matchedTask) {
        const newTasks = tasks?.map((t) => (t?.id === task?.id ? task : t));
        tasks = newTasks;
        showToast("Task updated successfully!");
        onTasksChange(newTasks, title);
      }
    } else {
      // tasks.push(task);
      tasks = [...tasks, task];
      showToast("Task added successfully!");
      onTasksChange(tasks, title);
    }

    handleSheetClose(null);
  };

  const showToast = (message) => {
    toast.success(message);
  };

  return (
    <div className="column">
      <div className="column-header">
        <div className="col-head-prefix"></div>
        <div className="col-head-center">
          <div className="title">{title}</div>
          <Badge className="dark">{count}</Badge>
        </div>
        <div className="col-head-suffix">
          {/* <Dropdown isOpen={isColumnMenuOpen} list={columnMenu} onClose={handleColumnMenuClose}  /> */}

          <AddColumn
            isOpen={isAddColumnDialogOpen}
            onClose={handleDialogClose}
            onSaveColumn={addColumn}
            columnDetails={title}
          />

          <DropdownMenu className="dark">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="dark"
                size="icon"
                // onClick={handleColumnMenuOpen}
              >
                <Ellipsis className="dark button-icon" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark">
            <DropdownMenuGroup>
                    {
                        columnMenu.map((option, index) => (
                            <DropdownMenuItem className={option?.styleClass}  key={index} disabled={option?.disabled} onClick={() => option?.click(option?.value)}>
                                <span >{(option?.title && !option?.subMenu) && option?.title}</span>
                                {option.shortcut && <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut> }

                                {option?.subMenu &&
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>{option?.title}</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {
                                                        option?.subMenu?.map((subMenuOption, subMenuIndex) => (
                                                            <DropdownMenuItem key={subMenuIndex} disabled={subMenuOption?.disabled} >
                                                                {subMenuOption?.title}
                                                            </DropdownMenuItem>

                                                        ))
                                                    }
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>


                                    </DropdownMenuSub>
                                }
                                
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            className="dark"
            size="icon"
            onClick={() => handleSheetOpen(null)}
          >
            <Plus className="dark button-icon" />
          </Button>
        </div>
      </div>
      <div className="tasks">
        <Task tasks={tasks || []} onTaskClick={handleSheetOpen} />
      </div>

      <TaskSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        sheetType={selectedTask ? "edit" : "add"}
        task={selectedTask}
        onAddTask={handleAddTask}
      />
    </div>
  );
}

export default Column;
