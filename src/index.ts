import {ITaskQueue, TaskItem, ActiveTask, ActiveQueues, ActiveQueue} from './index.d';

export default class Pubus {
  private throttle: number; // the time of waitting every task between, the unit is 'ms'
  private holdQueue:ITaskQueue<TaskItem> = {}; // This queue is for registered listener
  private activeQueues:ActiveQueues; // This quesu is for working or will work listenter

  /**
   * @constructor
   * @param throttle the time of waitting every task between, the unit is 'ms'
   */
  constructor(throttle = 300) {
    this.throttle = throttle;
    this.activeQueues = {} as ActiveQueues;
  }

  /**
   * Register an event listenter
   * @param eventName Event name
   * @param cbFunc callback function
   * @param tag event tag
   */
  public addListener(eventName: string, cbFunc: Function, tag?: string){
    if(!this.holdQueue[eventName]){
      this.holdQueue[eventName] = [];
    }

    const task:TaskItem = {cb: cbFunc, tag};
    this.holdQueue[eventName].push(task);
  }

  /**
   * Registe an event listenter
   * @param eventName Event name
   * @param cbFunc Callback function
   * @param tag event tag
   */
  public on(eventName: string, cbFunc: Function, tag?: string) {
    this.addListener(eventName, cbFunc, tag);
  }

  public emit(eventName: string, ...payload:any[]){

    if(this.holdQueue[eventName]){
      if(!this.activeQueues[eventName]){
        this.activeQueues[eventName] = {running: false, activeTasks:[]} as ActiveQueue;
      }

      // Construct active task OBJECTS
      const holdTasks = [...this.holdQueue[eventName]];

      // Check hold tasks is vaild
      if(holdTasks.length === 0) {return false;}
      else {

        // const activeTask:ActiveTask = {
        //   payload,
        //   task:holdTasks,
        //   timestamp: (new Date).getTime()
        // }

        holdTasks.map(holdTask => {
          const activeTask:ActiveTask = {
            payload,
            task: holdTask,
            timestamp: (new Date).getTime()
          }

          this.activeQueues[eventName].activeTasks.push(activeTask);
        });


        // Start run event loop
        this.emitEvent(eventName);
      }

    }else {
      // Slince
    }
  }

  /**
   * Remove the listener for the event
   * @param eventName Event name
   * @param tag The tag for special callback function
   */
  public off(eventName: string, tag?:string) {
    if(this.holdQueue[eventName]) {

      if(tag){
        this.holdQueue[eventName].forEach((task, index) => {
          if(task.tag && task.tag === tag) {this.holdQueue[eventName].splice(index,1);}
        })
      }
      else {
        delete this.holdQueue[eventName];
      }

    } else {
      // Silnce
    }
  }

  /**
   * 
   * @param eventName 
   */
  private emitEvent(eventName:string) {
    if(!this.activeQueues[eventName].running) {
      this.activeQueues[eventName].running = true;
      this.runloop(this.activeQueues[eventName], this.throttle);
    }
  }

  /**
   *
   * @param activeTasks
   */
  private runloop(activeQueue: ActiveQueue, delay: number) {

    if(activeQueue.activeTasks.length > 0) {

        const at:ActiveTask = activeQueue.activeTasks.shift() as ActiveTask;
        const cb = at.task.cb;
        const payload = at.payload;
        cb(...payload);

      
        setTimeout(() => {this.runloop(activeQueue, delay)}, delay);
    }else {
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
