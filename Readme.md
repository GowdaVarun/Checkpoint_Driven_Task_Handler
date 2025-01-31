# Checkpoint Driven Task Handler

A real-time task management system with automatic crash simulation and recovery handling.

## Features
- **Task Execution with Checkpoints**: Tasks are divided into chunks, allowing progress tracking and recovery.
- **Randomized Crash Simulation**: Memory, I/O, and network failures are randomly triggered.
- **Automatic & Manual Task Recovery**: Failed tasks can be recovered manually through the UI or automatically.
- **REST API for Task Management**: Includes endpoints for adding tasks, tracking progress, and handling failures.
- **Frontend UI**: Displays real-time task progress, crash logs, and recovery options.

## Technologies Used
- **Backend**: Node.js, Express
- **Frontend**: JavaScript, HTML, CSS
- **Task Execution & Simulation**: C for task processing

## Installation & Usage

### Prerequisites
- Install **Node.js** 
- Install **GCC** (for compiling C code)

### Steps to Run
1. Clone the repository:
   ```bash
   https://github.com/GowdaVarun/Checkpoint_Driven_Task_Handler.git
   cd Checkpoint_Driven_Task_Handler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the C program:
   ```bash
   gcc -o TaskHandler TaskHandler.c
   ```

4. Run the C program to generate tasks:
   ```bash
   ./TaskHandler
   ```

5. Start the Node.js server:
   ```bash
   node server.js
   ```

6. Open `index.html` in a browser to access the UI.

## API Endpoints
- **Add a Task**: `POST /add-task` 
- **Get Tasks**: `GET /tasks`
- **Recover Task**: `POST /recover-task/:taskId`
- **Get Crash Logs**: `GET /crash-log`

## Frontend Functionality
- **Task List**: Displays running tasks with progress bars.
- **Crash Log**: Shows recent crashes and timestamps.
- **Recovery Buttons**: Allows users to manually recover crashed tasks.
- **Auto Updates**: Tasks and crash logs refresh every 2 seconds.

