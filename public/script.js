const API_URL = "/tasks";
console.log(API_URL);
// Loading spinner functions
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('hidden');
    document.getElementById('task-list').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('hidden');
    document.getElementById('task-list').classList.remove('hidden');
}

// Fetch and display tasks
async function fetchTasks() {
    try {
        showLoading();
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const tasks = await res.json();
        
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";

        // Ensure tasks is an array
        const tasksArray = Array.isArray(tasks) ? tasks : [];
        
        if (tasksArray.length === 0) {
            taskList.innerHTML = "<li>No tasks found</li>";
            return;
        }

        tasksArray.forEach(task => {
            const li = document.createElement("li");
            const taskContent = document.createElement("div");
            taskContent.className = "task-content";
            
            const taskName = document.createElement("span");
            taskName.textContent = task.name;
            
            const taskStatus = document.createElement("span");
            taskStatus.className = "task-status";
            taskStatus.textContent = task.completed ? "✅" : "❌";
            
            taskContent.appendChild(taskName);
            taskContent.appendChild(taskStatus);
            
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "task-buttons";
            
            const editButton = document.createElement("button");
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";
            editButton.onclick = () => editTask(task.id, task.name, task.completed);
            
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteTask(task.id);
            
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            
            li.appendChild(taskContent);
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = `<li style="color: red;">Error loading tasks: ${error.message}</li>`;
    } finally {
        hideLoading();
    }
}

// Add or update a task
document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
        showLoading();
        const name = document.getElementById("task-name").value;
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        document.getElementById("task-name").value = "";
        await fetchTasks();
    } catch (error) {
        console.error('Error saving task:', error);
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = `<li style="color: red;">Error saving task: ${error.message}</li>`;
        hideLoading();
    }
});

// Edit task
function editTask(id, name, completed) {
    document.getElementById("task-id").value = id;
    document.getElementById("task-name").value = name;
}

// Delete task
async function deleteTask(id) {
    try {
        showLoading();
        await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        await fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = `<li style="color: red;">Error deleting task: ${error.message}</li>`;
        hideLoading();
    }
}

// Load tasks on page load
fetchTasks();
