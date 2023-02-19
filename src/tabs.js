import {
  datePickerButtonFunctionality,
  datePickerTextFunctionality,
  getTaskData,
  taskFormFunctionality,
  checkInboxTasks,
  checkTodayTasks,
  checkUpcomingTasks,
  checkDueDateColor,
  changePriorityColor,
} from "./task";

import { updateProjectFromArr } from "./project-form";
import moment from "moment";

// Tab creator //

function createTab(tabname, title, contentEditable, tabId) {
  const tab = document.createElement("div");
  tab.classList.add(tabname);
  tab.setAttribute("id", tabId);

  tab.appendChild(createMainHeader(title, contentEditable));
  tab.appendChild(createTasksTab());
  tab.appendChild(createAddTaskBtn());
  tab.appendChild(createAddTaskForm(title));
  tab.appendChild(createCompletedTab());
  tab.appendChild(createProjectForm());

  return tab;
}

function createMainHeader(title, content = false) {
  const mainHeader = document.createElement("div");
  mainHeader.classList.add("main-header");

  const mainHeaderTitle = document.createElement("h3");
  mainHeaderTitle.textContent = title;
  mainHeaderTitle.classList.add("main-header-title");
  mainHeaderTitle.setAttribute("contenteditable", content);

  const mainHeaderButton = document.createElement("button");
  mainHeaderButton.classList.add("show-done");
  mainHeaderButton.setAttribute("id", "show-done");
  mainHeaderButton.innerHTML = '<i class="uil uil-eye-slash"></i>';

  mainHeader.appendChild(mainHeaderTitle);
  mainHeader.appendChild(mainHeaderButton);

  return mainHeader;
}

function createTasksTab() {
  const divTasks = document.createElement("div");
  divTasks.classList.add("div-tasks");

  return divTasks;
}

function createAddTaskBtn() {
  const addTaskDiv = document.createElement("div");
  addTaskDiv.classList.add("add-task-button");

  const addTaskBtn = document.createElement("button");
  addTaskBtn.classList.add("add-task");
  addTaskBtn.setAttribute("id", "add-task");

  const addTaskBtnIcon = document.createElement("i");
  addTaskBtnIcon.classList.add("uil");
  addTaskBtnIcon.classList.add("uil-plus");

  const addTaskBtnSpan = document.createElement("span");
  addTaskBtnSpan.textContent = "Add task";

  addTaskBtn.appendChild(addTaskBtnIcon);
  addTaskBtn.appendChild(addTaskBtnSpan);

  addTaskDiv.appendChild(addTaskBtn);

  return addTaskDiv;
}

// Creating the form //

function createAddTaskForm(title) {
  const addTaskFormDiv = document.createElement("div");
  addTaskFormDiv.classList.add("add-task-form");

  const addTaskForm = document.createElement("form");
  addTaskForm.classList.add("task-form");

  addTaskForm.appendChild(createInputDiv(title));
  addTaskForm.appendChild(document.createElement("hr"));
  addTaskForm.appendChild(createFormButtons());
  addTaskFormDiv.appendChild(addTaskForm);

  return addTaskFormDiv;
}

function createInputDiv(title) {
  const formInputDiv = document.createElement("div");
  formInputDiv.classList.add("form-input");

  const formTitle = document.createElement("input");
  formTitle.setAttribute("type", "text");
  formTitle.setAttribute("placeholder", "Title");
  formTitle.setAttribute("id", "title");
  formTitle.setAttribute("required", "required");

  const formDescription = document.createElement("input");
  formDescription.setAttribute("type", "text");
  formDescription.setAttribute("placeholder", "Description");
  formDescription.setAttribute("id", "description");
  formDescription.setAttribute("required", "required");

  formInputDiv.appendChild(formTitle);
  formInputDiv.appendChild(formDescription);
  formInputDiv.appendChild(createInputButtons(title));

  return formInputDiv;
}

