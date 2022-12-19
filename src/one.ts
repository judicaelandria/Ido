import { v4 } from "uuid";
import { ITodo } from "../types";
import { ItemKey } from "./constants";

function init() {
  const data = localStorage.getItem(ItemKey);
  if (!data) localStorage.setItem(ItemKey, JSON.stringify([]));
  else initData();
  deleteOldTask();
  addTodo();
  checkTodo();
  setInterval(deleteOldTask, 300_000);
  resetData();
}

function addTodo() {
  const input = document.getElementById("input");
  input?.addEventListener("keydown", (event) => {
    const item = document.createElement("li");
    item.className = "desc";
    item.id = "item";
    const value = (input as HTMLInputElement).value;
    item.innerText = value;
    item.tabIndex = 0;
    const container = document.getElementById("list");
    if (event.key === "Enter") {
      if (!value) return;
      else {
        setData(value);
        container?.insertBefore(item, container.firstChild);
        (input as HTMLInputElement).value = "";
      }
    }
  });
}

function checkTodo() {
  const list = document.getElementById("list");
  list?.addEventListener("keydown", (event) => {
    const currentTarget = event.target as HTMLLIElement;
    if (event.key === " ") {
      event.preventDefault();
      if (currentTarget && currentTarget.matches("li#item")) {
        if (currentTarget.classList.contains("checked")) {
          currentTarget.className = "desc";
          updateData(currentTarget.innerText, false);
        } else {
          currentTarget.className = "desc checked";
          updateData(currentTarget.innerText, true);
        }
      }
    }
  });
}

function getData(): ITodo[] {
  return JSON.parse(localStorage.getItem(ItemKey)!) as ITodo[];
}

function setData(title: string) {
  const data = JSON.parse(localStorage.getItem(ItemKey)!) as ITodo[];
  const newTask: ITodo = {
    id: v4(),
    title: title,
    checked: false,
    createdAt: new Date(),
  };
  data.push(newTask);
  localStorage.setItem(ItemKey, JSON.stringify(data));
}

function updateData(title: string, check: boolean) {
  const data = JSON.parse(localStorage.getItem(ItemKey)!) as ITodo[];
  data.map((d) => {
    if (d.title === title) {
      d.checked = check;
    }
  });
  localStorage.setItem(ItemKey, JSON.stringify(data));
}

function initData() {
  const items = getData();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "desc";
    li.id = "item";
    li.innerText = item.title;
    li.tabIndex = 0;
    if (item.checked) {
      li.className = "desc checked";
    }
    const container = document.getElementById("list");
    container?.insertBefore(li, container.firstChild);
  });
}

function deleteOldTask() {
  const todos = getData();
  for (const todo of todos) {
    if (todo.checked && has24HoursPassed(todo.createdAt)) {
      todos.splice(
        todos.findIndex((t) => t.id === todo.id),
        1
      );
    }
  }
}

function has24HoursPassed(dateTime: Date) {
  // Get the current time
  const currentTime = new Date();

  // Get the time 24 hours ago
  const time24HoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

  // Check if the input date time is before the time 24 hours ago
  return dateTime < time24HoursAgo;
}

function resetData() {
  const btn = document.getElementById("btn");
  btn?.addEventListener("click", () => {
    localStorage.removeItem(ItemKey);
    window.location.reload();
  });
}

init();
