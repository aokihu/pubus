interface ITaskQueue<T> {
  [key:string]: T[];
}

type Interval = number | string;

type TaskItem = {
  ts?:Date; // Timestamp
  tag?:string; // Tag
  cb:Function; // Callback function
}

type ActiveTask = {
  payload: any[];
  tasks: TaskItem[];
  timestamp: number;
}


export default class Pubus {

  private holdQueue:ITaskQueue<TaskItem> = {}; // This queue is for registered listener
  private activeQueue:any = []; // This quesu is for working or will work listenter

  /**
   * @constructor
   */
  constructor() {

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
    console.log('Hold Queue', this.holdQueue)
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
      if(!this.activeQueue[eventName]){
        this.activeQueue[eventName] = [];
      }

      // Construct active task OBJECTS
      const holdTasks = this.holdQueue[eventName];

      // Check hold tasks is vaild
      if(holdTasks.length === 0) {return false;}
      else {

        const activeTask:ActiveTask = {
          payload,
          tasks:holdTasks,
          timestamp: (new Date).getTime()
        }

        // this.activeQueue[eventName].push(activeTask);
        // console.log(this.activeQueue)

        // Start run event loop
        this.runloop(activeTask, 300);

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

      console.log('[Remove Listenter]', this.holdQueue)

    } else {
      // Silnce
    }
  }

  /**
   *
   * @param activeTasks
   */
  private runloop(activeTask: ActiveTask, delay: Interval) {

    const task:TaskItem = activeTask.tasks.shift() as TaskItem;
    const cb = task.cb as Function;
    const payload = activeTask.payload as any[];
    cb(...payload);

    if(activeTask.tasks.length > 0) {setTimeout(this.runloop, delay, activeTask, delay)}
    else {
      // End
      console.log('Runloop End')
    }
  }

}
