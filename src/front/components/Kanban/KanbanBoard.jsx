import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalTask from "./ModalTask";
import { toast } from "react-toastify";
import { createTask, updateTask, deleteTask, getAllTasks } from "../../services/taskService";
import { getAllUsers } from "../../services/userService";

export const KanbanBoard = ({ packageId }) => {
    const { store, dispatch } = useGlobalReducer();
    const isGuest = store.user?.role === "guest";
    const wpTasks = store.tasks?.filter(t => t.wp_id === packageId) || [];
    const currentProject = store.projects.find(p => p.id === store.currentProjectId);
    const projectMinDate = currentProject?.created_at ? currentProject.created_at.slice(0, 10) : "";
    const projectUsers = currentProject?.users?.length
        ? store.users.filter(u => currentProject.users.some(pu => pu.id === u.id))
        : store.users;

    // Cargamos usuarios al montar el componente — Añadido por Paty
    useEffect(() => {
        if (store.token && store.users.length === 0) {
            getAllUsers(store.token)
                .then(data => dispatch({ type: "set_users", payload: data }))
                .catch(err => console.error("Error loading users:", err));
        }
    }, [store.token]);

    const handleDragend = async (data) => {
        if (isGuest) return;
        const task = data.draggedNode.data.value;
        const newStatus = data.parent.data.config.id;
        if (task.status === newStatus) return;
        dispatch({ type: "edit_task", payload: { ...task, status: newStatus } });
        try {
            await updateTask(store.token, task.id, { status: newStatus });
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    };

    const dragOptions = (status) => ({ group: "bohrTasks", id: status, onDragend: handleDragend, disabled: isGuest });

    const [todoRef, todoTasks, setTodoTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "to_do"), dragOptions("to_do"));
    const [progressRef, progressTasks, setProgressTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_progress"), dragOptions("in_progress"));
    const [reviewRef, reviewTasks, setReviewTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_review"), dragOptions("in_review"));
    const [doneRef, doneTasks, setDoneTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "done"), dragOptions("done"));

    // Sincronizamos el estado interno del drag-and-drop cuando cambian las tareas del store
    useEffect(() => {
        setTodoTasks(wpTasks.filter(t => t.status === "to_do"));
        setProgressTasks(wpTasks.filter(t => t.status === "in_progress"));
        setReviewTasks(wpTasks.filter(t => t.status === "in_review"));
        setDoneTasks(wpTasks.filter(t => t.status === "done"));
    }, [store.tasks]);

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
        const twoWeeks = new Date();
        twoWeeks.setDate(twoWeeks.getDate() + 14);
        const defaultDeadline = twoWeeks.toISOString().split("T")[0];
        setNewTaskData({
            name: "",
            task_description: "",
            todo_by: "",
            deadline: defaultDeadline,
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

    // Helper — Añadido por Paty: recarga tareas del backend para mantener el kanban sincronizado
    const reloadTasks = async () => {
        const tasks = await getAllTasks(store.token);
        dispatch({ type: "set_tasks", payload: tasks });
    };

    // CREAR TAREA — Modificado por Paty: llama al backend y recarga
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
            await createTask(store.token, taskToSend);
            await reloadTasks();
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error completo:", err);
            toast.error("Error creating task: " + err.message);
        }
    };

    // EDITAR TAREA — Modificado por Paty: llama al backend y recarga
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
            await updateTask(store.token, newTaskData.id, taskToSend);
            await reloadTasks();
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error updating task:", err);
            toast.error("Error updating task: " + err.message);
        }
    };

    // ELIMINAR TAREA — Modificado por Paty: llama al backend y recarga
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(store.token, taskId);
            await reloadTasks();
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error("Error deleting task:", err);
            toast.error("Error deleting task: " + err.message);
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
                onAddTask={isGuest ? undefined : handlePrepareCreateModal}
                onEditTask={isGuest ? undefined : handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={progressRef}
                tasks={progressTasks}
                title="IN PROGRESS"
                borderColor="border-warning"
                ledColor="#ffc107"
                onEditTask={isGuest ? undefined : handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={reviewRef}
                tasks={reviewTasks}
                title="IN REVIEW"
                borderColor="border-primary"
                ledColor="#0d6efd"
                onEditTask={isGuest ? undefined : handlePrepareEditModal}
            />
            <KanbanColumn
                columnRef={doneRef}
                tasks={doneTasks}
                title="DONE"
                borderColor="border-success"
                ledColor="#198754"
                onEditTask={isGuest ? undefined : handlePrepareEditModal}
            />
            <ModalTask
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                data={newTaskData}
                users={projectUsers}
                minDate={projectMinDate}
                onChange={(field, val) => setNewTaskData({ ...newTaskData, [field]: val })}
                onSubmit={newTaskData?.id ? handleSaveEditedTask : handleSaveNewTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};