function createInputButtons(title) {
  const inputButtons = document.createElement("div");
  inputButtons.classList.add("input-buttons");

  const dateButton = document.createElement("button");
  dateButton.classList.add("date-picker");

  const dateButtonIcon = document.createElement("i");
  dateButtonIcon.classList.add("uil");
  dateButtonIcon.classList.add("uil-calendar-alt");

  const dateButtonInput = document.createElement("input");
  dateButtonInput.setAttribute("type", "date");
  dateButtonInput.setAttribute("id", "due-date");
  dateButtonInput.classList.add("datePicker");
  dateButtonInput.setAttribute("value", moment().format("YYYY-MM-DD"));
  if (title === "Today") {
    dateButtonInput.setAttribute("min", moment().format("YYYY-MM-DD"));
    dateButtonInput.setAttribute("max", moment().format("YYYY-MM-DD"));
  } else if (title === "Upcoming") {
    dateButtonInput.setAttribute(
      "min",
      moment().add(1, "days").format("YYYY-MM-DD")
    );
  }

  const dateButtonSpan = document.createElement("span");
  dateButtonSpan.setAttribute("id", "date-span");
  dateButtonSpan.textContent = "Due date";

  dateButton.appendChild(dateButtonIcon);
  dateButton.appendChild(dateButtonInput);
  dateButton.appendChild(dateButtonSpan);

  inputButtons.appendChild(dateButton);
  inputButtons.appendChild(createPrioritySelect());

  return inputButtons;
}

function createPrioritySelect() {
  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("id", "priority");
  prioritySelect.classList.add("priority");
  prioritySelect.setAttribute("name", "priority");
  prioritySelect.setAttribute("required", "required");

  const prioritySelectOption1 = document.createElement("option");
  prioritySelectOption1.setAttribute("value", "none");
  prioritySelectOption1.setAttribute("selected", "selected");
  prioritySelectOption1.setAttribute("disabled", "disabled");
  prioritySelectOption1.textContent = "Priority:";

  const prioritySelectOption2 = document.createElement("option");
  prioritySelectOption2.setAttribute("value", "high");
  prioritySelectOption2.textContent = "High";
  prioritySelectOption2.classList.add("high");

  const prioritySelectOption3 = document.createElement("option");
  prioritySelectOption3.setAttribute("value", "medium");
  prioritySelectOption3.textContent = "Medium";
  prioritySelectOption3.classList.add("medium");

  const prioritySelectOption4 = document.createElement("option");
  prioritySelectOption4.setAttribute("value", "low");
  prioritySelectOption4.textContent = "Low";
  prioritySelectOption4.classList.add("low");

  const prioritySelectOption5 = document.createElement("option");
  prioritySelectOption5.setAttribute("value", "no-priority");
  prioritySelectOption5.textContent = "No priority";
  prioritySelectOption5.classList.add("no-priority");

  prioritySelect.appendChild(prioritySelectOption1);
  prioritySelect.appendChild(prioritySelectOption2);
  prioritySelect.appendChild(prioritySelectOption3);
  prioritySelect.appendChild(prioritySelectOption4);
  prioritySelect.appendChild(prioritySelectOption5);

  return prioritySelect;
}

function createFormButtons() {
  const formButtons = document.createElement("div");
  formButtons.classList.add("form-buttons");

  formButtons.appendChild(createProjectSelect());
  formButtons.appendChild(createMainFormButtons());

  return formButtons;
}

function createProjectSelect() {
  const projectSelect = document.createElement("select");
  projectSelect.setAttribute("id", "project");
  projectSelect.setAttribute("name", "project");
  projectSelect.classList.add("project");

  const projectSelectOption1 = document.createElement("option");
  projectSelectOption1.setAttribute("value", "inbox");
  projectSelectOption1.textContent = "Inbox";

  projectSelect.appendChild(projectSelectOption1);

  return projectSelect;
}

function createMainFormButtons() {
  const mainFormButtons = document.createElement("div");
  mainFormButtons.classList.add("main-form-buttons");

  const mainFormButtonsCancel = document.createElement("button");
  mainFormButtonsCancel.classList.add("add-task-cancel");
  mainFormButtonsCancel.setAttribute("type", "reset");
  mainFormButtonsCancel.innerHTML = "<span>Cancel</span>";

  const mainFormButtonsSubmit = document.createElement("button");
  mainFormButtonsSubmit.classList.add("add-task-submit");
  mainFormButtonsSubmit.setAttribute("type", "submit");
  mainFormButtonsSubmit.innerHTML = "<span>Submit</span>";

  mainFormButtons.appendChild(mainFormButtonsCancel);
  mainFormButtons.appendChild(mainFormButtonsSubmit);

  return mainFormButtons;
}

