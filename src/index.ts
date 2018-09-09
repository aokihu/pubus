interface ITaskQueue<T> {
  [key:string]: T[];
}

type taskItem = {
  ts?:Date; // Timestamp
  tag?:string; // Tag
  cb:Function; // Callback function
}


class Pubus {

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

      this.activeQueue[eventName].push()
    }else {
      // Slince
    }
  }

}
