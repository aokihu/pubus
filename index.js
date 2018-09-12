"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pubus {
    /**
     * @constructor
     * @param throttle the time of waitting every task between, the unit is 'ms'
     */
    constructor(throttle = 300) {
        this.holdQueue = {}; // This queue is for registered listener
        this.activeQueue = []; // This quesu is for working or will work listenter
        this.throttle = throttle;
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
            if (!this.activeQueue[eventName]) {
                this.activeQueue[eventName] = [];
            }
            // Construct active task OBJECTS
            const holdTasks = [...this.holdQueue[eventName]];
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
                console.log('Emit Active Tasks', activeTask.tasks);
                this.activeQueue[eventName].push(activeTask);
                console.log(this.activeQueue);
                // Start run event loop
                this.runloop(this.activeQueue[eventName], this.throttle);
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
     * @param activeTasks
     */
    runloop(activeQueue, delay) {
        const activeTask = activeQueue.shift();
        const tasks = activeTask.tasks;
        const payload = activeTask.payload;
<<<<<<< HEAD
        cb([...payload]);
        if (activeTask.tasks.length > 0) {
            setTimeout(this.runloop, delay, activeTask, delay);
        }
=======
        tasks.map((task, index) => {
            const cb = task.cb;
            setTimeout(() => {
                cb(...payload);
            }, (index * delay));
        });
        console.log('Active Queue Length', activeQueue.length);
        // if(activeQueue.length > 0) {
        //   setTimeout(this.runloop, delay, activeQueue, delay);
        // }
        // const task:TaskItem = activeTask.tasks.shift() as TaskItem;
        // const cb = task.cb as Function;
        // const payload = activeTask.payload as any[];
        // // cb.apply(this, [...payload]);
        // cb(...payload)
        // if(activeTask.tasks.length > 0) {
        //   setTimeout(this.runloop, delay, activeTask, delay)
        // }
>>>>>>> a3a19f155023e19800fa65d8bd2a01fd84150b0c
    }
}
exports.default = Pubus;
