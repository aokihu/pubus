interface ITaskQueue<T> {
  [key:string]: T[];
}

type taskItem = {
  ts?:Date; // Timestamp
  tag?:string; // Tag
  cb:Function; // Callback function
}


export default class Pubus {

  private holdQueue:ITaskQueue<taskItem> = {}; // This queue is for registered listener
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

    const task:taskItem = {cb: cbFunc, tag};
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
        const activeTask = {
          payload,
          tasks:holdTasks,
          timestamp: (new Date).getTime()
        }

        this.activeQueue[eventName].push(activeTask);
        console.log(this.activeQueue)
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
          if(task.tag && task.tag === tag) {
           this.holdQueue[eventName].splice(index,1);
          }
        })
      }
      else {
        delete this.holdQueue[eventName];
      }

      console.log('OFF', this.holdQueue)

    } else {
      // Silnce
    }
  }

}
