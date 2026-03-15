import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useRef, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalTask from "./ModalTask"

export const KanbanBoard = ({ packageId }) => {
    const { store, dispatch } = useGlobalReducer();
    const wpTasks = store.tasks?.filter(t => t.wpId === packageId) || [];



    //const [todoRef, todoTasks] = useDragAndDrop(["Task 1", "Task 2"], { group: "bohrTasks" });
    // const [progressRef, progressTasks] = useDragAndDrop(["Task 3"], { group: "bohrTasks" });
    //const [reviewRef, reviewTasks] = useDragAndDrop(["Task 4"], { group: "bohrTasks" });
    // const [doneRef, doneTasks] = useDragAndDrop(["Task 5"], { group: "bohrTasks" });
    // const [, setUpdate] = useState(0);
    const [todoRef, todoTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "to_do"), { group: "bohrTasks" });
    const [progressRef, progressTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_progress"), { group: "bohrTasks" });
    const [reviewRef, reviewTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "in_review"), { group: "bohrTasks" });
    const [doneRef, doneTasks] = useDragAndDrop(wpTasks.filter(t => t.status === "done"), { group: "bohrTasks" });

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

    // GUARDA UNA TAREA TOTALMENTE NUEVA ---
    const handleSaveNewTask = () => {
        if (!newTaskData.name.trim()) return;

        const newTask = {
            ...newTaskData,
            id: crypto.randomUUID(),
            wpId: packageId,
            status: "to_do"
        };

        dispatch({ type: "add_task", payload: newTask });
        todoTasks.push(newTask);
        setIsTaskModalOpen(false);
    };

    // GUARDAMOS LOS CAMBIOS SI SE EDITA
    const handleSaveEditedTask = () => {
        if (!newTaskData.name.trim()) return;

        dispatch({
            type: "edit_task",
            payload: newTaskData
        });

        const index = todoTasks.findIndex(t => t.id === newTaskData.id);

        if (index !== -1) {
            // Usamos splice para reemplazar la vieja tarea por la nueva en esa posición
            todoTasks.splice(index, 1, { ...newTaskData });
        }

        setIsTaskModalOpen(false);
    };

    // ELIMINAMOS TAREA
    const handleDeleteTask = (taskId) => {
        
        dispatch({
            type: "delete_task",
            payload: taskId
        });

        const index = todoTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            todoTasks.splice(index, 1); // Borramos 1 elemento en esa posición
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