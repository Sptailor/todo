import "./style.css";
import { format } from "date-fns";

import createProject, { fromJSON as projectFromJSON } from "./project.js";
import { createToDo } from "./todo.js";

let rawProjects = JSON.parse(localStorage.getItem("todoProjects")) || [];
let projects = rawProjects.map(projectFromJSON);

let currProj = projects[0] || null;

function saveProjectsToLocalStorage() {
  localStorage.setItem("todoProjects", JSON.stringify(projects));
}

function addProject(name) {
  if (projects.some(p => p.name === name)) {
    alert("Project with this name already exists.");
    return;  
  }
  const project = createProject(name);
  if (!currProj) currProj = project;
  projects.push(project);
  saveProjectsToLocalStorage();
}

function editProject(oldName, newName) {
  const project = projects.find(p => p.name === oldName);
  if (project) {
    project.name = newName;
    saveProjectsToLocalStorage();
    renderProjects();
    if (currProj && currProj.name === oldName) {
      currProj = project;
      renderTodos();
    }
  } else {
    alert("Project not found.");
  }
}

function removeProject(name) {
  const index = projects.findIndex(p => p.name === name);
  if (index !== -1) {
    projects.splice(index, 1);
    if (currProj && currProj.name === name) {
      currProj = projects[0] || null;
    }
    saveProjectsToLocalStorage();
    renderProjects();
    renderTodos();
  }
}

function setCurrProject(name) {
  const project = projects.find(p => p.name === name);
  if (project) {
    currProj = project;
  }
}

function addTaskToProject(data) {
  if (!currProj) return null;
  const todo = createToDo(data);
  currProj.addToDo(todo);
  saveProjectsToLocalStorage();
}

function removeTaskFromProject(index) {
  if (!currProj) return null;
  currProj.removeTodo(index);
  saveProjectsToLocalStorage();
}

const projectList = document.getElementById("project-list");
const todoList = document.getElementById("todo-list");
const currentProjectTitle = document.getElementById("current-project-title");

function renderProjects() {
  projectList.innerHTML = "";
  projects.forEach(p => {
    const li = document.createElement("li");
li.style.display = "flex";
li.style.justifyContent = "space-between";
li.style.alignItems = "center";

const nameSpan = document.createElement("span");
nameSpan.textContent = p.name;

nameSpan.style.flex = "1";
nameSpan.style.wordBreak = "break-word";

li.style.cursor = "pointer";
li.onclick = () => {
  setCurrProject(p.name);
  renderTodos();
};

function showInlineInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.value = p.name;
  input.style.flex = "1";
  input.style.marginRight = "10px";

  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      const newName = input.value.trim();
      if (newName && newName !== p.name) {
        editProject(p.name, newName); 
      } else {
        li.replaceChild(nameSpan, input);
      }
    } else if (e.key === "Escape") {
      li.replaceChild(nameSpan, input);
    }
  };

  input.onblur = () => {
    li.replaceChild(nameSpan, input);
  };

  li.replaceChild(input, nameSpan);
  input.focus();
}

const editBtn = document.createElement("button");
editBtn.className = "edit-btn";
editBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
editBtn.title = "Edit project";
editBtn.onclick = (e) => {
  e.stopPropagation();
  showInlineInput();
};

const delBtn = document.createElement("button");
delBtn.className = "trash-btn";
delBtn.innerHTML = `<i class="fas fa-trash"></i>`;
delBtn.title = "Delete project";
delBtn.onclick = (e) => {
  e.stopPropagation();
  removeProject(p.name);
};

const btnGroup = document.createElement("div");
btnGroup.style.display = "flex";
btnGroup.style.gap = "6px";
btnGroup.appendChild(editBtn);
btnGroup.appendChild(delBtn);

li.appendChild(nameSpan);
li.appendChild(btnGroup);
projectList.appendChild(li);



  });
}

function renderTodos() {
  if (!currProj){
    currentProjectTitle.textContent = "Select a Project";
    todoList.innerHTML = "";

    return;
  }
  currentProjectTitle.textContent = `Tasks in: ${currProj.name}`;

  todoList.innerHTML = "";

  currProj.getTodos().forEach((todo, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-card");

    li.innerHTML = `
      <div class="todo-header">
        <strong>${todo.title}</strong>
        <hr style="width=80% font 20px">
        <div id="actions">
          <button class="complete-btn" title="Mark complete">
            <i class="fas fa-check"></i>
          </button>
          <button class="delete-btn" title="Delete task">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="todo-body">
        <p><strong>Due:</strong> ${format(new Date(todo.dueDate), "MMM dd, yyyy")}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
        <p><strong>Description:</strong> ${todo.description || "—"}</p>
      </div>
    `;

    switch (todo.priority) {
      case "High":
        li.classList.add("high-priority");
        break;
      case "Medium":
        li.classList.add("medium-priority");
        break;
      default:
        li.classList.add("low-priority");
    }

    li.querySelector(".delete-btn").onclick = () => {
      removeTaskFromProject(index);
      renderTodos();
    };

    li.querySelector(".complete-btn").onclick = () => {
      li.classList.toggle("completed");
    };

    todoList.appendChild(li);
  });
}

// Event listeners for adding todos and projects (same as your current code)

document.getElementById("add-todo-btn").addEventListener("click", () => {
  const title = document.getElementById("todo-title").value.trim();
  const description = document.getElementById("todo-desc").value.trim();
  const dueDate = document.getElementById("todo-date").value;
  const priority = document.getElementById("todo-priority").value;

  if (title && dueDate) {
    addTaskToProject({ title, description, dueDate, priority });
    renderTodos();

    // Clear input fields
    document.getElementById("todo-title").value = "";
    document.getElementById("todo-desc").value = "";
    document.getElementById("todo-date").value = "";
    document.getElementById("todo-priority").value = "Low";
  }
});

const showFormBtn = document.getElementById("show-projectForm");
const projectForm = document.getElementById("project-form");
const addProjectBtn = document.getElementById("add-project-btn");
const newProjectInput = document.getElementById("new-project-name");

showFormBtn.addEventListener("click", () => {
  projectForm.style.display = projectForm.style.display === "none" ? "flex" : "none";
});

addProjectBtn.addEventListener("click", () => {
  const name = newProjectInput.value.trim();
  if (name) {
    addProject(name);
    renderProjects();
    newProjectInput.value = "";
    projectForm.style.display = "none";
  }
});

const toggleTodoBtn = document.getElementById("toggle-todo-form");
const todoFormContainer = document.getElementById("todo-form-container");

toggleTodoBtn.addEventListener("click", () => {
  const isVisible = todoFormContainer.style.display === "block";
  todoFormContainer.style.display = isVisible ? "none" : "block";
  toggleTodoBtn.textContent = isVisible ? " Add Task" : "X";

});

// Initialize rendering on load
renderProjects();
renderTodos();
