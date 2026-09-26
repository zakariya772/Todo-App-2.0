const taskInput = document.querySelector(".task-input");
const addBtn = document.querySelector(".add-btn")
let taskList = document.querySelector(".task-list")
const emptyState = document.querySelector(".empty-state")
const taskCount = document.querySelector(".task-count")
const filters = document.querySelector(".filters")
const savedList = localStorage.getItem("lists")
let lists = savedList ? JSON.parse(savedList) :  []
let currentFilter = "all"
filterTask(currentFilter)

filters.addEventListener("click", function (e) {
    if (e.target.classList.contains("completed")) {
        currentFilter = "completed"
        filterTask(currentFilter)
    } else if (e.target.classList.contains("active")) {
        currentFilter = "active"
        filterTask(currentFilter)
    } else if (e.target.classList.contains("all")) {
        currentFilter = "all"
        filterTask(currentFilter)
    } else if (e.target.classList.contains("clear")) {
        currentFilter = "clear completed"
        filterTask(currentFilter)
    }
})

function filterTask(filterType) {
     let visibleTasks = lists
    if (lists.length === 0) {
        updataUI(visibleTasks)
        updateTaskCount(lists)
        return
    }
    if (filterType === "completed") {
        visibleTasks = lists.filter(task => task.completed)
    } else if (filterType === "active") {
        visibleTasks = lists.filter(task => !task.completed)
    } else if (filterType === "clear completed") {
        lists = lists.filter(task => !task.completed)
        saveToLocalStorage()
        visibleTasks = lists
    } else if (filterType === "all"){
        visibleTasks = lists
    } 
      updateTaskCount(lists)
      updataUI(visibleTasks)

}
function updataUI(list) {
    display(list)
    re_render(list)
}

function saveToLocalStorage() {
    localStorage.setItem("lists",JSON.stringify(lists))
}

function createTask() {
    const value = taskInput.value.trim()
    if (value === "") return;
    const obj = {
        id: Date.now(),
        name: value,
        completed: false,
        edit: false
    }
    lists.push(obj)
    saveToLocalStorage()
    return obj
}

function render(newTask) {
    const data = newTask
    const task = document.createElement("li")
    task.dataset.id = data.id;
    task.className = `task ${data.completed ? "completed" : ""}`
    task.innerHTML = `<input type="checkbox" class="checked" ${data.completed ? "checked" : ""} ><span class="task-content">${data.edit ? `<input type="text" class="edit-input" value = "${data.name}">` : `<span class="task-text">${data.name}</span>`}<button class="edit-btn">edit</button><button class="save-btn">save</button><button class="delete-btn">❌</button></span>`
    taskList.append(task)
}

function re_render(tasks) {
    taskList.innerHTML = ""
    tasks.forEach(task => render(task))
}

function addTask() {
    const task = createTask()
    if (!task) return
    taskInput.value = ""
    filterTask(currentFilter)
}

function updateTaskCount(tasks) {
    const taskLeft = tasks.filter(task=>!task.completed).length
    taskCount.textContent = `${taskLeft} Task${taskLeft !== 1 ? "s" : ""} left`
}

function display(list) {
    console.log(list, "lists 😊")
    if (list.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none"
    }
}


function taskOperations(e) {
    const task = e.target.closest(".task")
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(task.dataset.id)
        task.classList.add("deleted")
        task.addEventListener("transitionend", () => {
        lists = lists.filter(task => task.id !== id)
        saveToLocalStorage()
        filterTask(currentFilter)
        }, { once: true })
    } else if (e.target.classList.contains("edit-btn")) {
        console.log(e.target)

        const id = Number(task.dataset.id)
        const editItem = lists.find(task => task.id === id)
        if (!editItem) return
        editItem.edit = true
        saveToLocalStorage()
        filterTask(currentFilter)
        const newTask = taskList.querySelector(`[data-id="${id}"]`)
        const editInput = newTask.querySelector(".edit-input")
        editInput.focus()
        editInput.select()

        console.log(editInput)
        console.log(newTask)
    } else if (e.target.classList.contains("save-btn")) {
        const id = Number(task.dataset.id);
        const editItem = lists.find(item => item.id === id)
        const newTask = taskList.querySelector(`[data-id = "${id}"]`)
        const editInput = newTask?.querySelector(".edit-input")
        const editValue = editInput?.value
        if (!editValue) return
        editItem.name = editValue
        editItem.edit = false
        saveToLocalStorage()
        filterTask(currentFilter)
    }
    else if (e.target.classList.contains("checked")) {
        const checked = e.target.checked
        const id = Number(task.dataset.id)
        const markCompleted = lists.find(task => task.id === id)
        if (!markCompleted) return
        markCompleted.completed = checked
        saveToLocalStorage()
        task.classList.toggle("completed")
        task.addEventListener("transitionend", () => {
            filterTask(currentFilter)
        }, { once: true })
    }

}
addBtn.addEventListener("click", addTask)
taskList.addEventListener("click", taskOperations);

