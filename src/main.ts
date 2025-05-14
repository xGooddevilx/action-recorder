import { blockedKeys } from "./blockKeylist";
import "./style.css";
import type { Action, Events } from "./types";
import { playback } from "./utils/playback";
import { enteredKeys } from "./utils/renderKeyboardActions";
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
let isHoldingClick = false;

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

const handlingStates = () => {
  playButton.disabled = isRecording || actions.length === 0;

  recordButton.textContent = isRecording ? "Recording..." : "Start";
  recordButton.disabled = isRecording;

  stopButton.disabled = !isRecording;

  clearButton.disabled = isRecording || actions.length === 0;

  area.style.border = isRecording ? "2px solid red" : "";
};

const startRecording = () => {
  actions.length = 0;
  startTimeStamp = performance.now();
  isRecording = true;
  handlingStates();
};
const stopRecording = () => {
  isRecording = false;
  handlingStates();
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
        if (event.type === "mousedown") {
          isHoldingClick = true;
        }
        if (event.type === "mouseup") {
          isHoldingClick = false;
        }

        actions.push({
          ...base,
          button: event.button === 0 ? "ml" : "mr",
          x: event.clientX,
          y: event.clientY,
          isHoldingClick,
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

const clearActions = () => {
  actions.length = 0;
  isRecording = false;
  area.innerHTML = "";
  modal.innerHTML = "";
  modal.style.display = "none";
  keyboardStackContainer.innerHTML = "";
  enteredKeys.clear();

  handlingStates()
};

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", () => playback({ actions }));
clearButton.addEventListener("click", clearActions);

// For security reasons, nowadays we can't completely override the browser short key apis,
//  (link:https://stackoverflow.com/questions/21695682/is-it-possible-to-catch-ctrlw-shortcut-and-prevent-tab-closing)
// window.addEventListener("beforeunload", e => {
//   e.preventDefault();
// });
