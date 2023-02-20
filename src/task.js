import { format, parseISO } from "date-fns";
import moment from "moment";
import {
  addTaskToProjectArray,
  updateProjectFromArr,
  setSelectedProject,
} from "./project-form";

const labels = document.querySelectorAll(".tasks");

// Date picker //

function datePickerButtonFunctionality() {
  const dateButton = document.querySelector(".date-picker");
  const datePicker = document.querySelector(".datePicker");

  dateButton.addEventListener("click", async (e) => {
    try {
      e.preventDefault();
      await datePicker.showPicker();
    } catch (err) {
      console.log(err);
    }
  });
}

function datePickerTextFunctionality() {
  const datePicker = document.querySelector(".datePicker");
  const dateButtonSpan = document.getElementById("date-span");

  datePicker.addEventListener("input", () => {
    dateButtonSpan.textContent = format(parseISO(datePicker.value), "MMM dd");
  });
}

function datePickerReset() {
  const dateButtonSpan = document.getElementById("date-span");

  dateButtonSpan.textContent = "Due Date";
}

// Add task form functionality //

function taskFormFunctionality() {
  const addTaskBtn = document.querySelector(".add-task");
  const addTaskBtnDiv = document.querySelector(".add-task-button");

  addTaskBtn.addEventListener("click", () => {
    addTaskBtnDiv.classList.add("active");
    const addTaskForm = document.querySelector(".add-task-form");
    addTaskForm.classList.add("active");
  });

  const cancelBtn = document.querySelector(".add-task-cancel");

  cancelBtn.addEventListener("click", () => {
    addTaskBtnDiv.classList.remove("active");
    const addTaskForm = document.querySelector(".add-task-form");
    addTaskForm.classList.remove("active");
  });
}

// Generate random ID //

function generateRandomId() {
  return Math.floor(Math.random() * 100000000);
}

// Task array //

const tasks = {};

// Task factory function //

function createTask(id, title, description, dueDate, priority, project) {
  const task = {
    id,
    title,
    description,
    dueDate,
    priority,
    project,
    completed: false,
  };

  return task;
}

// Add task to tasks array //

function addTask(task) {
  tasks[task.id] = task;
}

// Create task div //

function createTaskDiv(task) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("label-tasks");
  taskDiv.setAttribute("id", task.id);

  taskDiv.appendChild(createTaskLabel(task));
  taskDiv.appendChild(createCommentDiv(task));
  taskDiv.appendChild(createDueDateDiv(task));

  return taskDiv;
}

function createTaskLabel(task) {
  const taskLabel = document.createElement("label");
  taskLabel.classList.add("tasks");
  taskLabel.setAttribute("for", task.id);

  const taskCheck = document.createElement("input");
  taskCheck.setAttribute("type", "checkbox");
  taskCheck.classList.add("round");
  taskCheck.setAttribute("id", task.id);

  taskCheck.addEventListener("click", (e) => {
    if (e.target.checked) {
      const labelTask = e.target.parentElement.parentElement.parentElement;
      const label = e.target.parentElement.parentElement;

      labelTask.classList.add("done");
      label.classList.add("done");

      tasks[e.target.id].completed = true;

      appendToCompleted(labelTask);
    } else {
      const labelTask = e.target.parentElement.parentElement.parentElement;
      const label = e.target.parentElement.parentElement;

      labelTask.classList.remove("done");
      label.classList.remove("done");

      tasks[e.target.id].completed = false;

      appendToTasks(labelTask);
    }
  });

  const taskTitle = document.createElement("span");
  taskTitle.classList.add("task-text");
  taskTitle.textContent = task.title;

  const taskCheckTitleDiv = document.createElement("div");
  taskCheckTitleDiv.classList.add("task-check-title");

  taskCheckTitleDiv.appendChild(taskCheck);
  taskCheckTitleDiv.appendChild(taskTitle);

  taskLabel.appendChild(taskCheckTitleDiv);
  taskLabel.appendChild(createEditDeleteButtons(task));

  return taskLabel;
}

