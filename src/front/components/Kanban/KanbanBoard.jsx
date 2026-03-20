import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalTask from "./ModalTask";
import { createTask, updateTask, deleteTask } from "../../services/taskService";
import { getAllUsers } from "../../services/userService";

export const KanbanBoard = ({ packageId }) => {
    const { store, dispatch } = useGlobalReducer();
    const wpTasks = store.tasks?.filter(t => t.wp_id === packageId) || [];

    // Cargamos usuarios al montar el componente — Añadido por Paty
    useEffect(() => {
        if (store.token && store.users.length === 0) {
            getAllUsers(store.token)
                .then(data => dispatch({ type: "set_users", payload: data }))
                .catch(err => console.error("Error loading users:", err));
        }
    }, [store.token]);

    const handleEnd = async (event) => {
        const { targetData, dragContext } = event;
        const task = dragContext.item.data;
        const newStatus = targetData.parent.id;
        if (task.status === newStatus) return;
        dispatch({ type: "edit_task", payload: { ...task, status: newStatus } });
        try {
            await updateTask(store.token, task.id, { status: newStatus });
        } catch (err) {
            console.error("Error updating task status:", err);
            dispatch({ type: "edit_task", payload: task });
        }
    };

    const [todoRef, todoTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "to_do"), {
        group: "bohrTasks", id: "to_do"
    });
    const [progressRef, progressTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_progress"), {
        group: "bohrTasks", id: "in_progress"
    });
    const [reviewRef, reviewTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_review"), {
        group: "bohrTasks", id: "in_review"
    });
    const [doneRef, doneTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "done"), {
        group: "bohrTasks", id: "done"
    });

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        name: "",
        task_description: "",
        todo_by: "",
        deadline: "",
        alert: false,
        status: "to_do",
        wp_id: packageId
    });

    const handlePrepareCreateModal = () => {
        setNewTaskData({
            name: "",
            task_description: "",
            todo_by: "",
            deadline: "",
            alert: false,
            status: "to_do",
            wp_id: packageId,
            id: null
        });
        setIsTaskModalOpen(true);
    };

    const handlePrepareEditModal = (task) => {
        setNewTaskData(task);
        setIsTaskModalOpen(true);
    };

    // CREAR TAREA — Modificado por Paty: ahora llama al backend
    const handleSaveNewTask = async () => {
        if (!newTaskData.name.trim()) return;

        try {
            const taskToSend = {
                wp_id: packageId,
                name: newTaskData.name,
                task_description: newTaskData.task_description,
                status: newTaskData.status || "to_do",
                alert: newTaskData.alert || false,
                todo_by: Number(newTaskData.todo_by),
                deadline: newTaskData.deadline ? newTaskData.deadline + "T00:00:00Z" : null
            };

            const savedTask = await createTask(store.token, taskToSend);
            dispatch({ type: "add_task", payload: savedTask });
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error creating task:", err);
            alert("Error creating task: " + err.message);
        }
    };

    // EDITAR TAREA — Modificado por Paty: ahora llama al backend
    const handleSaveEditedTask = async () => {
        if (!newTaskData.name.trim()) return;

        try {
            const taskToSend = {
                name: newTaskData.name,
                task_description: newTaskData.task_description,
                status: newTaskData.status,
                alert: newTaskData.alert,
                todo_by: newTaskData.todo_by ? Number(newTaskData.todo_by) : null,
                deadline: newTaskData.deadline
                    ? (newTaskData.deadline.includes("T") ? newTaskData.deadline : newTaskData.deadline + "T00:00:00Z")
                    : null
            };

            const updatedTask = await updateTask(store.token, newTaskData.id, taskToSend);
            dispatch({ type: "edit_task", payload: updatedTask });
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error updating task:", err);
            alert("Error updating task: " + err.message);
        }
    };

    // ELIMINAR TAREA — Modificado por Paty: ahora llama al backend
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(store.token, taskId);
            dispatch({ type: "delete_task", payload: taskId });
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Error deleting task: " + err.message);
        }
    };

    return (
        <div className="accordion-body d-flex flex-row gap-3 align-items-start overflow-auto pb-3">
            <KanbanColumn
                columnRef={todoRef}
                tasks={todoTasks}
                title="TO DO"
                borderColor="border-info"
                ledColor="#27E6D6"
                onAddTask={handlePrepareCreateModal}
                onEditTask={handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={progressRef}
                tasks={progressTasks}
                title="IN PROGRESS"
                borderColor="border-warning"
                ledColor="#ffc107"
                onEditTask={handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={reviewRef}
                tasks={reviewTasks}
                title="IN REVIEW"
                borderColor="border-primary"
                ledColor="#0d6efd"
                onEditTask={handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={doneRef}
                tasks={doneTasks}
                title="DONE"
                borderColor="border-success"
                ledColor="#198754"
                onEditTask={handlePrepareEditModal}
            />
            <ModalTask
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                data={newTaskData}
                users={store.users}
                onChange={(field, val) => setNewTaskData({ ...newTaskData, [field]: val })}
                onSubmit={newTaskData?.id ? handleSaveEditedTask : handleSaveNewTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};