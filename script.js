/**
 * Select Elements
 */
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const filterDropdown = document.getElementById("filter"); // Ensure this is defined

/**
 * Load tasks from local storage and apply dark mode preference
 */
document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    applyDarkModePreference();
});

// Function to add task
/**
 * Function to add a task
 * @param {string} taskText - The text of the task to add
 * @param {boolean} isCompleted - Indicates if the task is completed
 */
function addTask(taskText, isCompleted = false) {
    const li = document.createElement("li");

    li.draggable = true;

    // Create a span for the task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    li.appendChild(taskSpan);

    // Mark as completed if stored as such.
    if (isCompleted) {
        setTimeout(() => li.classList.add("completed"), 0);
    }

    // Remove any existing delete button to avoid duplicates.
    if (li.querySelector("button")) {
        li.querySelector("button").remove();
    }

    // Drag Events.
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);
    
    // Toggle Completion.
    li.addEventListener("click", function() {
        li.classList.toggle("completed");
        saveTasks();
    });

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.marginLeft = "10px";
    
    editButton.addEventListener("click", function() {
        const newTaskText = prompt("Edit your task:", taskSpan.textContent);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskSpan.textContent = newTaskText.trim();
            saveTasks();
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.marginLeft = "10px";

    deleteButton.addEventListener("click", function() {
        li.style.transition = "opacity 0.3s ease-out";
        li.style.opacity = "0";
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 300);
    });

    li.appendChild(editButton); // Append the edit button
    li.appendChild(deleteButton); // Append the delete button

    taskList.appendChild(li);
}

/**
 * Function to save tasks to local storage
 */
function saveTasks() {
    const tasks = [];
    for (let i = 0; i < taskList.children.length; i++) {
        const li = taskList.children[i];
        const isCompleted = li.classList.contains("completed");
        const taskText = li.childNodes[0].textContent.trim();
        tasks.push({ text: taskText, isCompleted });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Function to load tasks from local storage
 */
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i = 0; i < savedTasks.length; i++) {
        const task = savedTasks[i];
        addTask(task.text, task.isCompleted);
    }
    filterTasks();
}

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        addTask(taskText);
        saveTasks();
        taskInput.value = "";
    }
});

let draggedItem = null; // Stores item being dragged.

/**
 * Handle drag start event
 */
function handleDragStart(event) {
    draggedItem = event.target; //stores the dragged item
    event.target.style.opacity = "0.5"; //reduces opacity
}

/**
 * Handle drag over event
 */
function handleDragOver(event) {
    event.preventDefault(); //prevents default drag-over behavior i.e. allows dropping
}

/**
 * Handle drop event
 */
function handleDrop(event) {
    event.preventDefault(); //prevents default drag-over behavior
    if (event.target.tagName === "LI") {
        taskList.insertBefore(draggedItem, event.target.nextSibling);
        saveTasks();
    }
}

/**
 * Handle drag end event
 */
function handleDragEnd(event) {
    event.target.style.opacity = "1"; //restores opacity
    draggedItem = null; //clears dragged item
}

const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    saveDarkModePreference();
});

filterDropdown.addEventListener("change", function() {
    filterTasks();
});

/**
 * Function to apply dark mode preference
 */
function applyDarkModePreference() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }
}

/**
 * Function to save dark mode preference
 */
function saveDarkModePreference() {
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

/**
 * Function to filter tasks based on the selected filter
 */
function filterTasks() {
    const filterValue = filterDropdown.value;
    const tasks = document.querySelectorAll("#taskList li");

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const isCompleted = task.classList.contains("completed");
        if (filterValue === "all") {
            task.style.display = "flex";
        } else if (filterValue === "completed" && isCompleted) {
            task.style.display = "flex";
        } else if (filterValue === "pending" && !isCompleted) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    }
}
