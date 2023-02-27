import "./styles.css";
import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [result, setResult] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");

  const url = "https://jsonplaceholder.typicode.com/todos";
  const header = new Headers();
  header.append("Access-Control-Allow-Origin", "*");
  header.append("Content-Type", "application/json");

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        return res.json();
      })
      .then((res) => {
        const data = res;
        setIsLoading(false);
        setTodos(data);
        setResult(data);
        return data;
      })
      .catch((e) => {
        console.log(e.message);
        setIsLoading(false);
        setMessage(e.message);
      });
  }, []);

  useEffect(() => {
    let filteredResult;
    if (status === "completed") {
      filteredResult = todos
        .filter((todo) => todo.title.includes(searchQuery))
        .filter((todo) => todo.completed);
    } else if (status === "Todo") {
      filteredResult = todos
        .filter((todo) => todo.title.includes(searchQuery))
        .filter((todo) => !todo.completed);
    } else {
      filteredResult = todos.filter((todo) => todo.title.includes(searchQuery));
    }
    setResult(filteredResult);
  }, [searchQuery, status]);

  const search = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const filter = (e) => {
    e.preventDefault();
    setStatus(e.target.value);
  };

  const deleteTodo = (id) => {
    let deletedResult;
    deletedResult = result.filter((todo) => todo.id !== id);
    setResult(deletedResult);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>Todos List</h1>

      <div className="filterContainer">
        <input placeholder="input search query..." onChange={search} />
        <select onChange={filter}>
          <option value="all">ALL</option>
          <option value="completed">COMPLETED</option>
          <option value="Todo">TODO</option>
        </select>
      </div>
      {message && <div>{message}</div>}
      {isloading ? (
        <div>...Loading</div>
      ) : (
        <table className="container">
          <tr>
            <td>NO</td>
            <td>TITLE</td>
            <td>COMPLETED</td>
            <td></td>
          </tr>
          {result &&
            result.map((todo, index) => {
              return (
                <tr className="">
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>
                    <input type="checkbox" checked={todo.completed} />
                  </td>
                  <td>
                    <button
                      type="button"
                      value="Delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </table>
      )}
    </div>
  );
}