function createCommentDiv(task) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");

  const comment = document.createElement("span");
  comment.classList.add("comment");
  comment.textContent = task.description;

  commentDiv.appendChild(comment);

  return commentDiv;
}

// Create Due Date div //

function createDueDateDiv(task) {
  const dueDateDiv = document.createElement("div");
  dueDateDiv.classList.add("due-date-div");
  dueDateDiv.setAttribute("id", task.id);

  const dueDateIcon = document.createElement("i");
  dueDateIcon.classList.add("uil", "uil-calender");

  const dueDate = document.createElement("span");
  dueDate.classList.add("due-date-span");
  dueDate.textContent = format(parseISO(task.dueDate), "MMM dd");

  dueDateDiv.appendChild(dueDateIcon);
  dueDateDiv.appendChild(dueDate);

  return dueDateDiv;
}

// Create edit and delete buttons //

function createEditDeleteButtons(task) {
  const editDeleteDiv = document.createElement("div");
  editDeleteDiv.classList.add("edit-delete-div");

  editDeleteDiv.appendChild(createEditButton(task));
  editDeleteDiv.appendChild(createDeleteButton(task));

  return editDeleteDiv;
}

function createEditButton(task) {
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.setAttribute("id", task.id);

  const editIcon = document.createElement("i");
  editIcon.classList.add("uil", "uil-edit");

  editButton.appendChild(editIcon);

  return editButton;
}

function createDeleteButton(task) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.setAttribute("id", task.id);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("uil", "uil-trash-alt");

  deleteButton.appendChild(deleteIcon);

  return deleteButton;
}

// Edit task //

function editTask(task) {
  const editButton = document.querySelector(
    `button[id="${task.id}"].edit-button`
  );

  editButton.addEventListener("click", (e) => {
    const labelTasks = document.querySelector(`div[id="${task.id}"]`);
    const projectId = labelTasks.parentElement.parentElement.id;

    labelTasks.innerHTML = "";
    labelTasks.appendChild(createEditTaskForm(task));
    setSelectedPriority(task);
    updateProjectFromArr();
    setSelectedProject(projectId);

    const editCancelButton = document.querySelector(".edit-task-cancel");

    editCancelButton.addEventListener("click", (e) => {
      const form =
        e.target.parentElement.parentElement.parentElement.parentElement;
      const taskId = form.parentElement.parentElement.id;
      const labelTasks = document.querySelector(`div[id="${taskId}"]`);

      labelTasks.innerHTML = "";
      const task = tasks[taskId];
      labelTasks.appendChild(createTaskLabel(task));
      labelTasks.appendChild(createCommentDiv(task));
      labelTasks.appendChild(createDueDateDiv(task));
      changeDueDateColor(task);
      checkPriority(tasks[taskId].priority, taskId);
    });
  });
}

// Create edit task form //

function createEditTaskForm(task) {
  const editTaskFormDiv = document.createElement("div");
  editTaskFormDiv.classList.add("edit-task-form-div");

  const editTaskForm = document.createElement("form");
  editTaskForm.classList.add("edit-task-form");

  editTaskForm.appendChild(createEditInput(task));
  editTaskForm.appendChild(document.createElement("hr"));
  editTaskForm.appendChild(createEditFormButtons(task));

  editTaskFormDiv.appendChild(editTaskForm);

  return editTaskFormDiv;
}

function createEditInput(task) {
  const editInputDiv = document.createElement("div");
  editInputDiv.classList.add("edit-input");

  const editInput = document.createElement("input");
  editInput.setAttribute("type", "text");
  editInput.setAttribute("id", "edit-title");
  editInput.setAttribute("value", task.title);

  const editDescription = document.createElement("input");
  editDescription.setAttribute("type", "text");
  editDescription.setAttribute("id", "edit-description");
  editDescription.setAttribute("value", task.description);

  editInputDiv.appendChild(editInput);
  editInputDiv.appendChild(editDescription);
  editInputDiv.appendChild(createEditInputButtons(task));

  return editInputDiv;
}

