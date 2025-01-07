import React, { useState } from "react";
import Card from "./components/ui/Card";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { Trash2, CheckSquare } from "lucide-react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Bug 1: Doesn't trim whitespace from input, allowing empty space todos
  const addTodo = () => {
    if (inputValue) {
      setTodos([
        ...todos,
        {
          id: todos.length, // Bug 2: Using array length as ID can cause duplicates on deletion
          text: inputValue,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setInputValue("");
      setErrorMessage("");
    } else {
      setErrorMessage("Todo cannot be empty");
    }
  };

  // Bug 3: Doesn't update completed status correctly when there are multiple items
  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return { ...todo, completed: todo.completed }; // unnecessarily updates all todos
    });
    setTodos(newTodos);
  };

  // Bug 4: Deletion sometimes leaves orphaned items due to array index issues
  const deleteTodo = (id) => {
    setTodos(todos.filter((_, index) => index !== id)); // using index instead of todo.id
  };

  // Bug 5: Enter key handling is inconsistent
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Bug: Shift+Enter doesn't work as expected
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

      <ul className="space-y-2">
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
              onClick={() => deleteTodo(todo.id)}
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
