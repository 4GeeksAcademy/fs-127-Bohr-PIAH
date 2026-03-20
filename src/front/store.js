export const initialStore = () => {
  return {
    message: null,
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    projects: [],
    departments: [],
    currentProjectId: null,
    currentDepartment: JSON.parse(localStorage.getItem("currentDepartment")) || null,
    tasks: [],
    users: [],
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

    case "set_current_project":
      return {
        ...store,
        currentProjectId: action.payload,
      };

    case "set_projects":
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

    case "set_tasks":
      return {
        ...store,
        tasks: action.payload,
      };

    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "set_departments":
      return {
        ...store,
        departments: action.payload,
      };

    case "set_users":
    return {
        ...store,
        users: action.payload,
    };

    case "set_current_department":
      localStorage.setItem("currentDepartment", JSON.stringify(action.payload));
      return {
        ...store,
        currentDepartment: action.payload,
      };

    case "set_tasks":
    return {
        ...store,
        tasks: action.payload,
    };

    case "set_token":
      localStorage.setItem("token", action.payload);
      return {
        ...store,
        token: action.payload,
      };

    case "set_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload,
      };

    default:
      console.log("Unknown action:", action.type);
      return store;
  }
}

export const useActions = (store, dispatch) => {
  return {
    getProjects: async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/projects",
          {
            headers: { Authorization: `Bearer ${store.token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();

          // Renombramos work_packages a workPackages y añadimos projectId
          const projects = data.map((project) => {
            const workPackages = (project.work_packages || []).map((wp) => {
              return { ...wp, projectId: project.id };
            });
            return { ...project, workPackages: workPackages };
          });

          // Sacamos todas las tareas de todos los work packages
          const tasks = [];
          data.map((project) => {
            (project.work_packages || []).map((wp) => {
              (wp.tasks || []).map((task) => {
                tasks.push({ ...task, wpId: task.wp_id });
              });
            });
          });

          dispatch({ type: "set_projects", payload: projects });
          dispatch({ type: "set_tasks", payload: tasks });
          return true;
        }
      } catch (error) {
        console.error("Error en getProjects", error);
        return false;
      }
    },

    addTask: async (newTask) => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${store.token}`,
            },
            body: JSON.stringify(newTask),
          }
        );
        if (response.ok) {
          const data = await response.json();
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