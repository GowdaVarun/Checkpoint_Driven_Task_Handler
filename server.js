const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];
let crashes = [];
let isProcessing = false;

const processNextTask = () => {
    if (isProcessing) return;
    const task = tasks.find(t => t.status === 'pending' || t.status === 'processing');
    
    if (!task) return; // No tasks to process

    // Only start a task if it's not recovering
    if (task.status === 'recovering') return;

    isProcessing = true;
    task.status = 'processing';

    const crashTypes = ['network failure', 'disk error', 'timeout', 'resource exhaustion', 'unexpected error'];

    const interval = setInterval(() => {
        if (task.completedChunks < task.totalChunks) {
            task.completedChunks++;

            // Simulate a crash at random points
            if (task.completedChunks === task.forceCrash) {
                const crashType = crashTypes[Math.floor(Math.random() * crashTypes.length)];
                crashes.push({ 
                    taskName: task.name, 
                    crashType: crashType, 
                    timestamp: new Date().toISOString() 
                });
                task.status = 'crashed'; // Mark the task as recovering
                clearInterval(interval);
                isProcessing = false;

                // Simulate task recovery after a short delay
                setTimeout(() => {
                    // Don't immediately retry, wait for recovery action
                    processNextTask(); // Wait for manual recovery
                }, 2000); // Recovery delay
                return;
            }
        } else {
            task.status = 'completed';
            clearInterval(interval);
            isProcessing = false;
            processNextTask(); // Move to the next task
        }
    }, 1000);
};


// POST endpoint to add a new task
app.post('/add-task', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Task name is required' });
    }

    const newTask = {
        id: Date.now(),
        name,
        totalChunks: Math.floor(Math.random() * 8) + 3,
        completedChunks: 0,
        status: 'pending',
        forceCrash: Math.floor(Math.random() * 3) + 1 // Random crash point
    };

    tasks.push(newTask);
    processNextTask(); // Start processing tasks
    res.status(200).json({ message: 'Task added successfully', task: newTask });
});

// POST endpoint to recover a task
app.post('/recover-task/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.find(t => t.id === parseInt(taskId));

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Do not reset completedChunks, instead continue from the last completed chunk
    task.status = 'pending';  // Reset to 'pending' to allow it to be processed again
    task.forceCrash = Math.floor(Math.random() * 3) + 1; // Assign a new random crash point for retries

    // Optionally, requeue the task for processing
    processNextTask();

    res.status(200).json({ message: 'Task recovery initiated' });
});

// GET endpoint to get tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET endpoint to get crash logs
app.get('/crash-log', (req, res) => {
    res.json(crashes);
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
