// Setting Up Variables
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");

// Focus On Input Field + Load Saved Tasks
window.onload = function () {
  theInput.focus();
  loadTasksFromLocalStorage();
};

// ==================== Add Task ====================
theAddButton.onclick = function () {
  if (theInput.value === "") {
    console.log("No Value");
  } else {
    let noTasksMsg = document.querySelector(".no-tasks-message");
    if (noTasksMsg) noTasksMsg.remove();

    createTaskElement(theInput.value, false);

    addTaskToLocalStorage(theInput.value, false);

    theInput.value = "";
    theInput.focus();

    calculateTasks();
  }
};

// ==================== Create Task Element ====================
function createTaskElement(taskText, isCompleted) {
  let mainSpan = document.createElement("span");
  let deleteElement = document.createElement("span");
  let text = document.createTextNode(taskText);
  let deleteText = document.createTextNode("Delete");

  mainSpan.appendChild(text);
  mainSpan.className = "task-box";
  if (isCompleted) mainSpan.classList.add("finished");

  deleteElement.appendChild(deleteText);
  deleteElement.className = "delete";

  mainSpan.appendChild(deleteElement);
  tasksContainer.appendChild(mainSpan);
}

// ==================== LocalStorage Functions ====================
function addTaskToLocalStorage(taskText, isCompleted) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length === 0) {
    createNoTasks();
  } else {
    tasks.forEach((task) => createTaskElement(task.text, task.completed));
  }
  calculateTasks();
}

function updateLocalStorage() {
  let allTasks = [];
  document.querySelectorAll(".tasks-content .task-box").forEach((taskEl) => {
    allTasks.push({
      text: taskEl.firstChild.textContent,
      completed: taskEl.classList.contains("finished"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// ==================== Click Events ====================
document.addEventListener("click", function (e) {
  // Delete Task
  if (e.target.className == "delete") {
    e.target.parentNode.remove();
    updateLocalStorage();

    if (tasksContainer.childElementCount == 0) {
      createNoTasks();
    }
  }

  // Mark As Finished
  if (e.target.classList.contains("task-box")) {
    e.target.classList.toggle("finished");
    updateLocalStorage();
  }

  calculateTasks();
});

// ==================== Helpers ====================
function createNoTasks() {
  let msgSpan = document.createElement("span");
  let msgText = document.createTextNode("No Tasks To Show");
  msgSpan.appendChild(msgText);
  msgSpan.className = "no-tasks-message";
  tasksContainer.appendChild(msgSpan);
}

function calculateTasks() {
  tasksCount.innerHTML = document.querySelectorAll(
    ".tasks-content .task-box"
  ).length;
  tasksCompleted.innerHTML = document.querySelectorAll(
    ".tasks-content .finished"
  ).length;
}

// ==================== Delete All / Finish All ====================
let deleteAllBtn = document.getElementById("delete-all");
let finishAllBtn = document.getElementById("finish-all");

// Delete All
deleteAllBtn.onclick = function () {
  tasksContainer.innerHTML = "";
  localStorage.removeItem("tasks");
  createNoTasks();
  calculateTasks();
};

// Finish All
finishAllBtn.onclick = function () {
  let tasks = document.querySelectorAll(".tasks-content .task-box");
  tasks.forEach((task) => task.classList.add("finished"));
  updateLocalStorage();
  calculateTasks();
};
