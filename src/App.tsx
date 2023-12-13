import React, {useEffect, useState} from 'react';
import {ReactComponent as Add} from './assets/icons/add.svg';
import AddEditTaskForm from './components/AddEditTaskForm';
import Button from './components/Button';
import TaskCard from './components/TaskCard';
import './App.scss';
import {Task as TaskInterface} from './Task';


const App = () => {
    const initialTaskList = require('./data/taskList.json').taskList;

    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [taskList, setTaskList] = useState<TaskInterface[]>(initialTaskList);
    const [editingTask, setEditingTask] = useState<TaskInterface | null>(null);
    const [forceRender, setForceRender] = useState(false);
    const generateTemporaryId = () => {
        return (Math.random() * 1000).toString();
    };

    const fetchTaskList = async () => {
        const response = await fetch('/taskList.json');
        const data = await response.json();
        setTaskList(data.taskList);
        localStorage.setItem('taskList', JSON.stringify(data.taskList));
    };


    useEffect(() => {
        fetchTaskList();
        setForceRender((prev) => !prev);
    }, []);



    useEffect(() => {
        const storedTasks = localStorage.getItem('taskList');
        if (storedTasks) {
            setTaskList(JSON.parse(storedTasks));
        } else {
            fetchTaskList();
        }
    }, []);

    const addTask = (newTask: TaskInterface) => {
        const updatedTaskList = [...taskList, {...newTask, id: generateTemporaryId()}];
        setTaskList(updatedTaskList);
        localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
        console.log(taskList);
    };

    const editTask = (taskId: string, updatedTask: TaskInterface) => {
        const updatedTaskList = taskList.map((task) => {
            if (task.id === taskId) {
                return { ...task, ...updatedTask };
            }
            return task;
        });

        console.log("Updated Task List:", updatedTaskList);

        setTaskList(updatedTaskList);
        localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    };

    const handleEditTask = (editedTask: TaskInterface) => {
        editTask(editedTask.id, editedTask);
        setShowAddEditModal(false);
    };



    const deleteTask = (taskId: string) => {
        const updatedTaskList = taskList.filter((task) => task.id !== taskId);
        setTaskList(updatedTaskList);
        localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    };

    useEffect(() => {
        localStorage.setItem('taskList', JSON.stringify(taskList));
        console.log("Task List State Updated:", taskList);
    }, [taskList, forceRender]);

    return (
        <div className="container">
            <div className="page-wrapper">
                <div className="top-title">
                    <h2>Task List</h2>
                    <Button
                        title="Add Task"
                        icon={<Add/>}
                        onClick={() => {
                            setShowAddEditModal(true);
                            setEditingTask(null);
                        }}
                    />
                </div>
                <div className="task-container">
                    {taskList.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={(task: TaskInterface) => {
                                setEditingTask(task);
                                setShowAddEditModal(true);
                            }}
                            onDelete={deleteTask}
                        />
                    ))}


                </div>
            </div>
            {showAddEditModal && (
                <AddEditTaskForm
                    key={editingTask ? editingTask.id : 'new'}
                    show={showAddEditModal}
                    onClose={() => setShowAddEditModal(false)}
                    onAddTask={(newTask: TaskInterface) => addTask(newTask)}
                    onEditTask={(task: TaskInterface) => {
                        setEditingTask(task);
                        setShowAddEditModal(true);
                    }}
                    taskToEdit={editingTask}
                />
            )}
        </div>
    );
};


export default App;
