
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const themeToggle = document.getElementById("themeToggle");

let tasks = [];

/* LOAD */
function loadTasks() {
    const data = localStorage.getItem("tasks");
    if (data) {
        tasks = JSON.parse(data);
    }
}

/* SAVE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD */
function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    if (tasks.some(t => t.text === text)) return;

    tasks.push({
        id: Date.now(),
        text: text,
        status: "todo"
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

/* DELETE */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

/* STATUS TOGGLE */
function changeStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.status = task.status === "done" ? "todo" : "done";
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

/* EDIT */
function editTask(id) {
    const task = tasks.find(t => t.id === id);

    const newText = prompt("Edit task:", task.text);
    if (!newText || !newText.trim()) return;

    task.text = newText.trim();

    saveTasks();
    renderTasks();
}

/* RENDER */
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.classList.add("task");

        if (task.status === "done") {
            div.classList.add("done");
        }

        div.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="status-btn" onclick="changeStatus(${task.id})">
                    ${task.status}
                </button>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(div);
    });

    updateStats();
}

/* STATS */
function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(t => t.status === "done").length;
}

/* THEME */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "Light Mode"
            : "Dark Mode";
});

/* EVENTS */
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

/* INIT */
function init() {
    loadTasks();
    renderTasks();
}

init();