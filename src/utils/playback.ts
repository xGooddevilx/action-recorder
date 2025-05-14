import type { Action } from "../types";
import { handleMouseAction } from "./mouseActionHandler";
import { renderKeyboardActions } from "./renderKeyboardActions";

const keyboardStackContainer = document.getElementById(
  "keyboard-stack"
) as HTMLDivElement;
const modal = document.getElementById("playback-modal") as HTMLButtonElement;

const area = document.getElementById("area") as HTMLDivElement;

type Properties = {
    actions: Array<Action>
}
export const playback = ({actions}:Properties) => {
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
          handleMouseAction(action, area, modal);
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