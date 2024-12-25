document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskName');
    const taskList = document.getElementById('tasksContainer');
    const crashLog = document.getElementById('crashContainer');

    let tasks = [];
    let crashes = [];

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/tasks'); // Ensure this URL is correct
            if (response.ok) {
                tasks = await response.json();
                updateTaskList(tasks);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Fetch crash logs from the backend
    const fetchCrashes = async () => {
        try {
            const response = await fetch('http://localhost:3000/crash-log'); // Ensure this URL is correct
            if (response.ok) {
                crashes = await response.json();
                updateCrashLog(crashes);
            } else {
                console.error('Failed to fetch crash logs');
            }
        } catch (error) {
            console.error('Error fetching crash logs:', error);
        }
    };

    // Add a force recovery button for each task
    const updateTaskList = (tasks) => {
        taskList.innerHTML = ''; // Clear current task list
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.status.toLowerCase()}`;
            taskDiv.innerHTML = `
                <strong>${task.name}</strong> - Status: ${task.status}
                <div>Progress: ${task.completedChunks} / ${task.totalChunks}</div>
                <div>
                    <progress value="${task.completedChunks}" max="${task.totalChunks}"></progress>
                </div>
                ${task.status === 'crashed' ? `<button class="recoverTaskBtn" data-task-id="${task.id}">Recover</button>` : ''}
            `;
            taskList.appendChild(taskDiv);
        });

        // Add event listeners for the recovery buttons
        const recoverButtons = document.querySelectorAll('.recoverTaskBtn');
            recoverButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const taskId = e.target.getAttribute('data-task-id');
                    await recoverTask(taskId);  // Force recovery only when the button is clicked
                });
            });
        };

    // Function to force task recovery
    const recoverTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/recover-task/${taskId}`, {
                method: 'POST'
            });

            if (response.ok) {
                fetchTasks(); // Refresh the task list
            } else {
                console.error('Failed to recover task');
            }
        } catch (error) {
            console.error('Error recovering task:', error);
        }
    };

    
    // Update the crash log on the page
    const updateCrashLog = (crashes) => {
        crashLog.innerHTML = ''; // Clear current crash log
        crashes.forEach(crash => {
            const crashDiv = document.createElement('div');
            crashDiv.className = 'crash';
            crashDiv.innerHTML = `
                <strong>Task crash</strong> in task "${crash.taskName}" due to ${crash.crashType} - 
                ${new Date(crash.timestamp).toLocaleTimeString()}
            `;
            crashLog.appendChild(crashDiv);
        });
    };


    // Add a new task
    addTaskBtn.addEventListener('click', async () => {
        const taskName = taskNameInput.value.trim();
        if (taskName) {
            try {
                const response = await fetch('http://localhost:3000/add-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: taskName })
                });

                if (response.ok) {
                    fetchTasks(); // Refresh the task list
                    taskNameInput.value = ''; // Clear input
                } else {
                    console.error('Failed to add task');
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    });

    // Initialize
    fetchTasks();
    fetchCrashes();
    setInterval(fetchTasks, 2000); // Update task list periodically
    setInterval(fetchCrashes, 2000); // Update crash log periodically
});
