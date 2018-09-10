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
                this.activeQueue[eventName].push(activeTask);
                console.log(this.activeQueue);
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
            console.log('OFF', this.holdQueue);
        }
        else {
            // Silnce
        }
    }
}
exports.default = Pubus;
