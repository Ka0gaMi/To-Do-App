import { changeTab } from "./tabs";
import {
  appendToCompleted,
  appendToTasks,
  createTaskDiv,
  checked,
  checkDueDateColor,
  changePriorityColor,
} from "./task";

// Generate random project ID //

function generateRandomProjectId() {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4();
}

// Project array //

const projectsArr = {};

// Project factory function //

function createProject(id, title) {
  const project = {
    id,
    title,
    tasks: [],
  };

  return project;
}

// Add project to projects array //

function addProject(project) {
  projectsArr[project.id] = project;
}

// Create project div //

function createProjectDiv(projectTitle, id) {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-div");
  projectDiv.setAttribute("id", id);

  const projectName = document.createElement("span");
  projectName.classList.add("project-name");
  projectName.textContent = projectTitle;

  projectDiv.appendChild(projectName);

  return projectDiv;
}

// Get project data from form //

function getProjectData() {
  const projectForm = document.querySelector(".add-project-form");
  const projectMainDiv = document.getElementById("add-project-div");

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = document.getElementById("project-title").value;

    const project = createProject(generateRandomProjectId(), projectName);

    addProject(project);

    const projectDiv = createProjectDiv(projectName, project.id);

    addProjectToDropdown(projectDiv);
    updateProjects(project);

    projectForm.reset();
    projectMainDiv.classList.remove("active");
  });
}

// Add project to dropdown //

function addProjectToDropdown(projectDiv) {
  const dropdownContent = document.querySelector(".dropdown-content");

  dropdownContent.appendChild(projectDiv);

  addProjectDivFunctionality();
}

// Add project button functionality //

function addProjectBtnFunctionality() {
  const addProjectBtn = document.getElementById("add-project");

  addProjectBtn.addEventListener("click", () => {
    const projectDiv = document.getElementById("add-project-div");
    projectDiv.classList.add("active");
  });

  const addProjectCancel = document.getElementById("add-project-cancel");

  addProjectCancel.addEventListener("click", () => {
    const projectDiv = document.getElementById("add-project-div");
    projectDiv.classList.remove("active");
  });
}

// Add project div functionality //

function addProjectDivFunctionality() {
  const projectDiv = document.querySelector(".project-div");

  projectDiv.addEventListener("click", (e) => {
    changeTab("project-main", e.target.textContent, true, e.target.id);
    addTasksFromProjectArr(e.target.id);
    setSelectedProject(e.target.id);

    const projectName = document.querySelector(".main-header-title");
    projectName.setAttribute("id", e.target.id);
    console.log(projectsArr);
    projectNameChangeFunctionality();
    changePriorityColor();
  });
}

// Project name change functionality //

function projectNameChangeFunctionality() {
  const projectName = document.querySelector(".main-header-title");

  projectName.addEventListener("input", (e) => {
    const projectDiv = document.getElementById(projectName.id);
    projectDiv.firstChild.textContent = e.target.textContent;
    projectsArr[projectName.id].title = e.target.textContent;
  });

  projectName.addEventListener("focusout", () => {
    updateProjectFromArr();
  });
}

// Update projects //

function updateProjects(project) {
  const projectSelect = document.getElementById("project");

  const option = document.createElement("option");
  option.setAttribute("value", project.id);
  option.textContent = project.title;

  projectSelect.appendChild(option);
}

// Update project from projectArr //

function updateProjectFromArr() {
  const projectSelect = document.getElementById("project");

  for (let project in projectsArr) {
    const projectId = projectsArr[project].id;
    const projectTitle = projectsArr[project].title;
    let option = projectSelect.querySelector(`option[value="${projectId}"]`);

    if (option) {
      // Update existing option element's text content
      option.textContent = projectTitle;
    } else {
      // Create new option element
      option = document.createElement("option");
      option.setAttribute("value", projectId);
      option.textContent = projectTitle;
      projectSelect.appendChild(option);
    }
  }
}

// Set selected option to project //

function setSelectedProject(projectId) {
  const projectSelect = document.getElementById("project");
  const option = projectSelect.querySelector(`option[value="${projectId}"]`);

  option.setAttribute("selected", "selected");
}

// Add task to project //

function addTaskToProjectArray(projectId, task) {
  projectsArr[projectId].tasks.push(task);
  console.log(projectsArr);
}

// Check for tasks in projectArr //

function checkForTasksInProjectArr(projectId) {
  if (projectsArr[projectId].tasks.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Add task from projectArr to DOM //

function addTasksFromProjectArr(projectId) {
  if (checkForTasksInProjectArr(projectId)) {
    const projectTasks = projectsArr[projectId].tasks;

    projectTasks.forEach((task) => {
      if (task.completed === false) {
        appendToTasks(createTaskDiv(task));
      } else {
        appendToCompleted(createTaskDiv(task));
        checked(task.id);
      }
    });
  } else {
    return;
  }
  checkDueDateColor();
}

export {
  addProjectBtnFunctionality,
  getProjectData,
  updateProjectFromArr,
  addTaskToProjectArray,
};
