"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pubus {
    /**
     * @constructor
     */
    constructor() {
        this.holdQueue = {}; // This queue is for registered listener
        this.activeQueue = []; // This quesu is for working or will work listenter
    }
    /**
     * Register an event listenter
     * @param eventName Event name
     * @param cbFunc callback function
     * @param tag event tag
     */
    addListener(eventName, cbFunc, tag) {
        if (!this.holdQueue[eventName]) {
            this.holdQueue[eventName] = [];
        }
        const task = { cb: cbFunc, tag };
        this.holdQueue[eventName].push(task);
        console.log('Hold Queue', this.holdQueue);
    }
    /**
     * Registe an event listenter
     * @param eventName Event name
     * @param cbFunc Callback function
     * @param tag event tag
     */
    on(eventName, cbFunc, tag) {
        this.addListener(eventName, cbFunc, tag);
    }
    emit(eventName, ...payload) {
        if (this.holdQueue[eventName]) {
            if (!this.activeQueue[eventName]) {
                this.activeQueue[eventName] = [];
            }
            // Construct active task OBJECTS
            const holdTasks = this.holdQueue[eventName];
            // Check hold tasks is vaild
            if (holdTasks.length === 0) {
                return false;
            }
            else {
                const activeTask = {
                    payload,
                    tasks: holdTasks,
                    timestamp: (new Date).getTime()
                };
                // this.activeQueue[eventName].push(activeTask);
                // console.log(this.activeQueue)
                // Start run event loop
                this.runloop(activeTask, 300);
            }
        }
        else {
            // Slince
        }
    }
    /**
     * Remove the listener for the event
     * @param eventName Event name
     * @param tag The tag for special callback function
     */
    off(eventName, tag) {
        if (this.holdQueue[eventName]) {
            if (tag) {
                this.holdQueue[eventName].forEach((task, index) => {
                    if (task.tag && task.tag === tag) {
                        this.holdQueue[eventName].splice(index, 1);
                    }
                });
            }
            else {
                delete this.holdQueue[eventName];
            }
            console.log('[Remove Listenter]', this.holdQueue);
        }
        else {
            // Silnce
        }
    }
    /**
     *
     * @param activeTasks
     */
    runloop(activeTask, delay) {
        const task = activeTask.tasks.shift();
        const cb = task.cb;
        const payload = activeTask.payload;
        cb(...payload);
        if (activeTask.tasks.length > 0) {
            setTimeout(this.runloop, delay, activeTask, delay);
        }
        else {
            // End
            console.log('Runloop End');
        }
    }
}
exports.default = Pubus;