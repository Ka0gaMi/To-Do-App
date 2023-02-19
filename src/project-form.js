import { changeTab } from "./tabs";

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

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = document.getElementById("project-title").value;

    const project = createProject(generateRandomProjectId(), projectName);

    addProject(project);

    const projectDiv = createProjectDiv(projectName, project.id);

    addProjectToDropdown(projectDiv);

    projectForm.reset();
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
    changeTab("project-main", e.target.textContent, true);

    const projectName = document.querySelector(".main-header-title");
    projectName.setAttribute("id", e.target.id);
    console.log(projectsArr);
    projectNameChangeFunctionality();
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
}

export { addProjectBtnFunctionality, getProjectData };
