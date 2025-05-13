import "./style.css";

const recordButton = document.getElementById("startBtn") as HTMLButtonElement;
const stopButton = document.getElementById("stopBtn") as HTMLButtonElement;
const playButton = document.getElementById("playBtn") as HTMLButtonElement;
const clearButton = document.getElementById("clearBtn") as HTMLButtonElement;
const keyboardStackContainer = document.getElementById(
  "keyboard-stack"
) as HTMLDivElement;

const area = document.getElementById("area") as HTMLDivElement;

let startTimeStamp = 0;
let duration = 0;

type Events = keyof HTMLElementEventMap;

type MousedownEvent = {
  type: Exclude<Events, "keydown">;
  altKey: boolean;
  shiftKey: boolean;
  x: number;
  y: number;
  ctrlKey: boolean;
  button: "mouse-right" | "mouse-left";
};

type KeydownEventType = {
  type: Exclude<Events, "mousedown">;
  altKey: boolean;
  shiftKey: boolean;
  key: string;
  ctrlKey: boolean;
};

type Actions = KeydownEventType | MousedownEvent;

const events: Array<Events> = ["keydown", "mousedown", "mousemove"];
const actions: Array<Actions> = [];

const startRecording = () => {
  recordButton.textContent = "Recording...";
  recordButton.disabled = true;
  stopButton.disabled = false;
  startTimeStamp = Date.now();
  area.style.border = "1px solid red";

  recordEvents();
};
const stopRecording = () => {
  recordButton.textContent = "Start";
  recordButton.disabled = false;
  stopButton.disabled = true;
  duration = Math.trunc((Date.now() - startTimeStamp) / 1000);
  area.style = "";
};

const recordEvents = () => {
  events.forEach(eventType => {
    area.addEventListener(eventType, event => {
      if (event.type === "keydown") {
        actions.push({
          type: "keydown",
          altKey: (event as KeyboardEvent).altKey,
          ctrlKey: (event as KeyboardEvent).ctrlKey,
          shiftKey: (event as KeyboardEvent).shiftKey,
          key: (event as KeyboardEvent).key,
        });
      }
      if (event.type === "mousedown") {
        actions.push({
          type: "mousedown",
          altKey: (event as MouseEvent).altKey,
          shiftKey: (event as MouseEvent).shiftKey,
          button:
            (event as MouseEvent).button === 0 ? "mouse-left" : "mouse-right",
          ctrlKey: (event as MouseEvent).ctrlKey,
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        });
      }
    });
  });
};

const playback = () => {
  actions.forEach((action, index) => {
    setTimeout(() => {
      if (action.type === "mousedown") {
        handleMouseAction(action as MousedownEvent);
      }
    }, 400 * index);
  });
};

const renderKeyboardActions = (action: Actions) => {
  console.log(action);
  if ("key" in action) {
    keyboardStackContainer.innerHTML = `<div class="key-card"><code>${
      action.altKey
        ? "alt + "
        : action.ctrlKey && action.key !== "ctrl"
        ? "ctrl + "
        : action.shiftKey
        ? "shift + "
        : ""
    }</code></div>`;
  } else {
    keyboardStackContainer.innerHTML = `<div class="key-card"><code>${
      action.altKey
        ? "alt"
        : action.ctrlKey
        ? "ctrl"
        : action.shiftKey
        ? "shift"
        : ""
    }</code></div>`;
  }
};

const handleMouseAction = (action: MousedownEvent) => {
  const top = area.clientHeight - action.y;
  const right = area.clientWidth - action.x;
  const template = `<div class="mouse-template" style="top:${top}px; right:${right}px">
  ${action.button}
  </div>`;
  if (action.altKey || action.ctrlKey || action.shiftKey) {
    renderKeyboardActions(action);
  }
  area.innerHTML = template;
};

const clearActions = () => {
  actions.length = 0;
  area.innerHTML = "";
};

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", playback);
clearButton.addEventListener("click", clearActions);
