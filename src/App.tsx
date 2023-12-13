import React, { useEffect, useState } from 'react';
import { ReactComponent as Add } from './assets/icons/add.svg';
import AddEditTaskForm from './components/AddEditTaskForm';
import Button from './components/Button';
import TaskCard from './components/TaskCard';
import './App.scss';
import { Task as TaskInterface } from './Task';


const App = () => {
    const [showAddEditModal, setShowAddEditModal] = useState(false);

    const initialTaskList = localStorage.getItem('taskList')
        ? JSON.parse(localStorage.getItem('taskList') as string)
        : require('./data/taskList.json').taskList;
    const [taskList, setTaskList] = useState<TaskInterface[]>(initialTaskList);
    const [editingTask, setEditingTask] = useState<TaskInterface | null>(null);
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
    }, []);


    useEffect(() => {
        localStorage.setItem('taskList', JSON.stringify(taskList));
    }, [taskList]);


    useEffect(() => {
        const storedTasks = localStorage.getItem('taskList');
        if (storedTasks) {
            setTaskList(JSON.parse(storedTasks));
        } else {
            fetchTaskList();
        }
    }, []);

    const addTask = (newTask: TaskInterface) => {
        const updatedTaskList = [...taskList, { ...newTask, id: generateTemporaryId() }];
        setTaskList(updatedTaskList);
        localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    };

    const editTask = (taskId: any, updatedTask: TaskInterface) => {
        setTaskList(currentTaskList => {
            return currentTaskList.map(task => {
                if (task.id === taskId) {
                    console.log("Original task:", task);
                    console.log("Updated task:", updatedTask);
                    return { ...task, ...updatedTask };
                }
                return task;
            });
        });
    };




    const deleteTask = (taskId: string) => {
        const updatedTaskList = taskList.filter((task) => task.id !== taskId);
        setTaskList(updatedTaskList);
        localStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    };


    return (
        <div className="container">
            <div className="page-wrapper">
                <div className="top-title">
                    <h2>Task List</h2>
                    <Button
                        title="Add Task"
                        icon={<Add />}
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
                            percentage={task.progress || 0}
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
                    onEditTask={(editedTask: TaskInterface) => {
                        editTask(editedTask.id, editedTask);
                        setShowAddEditModal(false);
                    }}
                    taskToEdit={editingTask}
                />
            )}
        </div>
    );
};



export default App;
