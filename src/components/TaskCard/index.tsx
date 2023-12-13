import React, {useState} from 'react';
import classNames from 'classnames';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/edit.svg';
import CircularProgressBar from '../CircularProgressBar';
import './style.scss';
import DeleteModal from "../DeleteModal";


const TaskCard = ({ task, onEdit, onDelete }: any) => {
    const { title, priority, status, progress } = task;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(task.id);
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };
    return (
        <div className="task-card">
            <div className="flex w-100">
                <span className="task-title">Task</span>
                <span className="task">{title}</span>
            </div>
            <div className="flex">
                <span className="priority-title">Priority</span>
                <span className={classNames(`${priority}-priority`, 'priority')}>{priority}</span>
            </div>
            <div className="task-status-wrapper">
                <button className="status">{status}</button>
            </div>
            <div className="progress">
                <CircularProgressBar
                    strokeWidth={2}
                    sqSize={24}
                    percentage={progress !== undefined ? progress : 0}
                />
            </div>
            <div className="actions">
                <EditIcon className="mr-20 cp" onClick={() => onEdit(task)} />
                <DeleteIcon className="cp" onClick={handleDeleteClick}/>
            </div>
            {showDeleteModal && (
                <DeleteModal
                    onCancel={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default TaskCard;
