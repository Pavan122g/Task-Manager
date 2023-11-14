document.addEventListener('DOMContentLoaded', function () {
    const tasksContainer = document.getElementById('tasks-container');
    const taskForm = document.getElementById('task-form');

    // Function to fetch tasks from the API
    async function fetchTasks() {
        const response = await fetch('http://localhost:5000/tasks');  // Replace with your API endpoint
        const data = await response.json();
        return data.tasks;
    }

    // Function to render tasks on the page
    function renderTasks(tasks) {
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <div>${task.title}</div>
                <div>
                    <button onclick="markAsCompleted(${task.id})">Mark Completed</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            tasksContainer.appendChild(taskElement);
        });
    }

    // Function to add a new task
    async function addTask(title) {
        const response = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, completed: false }),
        });
        const data = await response.json();
        return data.task;
    }

    // Function to mark a task as completed
    async function markAsCompleted(taskId) {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: true }),
        });
        const data = await response.json();
        return data.task;
    }

    // Function to delete a task
    async function deleteTask(taskId) {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.result;
    }

    // Event listener for the form submission
    taskForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const taskTitle = document.getElementById('task-title').value;
        if (taskTitle.trim() !== '') {
            const newTask = await addTask(taskTitle);
            const tasks = await fetchTasks();
            renderTasks(tasks);
        }
        taskForm.reset();
    });

    // Initial fetch and render when the page loads
    (async function () {
        const tasks = await fetchTasks();
        renderTasks(tasks);
    })();
});