function createEditInputButtons(task) {
  const editInputButtons = document.createElement("div");
  editInputButtons.classList.add("edit-input-buttons");

  const editDateButton = document.createElement("button");
  editDateButton.classList.add("date-picker");

  const dateButtonIcon = document.createElement("i");
  dateButtonIcon.classList.add("uil");
  dateButtonIcon.classList.add("uil-calendar-alt");

  const dateButtonInput = document.createElement("input");
  dateButtonInput.setAttribute("type", "date");
  dateButtonInput.setAttribute("id", "due-date");
  dateButtonInput.classList.add("datePicker");
  dateButtonInput.setAttribute("value", task.dueDate);
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
  dateButtonSpan.textContent = format(parseISO(task.dueDate), "MMM dd");

  editDateButton.appendChild(dateButtonIcon);
  editDateButton.appendChild(dateButtonInput);
  editDateButton.appendChild(dateButtonSpan);

  editInputButtons.appendChild(editDateButton);
  editInputButtons.appendChild(createEditPrioritySelect());

  return editInputButtons;
}

function createEditPrioritySelect(task) {
  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("id", "priority");
  prioritySelect.classList.add("priority");
  prioritySelect.setAttribute("name", "priority");
  prioritySelect.setAttribute("required", "required");

  const prioritySelectOption1 = document.createElement("option");
  prioritySelectOption1.setAttribute("value", "none");
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

function setSelectedPriority(task) {
  const prioritySelect = document.getElementById("priority");
  const option = prioritySelect.querySelector(
    `option[value="${task.priority}"]`
  );

  option.setAttribute("selected", "selected");
}

function createEditFormButtons() {
  const editFormButtons = document.createElement("div");
  editFormButtons.classList.add("edit-form-buttons");

  editFormButtons.appendChild(createEditProjectSelect());
  editFormButtons.appendChild(createEditMainFormButtons());

  return editFormButtons;
}

function createEditProjectSelect() {
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

function createEditMainFormButtons() {
  const mainFormButtons = document.createElement("div");
  mainFormButtons.classList.add("main-form-buttons");

  const mainFormButtonsCancel = document.createElement("button");
  mainFormButtonsCancel.classList.add("edit-task-cancel");
  mainFormButtonsCancel.setAttribute("type", "reset");
  mainFormButtonsCancel.innerHTML = "<span>Cancel</span>";

  const mainFormButtonsSubmit = document.createElement("button");
  mainFormButtonsSubmit.classList.add("edit-task-submit");
  mainFormButtonsSubmit.setAttribute("type", "submit");
  mainFormButtonsSubmit.innerHTML = "<span>Submit</span>";

  mainFormButtons.appendChild(mainFormButtonsCancel);
  mainFormButtons.appendChild(mainFormButtonsSubmit);

  return mainFormButtons;
}

// Check task priority //

function checkPriority(priority, taskId) {
  const checkbox = document.querySelector(`input[id="${taskId}"]`);

  if (priority === "high") {
    checkbox.classList.add("high");
  } else if (priority === "medium") {
    checkbox.classList.add("medium");
  } else if (priority === "low") {
    checkbox.classList.add("low");
  }
}

// Get task data from form //

function getTaskData() {
  const taskForm = document.querySelector(".task-form");

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;
    const project = document.getElementById("project").value;

    const task = createTask(
      generateRandomId(),
      title,
      description,
      dueDate,
      priority,
      project
    );

    addTask(task);

    const taskDiv = createTaskDiv(task);

    if (e.target.parentElement.parentElement.id === "inbox") {
      appendToTasks(taskDiv);
      checkPriority(priority, task.id);
      changeDueDateColor(task);
    } else if (e.target.parentElement.parentElement.id === project) {
      addTaskToProjectArray(project, task);
      appendToTasks(taskDiv);
      checkPriority(priority, task.id);
      changeDueDateColor(task);
    }

    taskForm.reset();
    datePickerReset();
    editTask(task);

    console.log(tasks);
  });
}

// Append task to tasks div //

function appendToTasks(label) {
  const divTasks = document.querySelector(".div-tasks");
  removeHrTag();
  divTasks.appendChild(label);
  addHrTag();
}

