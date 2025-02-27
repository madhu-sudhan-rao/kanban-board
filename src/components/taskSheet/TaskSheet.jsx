import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import moment from "moment";

TaskSheet.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  sheetType: PropTypes.string,
  task: PropTypes.object,
  onAddTask: PropTypes.func,
};

const statuses = [
  {
    value: "todo",
    label: "To Do",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
];
const priorities = [
  {
    value: "low",
    label: "Low",
    class: "text-green-600",
  },
  {
    value: "medium",
    label: "Medium",
    class: "text-yellow-600",
  },
  {
    value: "high",
    label: "High",
    class: "text-red-600",
  },
];

const generateId = () => {
  const timestamp = Date.now();
  const datacenterId = 0; // Example datacenter ID
  const machineId = 0; // Example machine ID
  const sequenceNumber = 0; // Example sequence number

  const taskId =
    (timestamp << 23) |
    (datacenterId << 18) |
    (machineId << 13) |
    sequenceNumber;
  return taskId;
};


function TaskSheet({ isOpen, onClose, sheetType, task, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [newTask, setNewTask] = useState({});

  const handleSubmit = () => {
    const formattedDueDate = dueDate ? moment(dueDate).format("DD-MM-YYYY HH:mm:ss") : null; // Format only if dueDate exists
    const updatedNewTask = { ...newTask, dueDate: formattedDueDate };
    
    if (sheetType === "add") {
      const taskId = generateId();
      const taskData = { ...updatedNewTask, id: taskId };
      onAddTask(taskData, sheetType);
    } else {
      const taskData = { ...updatedNewTask, id: task?.id };
      onAddTask(taskData, sheetType);
    }
  };

  useEffect(() => {
    if (task && sheetType === "edit") {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(
        statuses?.find(
          (s) => s.label?.toLowerCase() === task.status?.toLowerCase()
        )?.label
      );
      setPriority(
        priorities?.find(
          (p) => p.label?.toLowerCase() === task.priority?.label.toLowerCase()
        )
      );
      setDueDate(task.dueDate);
      setNewTask(task);
    } else {
      setTitle("");
      setDescription("");
      setStatus("");
      setPriority("");
      setDueDate(null);
      setNewTask({});
    }
  }, [task, sheetType]);

  useEffect(() => {
    setNewTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? moment(dueDate).format("DD-MM-YYYY HH:mm:ss") : null, // Format here to update newTask
    });
  }, [title, description, status, priority, dueDate]);

  const checkTaskForm = useCallback(() => {
    if (title && description && status && priority && dueDate) {
      setAddButtonDisabled(false);
    } else {
      setAddButtonDisabled(true);
    }
  }, [title, description, status, priority, dueDate]);

  useEffect(() => {
    // check the values and update the add button disability
    checkTaskForm();
  }, [title, description, status, priority, dueDate]);

  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
    setDueDate(date);
  };
  
  return (
    <Sheet className="dark" open={isOpen} onOpenChange={onClose}>
      <SheetContent className="dark">
        <SheetHeader className={"dark"}>
          <SheetTitle className={"dark"}>
            {sheetType === "add" ? "Add Task" : "Edit Task"}
          </SheetTitle>
          <SheetDescription className={"dark"}>
            {sheetType === "add"
              ? "Enter task details to add a new task."
              : "Edit task details."}
          </SheetDescription>
        </SheetHeader>

        <div className="grid w-full max-w-sm items-center gap-1.5 mt-2 ">
          <label className="dark text-white text-sm" htmlFor="title">
            Title
          </label>
          <Input
            className="dark text-white"
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
          <label className="dark text-white text-sm" htmlFor="description">
            Description
          </label>
          <Input
            className="dark text-white"
            type="text"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
          <label className="dark text-white text-sm" htmlFor="status">
            Status
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="dark text-white">
              <Button variant="outline" className="text-left justify-start">
                {status || "Select Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark w-full">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => setStatus(status.label)}
                >
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
          <label className="dark text-white text-sm" htmlFor="priority">
            Priority
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="dark text-white">
              <Button
                variant="outline"
                className={priority?.class + "text-left justify-start"}
              >
                <span className={priority?.class}>
                  {priority?.label || "Select Priority"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark w-full">
              {priorities.map((priority) => (
                <DropdownMenuItem
                  key={priority?.value}
                  onClick={() => setPriority(priority)}
                >
                  {priority?.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
          <label className="dark text-white text-sm" htmlFor="due-date">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal text-white",
                  !dueDate && "text-muted-foreground"
                )}
              >
                {dueDate ? (
                  moment(dueDate).format("DD-MM-YYYY")
                ) : (
                  <span>Select due date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 dark" align="start">
              <Calendar
                className={"dark text-white"}
                mode="single"
                selected={dueDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <SheetFooter className="mt-4">
          <Button
            variant="default"
            onClick={() => handleSubmit()}
            disabled={addButtonDisabled}
          >
            {sheetType === "add" ? "Add" : "Update"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            <span className="text-white">Cancel</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TaskSheet;
