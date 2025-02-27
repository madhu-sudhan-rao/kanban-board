import PropTypes from "prop-types";
import './Task.css'
import moment from 'moment';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";


Task.propTypes = {
  tasks: PropTypes.array,
  onTaskClick: PropTypes.func,
};

Task.defaultProps = {
  tasks: [],
  onTaskClick: () => {}
};

function Task({ tasks, onTaskClick }) {

    const formatDateTime = (dateTime) => {
        const newDateTime = moment(dateTime).format('DD-MM-YYYY HH:mm:ss');
        return newDateTime
    }
    
    
  return (
    <>
      <div className="tasks flex flex-col gap-2 cursor-pointer">
        {tasks.map((task) => (
            <Card className="dark task-card" key={task?.id} onClick={() => onTaskClick(task)}>
                <CardHeader>
                    <CardTitle>{task?.title}</CardTitle>
                    <CardDescription>{task?.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="created-at">
                        {formatDateTime(task?.createdAt)}
                    </div>
                </CardFooter>
            </Card>
        ))}
      </div>
    </>
  );
}

export default Task;
