#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

typedef struct Task {
    int id;
    char name[50];
    int totalChunks;
    int completedChunks;
    char status[20];
    int forceCrash;
} Task;

Task tasks[100];
int taskCount = 0;

// Modify the addTask function to print necessary task info in a format that can be captured by Node.js
void addTask() {
    Task newTask;
    newTask.id = time(NULL);
    sprintf(newTask.name, "Task %d", taskCount + 1);  // Set dynamic name based on task count
    newTask.totalChunks = rand() % 10 + 3;  // Random chunks between 3 and 12
    newTask.completedChunks = 0;
    strcpy(newTask.status, "pending");
    newTask.forceCrash = rand() % 3;

    tasks[taskCount] = newTask;
    taskCount++;

    // Output task details in JSON format
    printf("{\"id\": %d, \"name\": \"%s\", \"totalChunks\": %d, \"completedChunks\": %d, \"status\": \"%s\", \"forceCrash\": %d}\n",
            newTask.id, newTask.name, newTask.totalChunks, newTask.completedChunks, newTask.status, newTask.forceCrash);
}

void simulateCrash(int taskId) {
    char *crashTypes[] = {"memory", "io", "network"};
    char crashType[20];
    strcpy(crashType, crashTypes[rand() % 3]);

    printf("Crash: %s crash in Task %d\n", crashType, taskId);
}

void processChunks() {
    for (int i = 0; i < taskCount; i++) {
        if (strcmp(tasks[i].status, "completed") == 0 || tasks[i].completedChunks >= tasks[i].totalChunks) {
            strcpy(tasks[i].status, "completed");
        } else if (tasks[i].completedChunks == tasks[i].forceCrash) {
            simulateCrash(tasks[i].id);
            strcpy(tasks[i].status, "recovering");
            tasks[i].forceCrash++;
        } else {
            tasks[i].completedChunks++;
            if (tasks[i].completedChunks >= tasks[i].totalChunks) {
                strcpy(tasks[i].status, "completed");
            } else {
                strcpy(tasks[i].status, "processing");
            }
        }
    }
}

int main() {
    srand(time(NULL));
    // Add a task on program execution
    addTask();
    return 0;
}
