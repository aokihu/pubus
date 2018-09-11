export declare interface ITaskQueue<T> {
  [key:string]: T[];
}

export declare type Interval = number | string;

export declare type TaskItem = {
  ts?:Date; // Timestamp
  tag?:string; // Tag
  cb:Function; // Callback function
}

export declare type ActiveTask = {
  payload: any[];
  tasks: TaskItem[];
  timestamp: number;
}