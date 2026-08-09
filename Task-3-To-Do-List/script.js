/* =========================================
   VARIABLES
========================================= */

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let editingTaskId = null;


/* =========================================
   HTML ELEMENTS
========================================= */

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const errorMessage =
    document.getElementById("errorMessage");

const category =
    document.getElementById("category");

const priority =
    document.getElementById("priority");

const dueDate =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filterSelect =
    document.getElementById("filterSelect");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const taskCount =
    document.getElementById("taskCount");

const themeToggle =
    document.getElementById("themeToggle");


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD / EDIT TASK
========================================= */

addTaskBtn.addEventListener("click", () => {

    const text =
        taskInput.value.trim();


    /* Validation */

    if (text === "") {

        errorMessage.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;

    }


    if (text.length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        taskInput.focus();

        return;

    }


    errorMessage.textContent = "";


    /* EDIT EXISTING TASK */

    if (editingTaskId !== null) {

        const task =
            tasks.find(
                item =>
                    item.id === editingTaskId
            );


        if (task) {

            task.text = text;

            task.category =
                category.value;

            task.priority =
                priority.value;

            task.dueDate =
                dueDate.value;

        }


        editingTaskId = null;

        addTaskBtn.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Task';

    }


    /* ADD NEW TASK */

    else {

        const newTask = {

            id: Date.now(),

            text: text,

            category:
                category.value,

            priority:
                priority.value,

            dueDate:
                dueDate.value,

            completed: false

        };


        tasks.push(newTask);

    }


    saveTasks();

    clearForm();

    renderTasks();

});


/* =========================================
   CLEAR FORM
========================================= */

function clearForm() {

    taskInput.value = "";

    category.value = "Personal";

    priority.value = "Medium";

    dueDate.value = "";

    errorMessage.textContent = "";

    editingTaskId = null;

    addTaskBtn.innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Task';

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filter =
        filterSelect.value;


    const filteredTasks =
        tasks.filter(task => {

            /* Search */

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchText);


            if (!matchesSearch) {

                return false;

            }


            /* Filters */

            if (
                filter === "completed" &&
                !task.completed
            ) {

                return false;

            }


            if (
                filter === "pending" &&
                task.completed
            ) {

                return false;

            }


            if (
                filter === "high" &&
                task.priority !== "High"
            ) {

                return false;

            }


            if (
                filter === "medium" &&
                task.priority !== "Medium"
            ) {

                return false;

            }


            if (
                filter === "low" &&
                task.priority !== "Low"
            ) {

                return false;

            }


            return true;

        });


    /* Empty state */

    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    /* Create task cards */

    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(
            taskElement
        );

    });


    updateStatistics();

}


/* =========================================
   CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {

    const div =
        document.createElement("div");


    div.className = "task";


    if (task.completed) {

        div.classList.add("completed");

    }


    /* Checkbox */

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className =
        "task-check";

    checkbox.checked =
        task.completed;


    checkbox.addEventListener(
        "change",
        () => {

            toggleTask(task.id);

        }
    );


    /* Content */

    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const title =
        document.createElement("div");

    title.className =
        "task-title";

    title.textContent =
        task.text;


    /* Details */

    const details =
        document.createElement("div");

    details.className =
        "task-details";


    /* Category */

    const categoryTag =
        document.createElement("span");

    categoryTag.className =
        "tag";

    categoryTag.textContent =
        task.category;


    /* Priority */

    const priorityTag =
        document.createElement("span");

    priorityTag.className =
        "tag";


    if (task.priority === "High") {

        priorityTag.classList.add(
            "priority-high"
        );

    }

    else if (
        task.priority === "Medium"
    ) {

        priorityTag.classList.add(
            "priority-medium"
        );

    }

    else {

        priorityTag.classList.add(
            "priority-low"
        );

    }


    priorityTag.textContent =
        task.priority;


    details.appendChild(
        categoryTag
    );

    details.appendChild(
        priorityTag
    );


    /* Due Date */

    if (task.dueDate !== "") {

        const dateTag =
            document.createElement("span");

        dateTag.className =
            "tag due-date";

        dateTag.innerHTML =
            `<i class="fa-solid fa-calendar"></i>
             ${formatDate(task.dueDate)}`;

        details.appendChild(
            dateTag
        );

    }


    content.appendChild(title);

    content.appendChild(details);


    /* Actions */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* Edit */

    const editBtn =
        document.createElement("button");

    editBtn.className =
        "edit-btn";

    editBtn.title =
        "Edit Task";

    editBtn.innerHTML =
        '<i class="fa-solid fa-pen"></i>';


    editBtn.addEventListener(
        "click",
        () => {

            editTask(task.id);

        }
    );


    /* Delete */

    const deleteBtn =
        document.createElement("button");

    deleteBtn.className =
        "delete-btn";

    deleteBtn.title =
        "Delete Task";

    deleteBtn.innerHTML =
        '<i class="fa-solid fa-trash"></i>';


    deleteBtn.addEventListener(
        "click",
        () => {

            deleteTask(task.id);

        }
    );


    actions.appendChild(editBtn);

    actions.appendChild(deleteBtn);


    /* Assemble */

    div.appendChild(checkbox);

    div.appendChild(content);

    div.appendChild(actions);


    return div;

}


/* =========================================
   COMPLETE / PENDING
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item =>
                item.id === id
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    saveTasks();

    renderTasks();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(
            item =>
                item.id === id
        );


    if (!task) {

        return;

    }


    taskInput.value =
        task.text;

    category.value =
        task.category;

    priority.value =
        task.priority;

    dueDate.value =
        task.dueDate;


    editingTaskId =
        id;


    addTaskBtn.innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Task';


    taskInput.focus();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {

    const parts =
        date.split("-");


    if (parts.length !== 3) {

        return date;

    }


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;


    taskCount.textContent =
        `${total} ${total === 1 ? "task" : "tasks"}`;

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();

    }
);


/* =========================================
   FILTER
========================================= */

filterSelect.addEventListener(
    "change",
    () => {

        renderTasks();

    }
);


/* =========================================
   ENTER KEY
========================================= */

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTaskBtn.click();

        }

    }
);


/* =========================================
   DARK MODE
========================================= */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        if (darkMode) {

            themeToggle.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        } else {

            themeToggle.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

        }

    }
);


/* =========================================
   LOAD DARK MODE
========================================= */

const savedDarkMode =
    localStorage.getItem("darkMode");


if (savedDarkMode === "true") {

    document.body.classList.add("dark");

    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


/* =========================================
   INITIAL DISPLAY
========================================= */

renderTasks();