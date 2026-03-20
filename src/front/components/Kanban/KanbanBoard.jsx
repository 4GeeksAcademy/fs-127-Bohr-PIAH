import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useRef, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalTask from "./ModalTask";
import { createTask, updateTask, deleteTask } from "../../services/taskService";

export const KanbanBoard = ({ packageId }) => {
    const { store, dispatch } = useGlobalReducer();
    const wpTasks = store.tasks?.filter(t => t.wpId === packageId) || [];

    const handleEnd = async (event) => {
    const { targetData, dragContext } = event;
    const task = dragContext.item.data;
    const newStatus = targetData.parent.id;

    dispatch({
        type: "edit_task",
        payload: { ...task, status: newStatus }
    });

    try {
        await updateTask(store.token, task.id, { status: newStatus });
    } catch (err) {
        console.error("Error updating task status", err);
    }
};

const [todoRef, todoTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "to_do"), { 
        group: "bohrTasks",
        id: "to_do"
    });

    const [progressRef, progressTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_progress"), { 
        group: "bohrTasks",
        id: "in_progress"
    });

    const [reviewRef, reviewTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_review"), { 
        group: "bohrTasks",
        id: "in_review"
    });

    const [doneRef, doneTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "done"), { 
        group: "bohrTasks",
        id: "done"
    });

    // estados para el MODAL de TASKS

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        name: "",
        task_description: "",
        todo_by: "",
        deadline: "",
        alert: false,
        status: "to_do",
        wpId: packageId
    });

    // PREPARAMOS EL MODAL VACÍO
    const handlePrepareCreateModal = () => {
        setNewTaskData({
            name: "",
            task_description: "",
            todo_by: "",
            deadline: "",
            alert: false,
            status: "to_do",
            wpId: packageId,
            id: null
        });
        setIsTaskModalOpen(true);
    };

    // SALTA EL MODAL RELLENADO
    const handlePrepareEditModal = (task) => {
        setNewTaskData(task);
        setIsTaskModalOpen(true);
    };

    // GUARDA UNA TAREA  NUEVA ---
    const handleSaveNewTask = async () => {
        if (!newTaskData.name.trim()) return;

        try {
            const created = await createTask(store.token, {
                wp_id: packageId,
                name: newTaskData.name,
                task_description: newTaskData.task_description || "",
                status: "to_do",
                alert: newTaskData.alert || false,
                todo_by: newTaskData.todo_by || null,
                deadline: newTaskData.deadline || null,
            });
            const newTask = { ...created, wpId: created.wp_id };
            dispatch({ type: "add_task", payload: newTask });
            todoTasks.push(newTask);
        } catch (err) {
            console.error("Error creating task", err);
        }

        setIsTaskModalOpen(false);
    };

    // GUARDAMOS LOS CAMBIOS SI SE EDITA
    const handleSaveEditedTask = async () => {
        if (!newTaskData.name.trim()) return;

        try {
            const updated = await updateTask(store.token, newTaskData.id, {
                name: newTaskData.name,
                task_description: newTaskData.task_description,
                status: newTaskData.status,
                alert: newTaskData.alert,
                todo_by: newTaskData.todo_by || null,
                deadline: newTaskData.deadline || null,
            });
            const updatedTask = { ...updated, wpId: updated.wp_id };
            dispatch({ type: "edit_task", payload: updatedTask });

            const index = todoTasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                todoTasks.splice(index, 1, { ...updatedTask });
            }
        } catch (err) {
            console.error("Error updating task", err);
        }

        setIsTaskModalOpen(false);
    };

    // ELIMINAMOS TAREA
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(store.token, taskId);
            dispatch({ type: "delete_task", payload: taskId });

            const index = todoTasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                todoTasks.splice(index, 1);
            }
        } catch (err) {
            console.error("Error deleting task", err);
        }

        setIsTaskModalOpen(false);
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
                onChange={(field, val) => setNewTaskData({ ...newTaskData, [field]: val })}
                onSubmit={newTaskData?.id ? handleSaveEditedTask : handleSaveNewTask}
                onDelete={handleDeleteTask}

            />
        </div>
    );
};