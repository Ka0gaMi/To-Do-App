import { format, parseISO } from "date-fns";
import moment from "moment";
import { addTaskToProjectArray } from "./project-form";

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
      const labelTask = e.target.parentElement.parentElement;
      const label = e.target.parentElement;

      labelTask.classList.add("done");
      label.classList.add("done");

      tasks[e.target.id].completed = true;

      appendToCompleted(labelTask);
    } else {
      const labelTask = e.target.parentElement.parentElement;
      const label = e.target.parentElement;

      labelTask.classList.remove("done");
      label.classList.remove("done");

      tasks[e.target.id].completed = false;

      appendToTasks(labelTask);
    }
  });

  const taskTitle = document.createElement("span");
  taskTitle.classList.add("task-text");
  taskTitle.textContent = task.title;

  taskLabel.appendChild(taskCheck);
  taskLabel.appendChild(taskTitle);

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

    if (project === "inbox") {
      appendToTasks(taskDiv);
    } else {
      addTaskToProjectArray(project, task);
      appendToTasks(taskDiv);
    }

    checkPriority(priority, task.id);
    changeDueDateColor(task);

    taskForm.reset();

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

// Check if due date is today //

function checkDueDate(task) {
  const today = moment().format("YYYY-MM-DD");
  const dueDate = task.dueDate;

  console.log(today);

  if (dueDate === today) {
    return true;
  } else {
    return false;
  }
}

// Change due-date-div color if due date is today //

function changeDueDateColor(task) {
  const dueDateDiv = document.querySelector(
    `div[id="${task.id}"].due-date-div`
  );

  if (checkDueDate(task) === true) {
    dueDateDiv.classList.add("due-today");
  } else {
    dueDateDiv.classList.remove("due-today");
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
};
