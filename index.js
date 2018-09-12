"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pubus {
    /**
     * @constructor
     * @param throttle the time of waitting every task between, the unit is 'ms'
     */
    constructor(throttle = 300) {
        this.holdQueue = {}; // This queue is for registered listener
        this.throttle = throttle;
        this.activeQueues = {};
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
            if (!this.activeQueues[eventName]) {
                this.activeQueues[eventName] = { running: false, activeTasks: [] };
            }
            // Construct active task OBJECTS
            const holdTasks = [...this.holdQueue[eventName]];
            // Check hold tasks is vaild
            if (holdTasks.length === 0) {
                return false;
            }
            else {
                // const activeTask:ActiveTask = {
                //   payload,
                //   task:holdTasks,
                //   timestamp: (new Date).getTime()
                // }
                holdTasks.map(holdTask => {
                    const activeTask = {
                        payload,
                        task: holdTask,
                        timestamp: (new Date).getTime()
                    };
                    this.activeQueues[eventName].activeTasks.push(activeTask);
                });
                // Start run event loop
                this.emitEvent(eventName);
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
        }
        else {
            // Silnce
        }
    }
    /**
     *
     * @param eventName
     */
    emitEvent(eventName) {
        if (!this.activeQueues[eventName].running) {
            this.activeQueues[eventName].running = true;
            this.runloop(this.activeQueues[eventName], this.throttle);
        }
    }
    /**
     *
     * @param activeTasks
     */
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
        // const task:TaskItem = activeTask.tasks.shift() as TaskItem;
        // const cb = task.cb as Function;
        // const payload = activeTask.payload as any[];
        // // cb.apply(this, [...payload]);
        // cb(...payload)
        // if(activeTask.tasks.length > 0) {
        //   setTimeout(this.runloop, delay, activeTask, delay)
        // }
    }
}
exports.default = Pubus;