// Creating completed tab //

function createCompletedTab() {
  const completed = document.createElement("div");
  completed.classList.add("completed");

  const completedTitle = document.createElement("h3");
  completedTitle.textContent = "Completed";

  completed.appendChild(completedTitle);

  return completed;
}

// Creating project form //

function createProjectForm() {
  const projectFormDiv = document.createElement("div");
  projectFormDiv.classList.add("add-project");

  const projectForm = document.createElement("form");
  projectForm.setAttribute("id", "add-project-form");
  projectForm.classList.add("add-project-form");

  const projectFormInput = document.createElement("div");
  projectFormInput.classList.add("form-input");

  const projectFormInputName = document.createElement("input");
  projectFormInputName.setAttribute("type", "text");
  projectFormInputName.setAttribute("id", "project-name");
  projectFormInputName.setAttribute("placeholder", "project-name");

  projectFormInput.appendChild(projectFormInputName);

  const projectFormButtons = document.createElement("div");
  projectFormButtons.classList.add("form-buttons");

  const projectFormButtonsCancel = document.createElement("button");
  projectFormButtonsCancel.classList.add("add-project-cancel");
  projectFormButtonsCancel.setAttribute("type", "reset");
  projectFormButtonsCancel.innerHTML = "<span>Cancel</span>";

  const projectFormButtonsSubmit = document.createElement("button");
  projectFormButtonsSubmit.classList.add("add-project-submit");
  projectFormButtonsSubmit.setAttribute("type", "submit");
  projectFormButtonsSubmit.innerHTML = "<span>Add project</span>";

  projectFormButtons.appendChild(projectFormButtonsCancel);
  projectFormButtons.appendChild(projectFormButtonsSubmit);

  projectForm.appendChild(projectFormInput);
  projectForm.appendChild(projectFormButtons);

  projectFormDiv.appendChild(projectForm);

  return projectFormDiv;
}

// Adding the tab to the DOM //

function addTab(tabname, title, contentEditable = false, tabId) {
  const mainHead = document.querySelector(".main-head");

  mainHead.appendChild(createTab(tabname, title, contentEditable, tabId));

  taskFormFunctionality();
  datePickerButtonFunctionality();
  datePickerTextFunctionality();
  getTaskData();

  showButtonFunctionality();
  updateProjectFromArr();
}

function removeTab() {
  const mainHead = document.querySelector(".main-head");

  mainHead.innerHTML = "";
}

// Change tab functionality //

function changeTab(tabname, title, contentEditable = false, tabId = "inbox") {
  removeTab();
  addTab(tabname, title, contentEditable, tabId);
  if (title === "Inbox") {
    checkInboxTasks();
  } else if (title === "Today") {
    checkTodayTasks();
  } else if (title === "Upcoming") {
    checkUpcomingTasks();
  }
  checkDueDateColor();
  changePriorityColor();
}

// Show button functionality //

function showButtonFunctionality() {
  const showButton = document.getElementById("show-done");

  const handleClick = () => {
    const showButton = document.getElementById("show-done");
    const completedDiv = document.querySelector(".completed");

    if (showButton.innerHTML === '<i class="uil uil-eye"></i>') {
      showButton.innerHTML = '<i class="uil uil-eye-slash"></i>';
      document.querySelectorAll(".tasks").forEach((item) => {
        item.classList.remove("visible");
      });
      completedDiv.classList.remove("visible");
    } else {
      showButton.innerHTML = '<i class="uil uil-eye"></i>';
      document.querySelectorAll(".done").forEach((item) => {
        if (item.classList.contains("done")) {
          item.classList.add("visible");
        }
      });
      completedDiv.classList.add("visible");
    }
  };

  showButton.addEventListener("click", handleClick);
}

export { changeTab };
