export type EventActionTypes = Extract<
  keyof HTMLElementEventMap,
  | "mousedown"
  | "mouseup"
  | "mousemove"
  | "keydown"
  | "keyup"
  | "touchstart"
  | "touchend"
>;
export type Action = {
  time: number;
  type: EventActionTypes;
  button?: "ml" | "mr";
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  x?:number,
  y?:number,
  isHoldingClick?:boolean
};

export type Events = MouseEvent | TouchEvent | KeyboardEvent;

