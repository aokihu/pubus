"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pubus {
    constructor(throttle = Pubus.throttle) {
        this.holdQueue = {};
        this.throttle = throttle;
        this.activeQueues = {};
    }
    addListener(eventName, cbFunc, tag) {
        if (!this.holdQueue[eventName]) {
            this.holdQueue[eventName] = [];
        }
        const task = { cb: cbFunc, tag };
        this.holdQueue[eventName].push(task);
    }
    on(eventName, cbFunc, tag) {
        this.addListener(eventName, cbFunc, tag);
    }
    emit(eventName, ...payload) {
        if (this.holdQueue[eventName]) {
            if (!this.activeQueues[eventName]) {
                this.activeQueues[eventName] = { running: false, activeTasks: [] };
            }
            const holdTasks = [...this.holdQueue[eventName]];
            if (holdTasks.length === 0) {
                return false;
            }
            else {
                holdTasks.map(holdTask => {
                    const activeTask = {
                        payload,
                        task: holdTask,
                        timestamp: (new Date).getTime()
                    };
                    this.activeQueues[eventName].activeTasks.push(activeTask);
                });
                this.emitEvent(eventName);
            }
        }
        else {
        }
    }
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
        }
        else {
        }
    }
    emitEvent(eventName) {
        if (!this.activeQueues[eventName].running) {
            this.activeQueues[eventName].running = true;
            this.runloop(this.activeQueues[eventName], this.throttle);
        }
    }
    runloop(activeQueue, delay) {
        if (activeQueue.activeTasks.length > 0) {
            const at = activeQueue.activeTasks.shift();
            const cb = at.task.cb;
            const payload = at.payload;
            cb(...payload);
            setTimeout(() => { this.runloop(activeQueue, delay); }, delay);
        }
        else {
            activeQueue.running = false;
        }
    }
}
Pubus.throttle = 30;
exports.default = Pubus;
