export declare interface ITaskQueue<T> {
  [key:string]: T[];
}

export declare type Interval = number | string;


export declare interface ActiveQueues {
  [key: string]: ActiveQueue;
}

export declare type ActiveQueue = {
  running: boolean; // Queue is running
  activeTasks: ActiveTask[];
}

export declare type TaskItem = {
  ts?:Date; // Timestamp
  tag?:string; // Tag
  cb:Function; // Callback function
}

export declare type ActiveTask = {
  payload: any[];
  task: TaskItem;
  timestamp: number;
}