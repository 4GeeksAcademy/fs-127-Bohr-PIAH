import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useRef, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";

export const KanbanBoard = () => {

    

    const [todoRef, todoTasks] = useDragAndDrop(["Task 1", "Task 2"], { group: "bohrTasks" });
    const [progressRef, progressTasks] = useDragAndDrop(["Task 3"], { group: "bohrTasks" });
    const [reviewRef, reviewTasks] = useDragAndDrop(["Task 4"], { group: "bohrTasks" });
    const [doneRef, doneTasks] = useDragAndDrop(["Task 5"], { group: "bohrTasks" });
    const [, setUpdate] = useState(0);


    // Estado para añadir la nueva tarea del TO DO
    const [newTodoText, setNewTodoText] = useState("");
    const [addingTodo, setAddingTodo] = useState(false);
    const inputRef = useRef(null);

    const handleAddTodo = () => setAddingTodo(true);

    const confirmAddTodo = () => {
        if (newTodoText.trim() !== "") {
            todoTasks.push(newTodoText.trim());
            setNewTodoText("");
            setAddingTodo(false);
            setUpdate(u => u + 1);
        } else {
            setAddingTodo(false); // si está vacío también cerramos
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
            onAddTask={() => setAddingTodo(true)}
            addingTask={addingTodo}
            newTaskText={newTodoText}
            setNewTaskText={setNewTodoText}
            confirmAddTask={confirmAddTodo}
        />

        <KanbanColumn
            columnRef={progressRef}
            tasks={progressTasks}
            title="IN PROGRESS"
            borderColor="border-warning"
            ledColor="#ffc107"
        />

        <KanbanColumn
            columnRef={reviewRef}
            tasks={reviewTasks}
            title="IN REVIEW"
            borderColor="border-primary"
            ledColor="#0d6efd"
        />

        <KanbanColumn
            columnRef={doneRef}
            tasks={doneTasks}
            title="DONE"
            borderColor="border-success"
            ledColor="#198754"
        />
    </div>
);
};