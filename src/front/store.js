export const initialStore = () => {
  return {
    message: null,
    token:  localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    projects: [],
    currentProjectId: null,
    tasks: [],
    todos: [
    
  

      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "add_project":
      return {
        ...store,
        projects: [...store.projects, action.payload],
      };

    case "delete_project":
      return {
        ...store,
        projects: store.projects.filter(
          (project) => project.id !== action.payload,
        ),
      };

    case "set_current_project": // recuerda cual de los proyectos es el seleccionado
      return {
        ...store,
        currentProjectId: action.payload,
      };

    case "set_projects": //guarda TODOS los proyectos.
      return {
        ...store,
        projects: action.payload,
      };

    case "add_work_package":
      if (!action.payload.projectId) return store;

      return {
        ...store,
        projects: store.projects.map((project) =>
          project.id === action.payload.projectId
            ? {
                ...project,
                workPackages: [...(project.workPackages || []), action.payload],
              }
            : project,
        ),
      };

    case "add_task":
      return {
        ...store,
        tasks: [...(store.tasks || []), action.payload],
      };

    case "edit_task":
      return {
        ...store,
        tasks: store.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
      };

    case "delete_task":
      return {
        ...store,
        tasks: store.tasks.filter((task) => task.id !== action.payload),
      };

    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "set_token":
      localStorage.setItem("token", action.payload);
      return {
        ...store,
        user: action.payload
      };

    case "set_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        token: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}

export const useActions = (store, dispatch) => {
  return {
    // TRAER PROYECTOS (GET)
    getProjects: async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/projects",
        );
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "set_projects", payload: data });
          return true;
        }
      } catch (error) {
        console.error("Error en getProjects", error);
        return false;
      }
    },

    // CREAR TAREA (POST)

    addTask: async (newTask) => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/tasks",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Guardamos en el store la tarea que nos devuelve el Back (ya con su ID real)
          dispatch({ type: "add_task", payload: data });
          return data;
        }
      } catch (error) {
        console.error("Error en addTask", error);
        return null;
      }
    },
  };
};
