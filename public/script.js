const API_URL = "/tasks";

// Fetch and display tasks
async function fetchTasks() {
    try {
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
            li.innerHTML = `
                ${task.name} - ${task.completed ? "✅" : "❌"}
                <button onclick="editTask('${task.id}', '${task.name}', '${task.completed}')">Edit</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = `<li style="color: red;">Error loading tasks: ${error.message}</li>`;
    }
}

// Add or update a task
document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("task-id").value || crypto.randomUUID();
    const name = document.getElementById("task-name").value;
    const completed = false;
    
    await fetch(API_URL, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, completed })
    });

    document.getElementById("task-id").value = "";
    document.getElementById("task-name").value = "";
    
    fetchTasks();
});

// Edit task
function editTask(id, name, completed) {
    document.getElementById("task-id").value = id;
    document.getElementById("task-name").value = name;
}

// Delete task
async function deleteTask(id) {
    await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });

    fetchTasks();
}

// Load tasks on page load
fetchTasks();
