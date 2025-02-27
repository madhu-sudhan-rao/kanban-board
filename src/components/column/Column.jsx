import { useState } from "react";
import Task from "../task/Task";
import { Badge } from "../ui/badge";
import "./Column.css";
import PropTypes from "prop-types";
import TaskSheet from "../taskSheet/TaskSheet";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

Column.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  key: PropTypes.number,
  tasks: PropTypes.array,
  onTasksChange: PropTypes.func,
};

Column.defaultProps = {
  title: "To-do",
  count: 0,
  key: 0,
  tasks: [],
  onTasksChange: () => {},
};



function Column({ title, count, tasks, onTasksChange }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSheetOpen = (task) => {
    setIsSheetOpen(true);
    setSelectedTask(task);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (task, sheetType) => {
    console.log("🚀 ~ handleAddTask ~ task:", task)
    // search for existing task

    if(sheetType === "edit") {
      const matchedTask = tasks?.find(t => t?.id === task?.id);
      if(matchedTask) {
        const newTasks = tasks?.map(t => t?.id === task?.id ? task : t);
        console.log("🚀 ~ handleAddTask ~ newTasks:", newTasks)
        tasks = newTasks
        showToast('Task updated successfully!')
        onTasksChange(newTasks, title)
      } 
    } else {
      // tasks.push(task);
      tasks = [...tasks, task];
      showToast('Task added successfully!')
      onTasksChange(tasks, title)
    }

    handleSheetClose(null);
  };

  const showToast = (message) => {
    toast.success(message)
  }

  return (
    <div className="column">
      <div className="column-header">
        <div className="col-head-prefix"></div>
        <div className="col-head-center">
          <div className="title">{title}</div>
          <Badge className="dark">{count}</Badge>
        </div>
        <div className="col-head-suffix">
          <Button variant="ghost" className="dark" size="icon" onClick={() => handleSheetOpen(null)}>
            <Plus className="text-white"  />
          </Button>
     
        </div>
      </div>
      <div className="tasks">
        <Task tasks={tasks} onTaskClick={handleSheetOpen} />
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