// <hr /> between labels//

function addHrTag() {
  const labelTasks = document.querySelectorAll(".label-tasks");

  labelTasks.forEach((labelTask) => {
    // Check if the labelTask already has an <hr> element
    const hr = labelTask.nextElementSibling;
    if (hr !== null && hr.tagName === "HR") {
      return; // If it does, skip to the next labelTask
    }

    // If the labelTask does not have an <hr> element, create one and add it
    const newHr = document.createElement("hr");
    labelTask.insertAdjacentElement("afterend", newHr);
  });

  return labels;
}

// remove <hr /> between labels, when task is done //

function removeHrTag() {
  const labelTasks = document.querySelectorAll(".label-tasks");

  labelTasks.forEach((labelTask) => {
    // Check if the labelTask already has an <hr> element
    const hr = labelTask.nextElementSibling;
    if (hr !== null && hr.tagName === "HR") {
      hr.remove();
    }
  });
}

// Append task to completed div //

function appendToCompleted(label) {
  const completedDiv = document.querySelector(".completed");
  removeHrTag();
  completedDiv.appendChild(label);
  addHrTag();
}

function checked(taskId) {
  const checkmark = document.getElementById(taskId);
  checkmark.checked = true;
}

// Check task array for inbox tasks //

function checkInboxTasks() {
  for (const task in tasks) {
    if (tasks[task].project === "inbox") {
      if (tasks[task].completed === true) {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToCompleted(taskDiv);
        checked(task);
      } else {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToTasks(taskDiv);
      }
    }
  }
}

// Check task array for today tasks //

function checkTodayTasks() {
  for (const task in tasks) {
    if (checkDueDate(tasks[task]) === "today") {
      if (tasks[task].completed === true) {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToCompleted(taskDiv);
        checked(task);
      } else {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToTasks(taskDiv);
      }
    }
  }
}

// Check task array for upcoming tasks //

function checkUpcomingTasks() {
  for (const task in tasks) {
    if (checkDueDate(tasks[task]) === "future") {
      if (tasks[task].completed === true) {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToCompleted(taskDiv);
        checked(task);
      } else {
        const taskDiv = createTaskDiv(tasks[task]);
        appendToTasks(taskDiv);
      }
    }
  }
}

// Check if due date is today //

function checkDueDate(task) {
  const today = moment().format("YYYY-MM-DD");
  const dueDate = task.dueDate;

  console.log(today);

  if (dueDate === today) {
    return "today";
  } else if (dueDate < today) {
    return "past";
  } else {
    return "future";
  }
}

// Change due-date-div color according to due date //

function changeDueDateColor(task) {
  const dueDateDiv = document.querySelector(
    `div[id="${task.id}"].due-date-div`
  );

  if (dueDateDiv === null) {
    return;
  }

  if (checkDueDate(task) === "today") {
    dueDateDiv.classList.add("due-today");
  } else if (checkDueDate(task) === "past") {
    dueDateDiv.classList.add("due-past");
  } else {
    dueDateDiv.classList.add("due-future");
  }
}

// Check due date color in  tasks array //

function checkDueDateColor() {
  for (const task in tasks) {
    changeDueDateColor(tasks[task]);
  }
}

// Change priority color //

function changePriorityColor() {
  for (const task in tasks) {
    const inputPriority = document.querySelector(
      `input[id="${tasks[task].id}"]`
    );

    if (inputPriority === null) {
      return;
    }

    if (tasks[task].priority === "high") {
      inputPriority.classList.add("high");
    } else if (tasks[task].priority === "medium") {
      inputPriority.classList.add("medium");
    } else {
      inputPriority.classList.add("low");
    }
  }
}

export {
  datePickerButtonFunctionality,
  datePickerTextFunctionality,
  taskFormFunctionality,
  getTaskData,
  appendToCompleted,
  appendToTasks,
  createTaskDiv,
  checked,
  checkInboxTasks,
  checkTodayTasks,
  checkUpcomingTasks,
  checkDueDateColor,
  changePriorityColor,
};
