export const getTodosFromStorage = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const todos = JSON.parse(localStorage.getItem("todos") || "[]");
      resolve(todos);
    }, 500); // Simulate API delay
  });
};

export const saveTodosToStorage = async (todos) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(todos));
      resolve();
    }, 500); // Simulate API delay
  });
};
