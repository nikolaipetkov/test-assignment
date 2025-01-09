import React, { useState, useEffect } from "react";
import Card from "./components/ui/Card";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { Trash2, CheckSquare } from "lucide-react";

const API_URL = "https://677fc40a0476123f76a7fe56.mockapi.io/api/v1/todos";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch todos from MockAPI
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async () => {
    if (inputValue) {
      try {
        const newTodo = {
          id: todos.length + 1, // Bug: Using length as ID causes duplicates
          text: inputValue,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });
        const addedTodo = await response.json();
        setTodos([
          ...todos,
          {
            id: todos.length + 1, // Bug: Using length as ID causes duplicates
            ...addedTodo,
          },
        ]);
        setInputValue("");
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    } else {
      setErrorMessage("Todo cannot be empty");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (response.ok) {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed }; // Bug: Redundant updates for other todos
          }
          return { ...todo, completed: todo.completed };
        });
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error("Failed to toggle complete:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await resp.json();
      console.log({ data });
      if (data === "Not found") {
        throw new Error("Todo not found");
      }
      // Bug: Use the index instead of the todo's id to filter
      setTodos(todos.filter((_, index) => index + 1 !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Bug: Shift+Enter has no defined behavior
        return;
      }
      addTodo();
    }
  };

  return (
    <Card className="w-full max-w-md p-6 mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo"
          className="flex-1"
          data-testid="todo-input"
        />
        <Button onClick={addTodo} data-testid="add-todo-button">
          Add
        </Button>
      </div>

      {errorMessage && (
        <p className="text-red-500 mb-4" data-testid="error-message">
          {errorMessage}
        </p>
      )}

      <ul className="space-y-2 todos-container">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded"
            data-testid={`todo-item-${index}`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`p-1 rounded ${
                  todo.completed ? "text-green-500" : "text-gray-400"
                }`}
                data-testid={`complete-button-${index}`}
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              <span
                className={todo.completed ? "line-through text-gray-400" : ""}
                data-testid={`todo-text-${index}`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(index + 1)}
              className="text-red-500 p-1 rounded hover:bg-red-50"
              data-testid={`delete-button-${index}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TodoApp;
