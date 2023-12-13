import React, { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as Close } from '../../assets/icons/close.svg';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import './style.scss';
import PropTypes from 'prop-types';
import {Task, Task as TaskInterface} from '../../Task';

interface AddEditTaskFormProps {
  show: boolean;
  onClose: () => void;
  onAddTask: (task: TaskInterface) => void;
  onEditTask: (taskId: any, updatedTask: TaskInterface) => void;
  taskToEdit?: any;
}

const AddEditTaskForm: React.FC<AddEditTaskFormProps> = ({
                                                           show,
                                                           onClose,
                                                           onAddTask,
                                                           onEditTask,
                                                           taskToEdit,
                                                         }) => {
  const [taskTitle, setTaskTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : 'low');
  const [progress, setProgress] = useState(taskToEdit ? taskToEdit.progress : 'Todo');

  const generateTemporaryId = (): number => {
    return new Date().getTime();
  };

  const updatedTask: Task = {
    id: taskToEdit ? taskToEdit.id : generateTemporaryId(),
    title: taskTitle,
    priority: priority,
    progress: progress,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      return;
    }
    console.log("Submitting edited task:", updatedTask);
    if (taskToEdit) {
      const updatedTask = {
        id: taskToEdit.id,
        title: taskTitle,
        priority: priority,
        progress: progress,
      };

      onEditTask(taskToEdit.id, updatedTask);
    } else {
      onAddTask({
        id: generateTemporaryId(),
        title: taskTitle,
        priority: priority,
        progress: progress,
      });
    }
    setTaskTitle('');
    setPriority('low');
    setProgress('Todo');
    onClose();
  };

  return (
      <Modal>
        <form onSubmit={handleSubmit}>
          <div className="add-edit-modal">
            <div className="flx-between">
              <span className="modal-title">{taskToEdit ? 'Edit Task' : 'Add Task'}</span>
              <Close className="cp" onClick={onClose}/>
            </div>
            <Input
                label="Task"
                placeholder="Type your task here..."
                onChange={(e) => setTaskTitle(e.target.value)}
                name="title"
                value={taskTitle}
            />
            <div className="modal-priority">
              <span>Priority</span>
              <ul className="priority-buttons">
                {['high', 'medium', 'low'].map((priorityOption) => (
                    <li
                        key={priorityOption}
                        className={classNames({[`${priorityOption}-selected`]: priority === priorityOption})}
                        onClick={() => setPriority(priorityOption)}
                    >
                      {priorityOption}
                    </li>
                ))}
              </ul>
            </div>
            {/* Add progress selection dropdown */}
            <div className="modal-progress">
              <span>Progress</span>
              <select value={progress} onChange={(e) => setProgress(e.target.value)}>
                {['Todo', 'In Progress', 'Done'].map((progressOption) => (
                    <option key={progressOption} value={progressOption}>
                      {progressOption}
                    </option>
                ))}
              </select>
            </div>
            <div className="flx-right mt-50">
              <Button title={taskToEdit ? 'Save' : 'Add'} onClick={handleSubmit}/>
            </div>
          </div>
        </form>
      </Modal>
  );
};

AddEditTaskForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  taskToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }),
};



export default AddEditTaskForm;
