import { format, parseISO } from "date-fns";

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

function createTask(id, title, description, dueDate, priority) {
  const task = {
    id,
    title,
    description,
    dueDate,
    priority,
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

      appendToCompleted(labelTask);
    } else {
      const labelTask = e.target.parentElement.parentElement;
      const label = e.target.parentElement;

      labelTask.classList.remove("done");
      label.classList.remove("done");

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

// Get task data from form //

function getTaskData() {
  const taskForm = document.querySelector(".task-form");

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;

    const task = createTask(
      generateRandomId(),
      title,
      description,
      dueDate,
      priority
    );

    addTask(task);

    const taskDiv = createTaskDiv(task);

    appendToTasks(taskDiv);

    taskForm.reset();
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

export {
  datePickerButtonFunctionality,
  datePickerTextFunctionality,
  taskFormFunctionality,
  getTaskData,
};
