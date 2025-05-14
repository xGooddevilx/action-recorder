import { blockedKeys } from "./blockKeylist";
import "./style.css";
import type { Action, Events } from "./types";
import { handleMouseAction } from "./utils/mouseActionHandler";
import { renderKeyboardActions } from "./utils/renderKeyboardActions";

const recordButton = document.getElementById("startBtn") as HTMLButtonElement;
const stopButton = document.getElementById("stopBtn") as HTMLButtonElement;
const playButton = document.getElementById("playBtn") as HTMLButtonElement;
const clearButton = document.getElementById("clearBtn") as HTMLButtonElement;
const keyboardStackContainer = document.getElementById(
  "keyboard-stack"
) as HTMLDivElement;
const modal = document.getElementById("playback-modal") as HTMLButtonElement;

const area = document.getElementById("area") as HTMLDivElement;

let startTimeStamp = 0;
let isRecording = false;
let isHoldingClick = false


const events = [
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseup",
  "touchstart",
  "touchend",
] as const;

const actions: Array<Action> = [];

const startRecording = () => {
  actions.length = 0;
  startTimeStamp = performance.now();
  isRecording = true;

  recordButton.textContent = "Recording...";
  recordButton.disabled = true;
  stopButton.disabled = false;
  area.style.border = "1px solid red";
};
const stopRecording = () => {
  recordButton.textContent = "Start";
  recordButton.disabled = false;
  stopButton.disabled = true;
  area.style = "";
};

const recordEvents = () => {
  events.forEach(eventType => {
    area.addEventListener(eventType, (event: Events) => {
      if (!isRecording) return;

      const base = {
        time: performance.now() - startTimeStamp,
        type: eventType,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
      };

      const determineKeyname = (key: string | undefined): string | undefined =>
        key === " " ? "space" : key;

      if (event instanceof KeyboardEvent) {
        if (
          blockedKeys.includes(event.key.toLowerCase()) ||
          (event.ctrlKey && ["x", "r"].includes(event.key.toLowerCase()))
        ) {
          event.preventDefault();
        }

        actions.push({
          ...base,
          key: determineKeyname(event.key),
        });
      }
      if (event instanceof MouseEvent) {
        if(event.type === "mousedown"){
          isHoldingClick = true
        }
        if(event.type==='mouseup'){
          isHoldingClick = false;
        }

        actions.push({
          ...base,
          button: event.button === 0 ? "ml" : "mr",
          x: event.clientX,
          y: event.clientY,
          isHoldingClick
        });
      }
      if (typeof TouchEvent !== "undefined" && event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        actions.push({ ...base, x: touch.clientX, y: touch.clientY });
      }
    });
  });
};

recordEvents();

const playback = () => {
  modal.innerHTML = "";
  keyboardStackContainer.innerHTML = "";
  modal.style.display = "block";

  actions.forEach(action => {
    const actionDelay = action.time;
    setTimeout(() => {
      switch (action.type) {
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "touchend":
        case "touchstart":
          handleMouseAction(action,area,modal);
          break;
        case "keydown":
        case "keyup":
          renderKeyboardActions(action);
          break;

        default:
          break;
      }
    }, actionDelay);
  });
};


const clearActions = () => {
  actions.length = 0;
  area.innerHTML = "";
  modal.innerHTML = "";
  modal.style.display = "none";
  keyboardStackContainer.innerHTML = "";
};

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", playback);
clearButton.addEventListener("click", clearActions);

window.addEventListener('beforeunload',(e)=>{
  e.preventDefault()
})
