const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function updateCounts() {
    const pending = tasks.filter((task) => !task.completed).length;
    const completed = tasks.filter((task) => task.completed).length;

    pendingCount.textContent = `${pending} pending`;
    completedCount.textContent = `${completed} completed`;
}

function createTaskElement(task) {
    const item = document.createElement("article");
    item.className = `task-item ${task.completed ? "completed" : ""}`;

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const time = document.createElement("small");
    time.className = "task-time";
    time.textContent = `Added: ${formatTime(task.createdAt)}`;

    content.appendChild(text);
    content.appendChild(time);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed
        ? "Mark Pending"
        : "Mark Complete";

    completeButton.addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    });

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        startEditing(item, task);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
        saveTasks();
        renderTasks();
    });

    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(content);
    item.appendChild(actions);

    return item;
}

function startEditing(item, task) {
    const content = item.querySelector(".task-content");
    const actions = item.querySelector(".task-actions");

    const editInput = document.createElement("input");
    editInput.className = "edit-input";
    editInput.type = "text";
    editInput.value = task.text;
    editInput.maxLength = 120;

    const saveButton = document.createElement("button");
    saveButton.className = "save-btn";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-btn";
    cancelButton.textContent = "Cancel";

    content.innerHTML = "";
    content.appendChild(editInput);

    actions.innerHTML = "";
    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    editInput.focus();

    saveButton.addEventListener("click", () => {
        const newText = editInput.value.trim();

        if (newText === "") {
            editInput.focus();
            return;
        }

        task.text = newText;
        saveTasks();
        renderTasks();
    });

    cancelButton.addEventListener("click", () => {
        renderTasks();
    });

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveButton.click();
        }

        if (event.key === "Escape") {
            cancelButton.click();
        }
    });
}

function renderTasks() {
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter((task) => !task.completed);
    const completed = tasks.filter((task) => task.completed);

    if (pending.length === 0) {
        pendingTasks.innerHTML = `
            <p class="empty-message">
                No pending tasks. Add something to get started.
            </p>
        `;
    } else {
        pending.forEach((task) => {
            pendingTasks.appendChild(createTaskElement(task));
        });
    }

    if (completed.length === 0) {
        completedTasks.innerHTML = `
            <p class="empty-message">
                No completed tasks yet.
            </p>
        `;
    } else {
        completed.forEach((task) => {
            completedTasks.appendChild(createTaskElement(task));
        });
    }

    updateCounts();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

renderTasks();