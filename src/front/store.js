export const initialStore = () => {
  return {
    message: null,
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

    case "set_current_project":
      return {
        ...store,
        currentProjectId: action.payload
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

    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
