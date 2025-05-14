import type { Action } from "../types";
import { renderKeyboardActions } from "./renderKeyboardActions";

export const handleMouseAction = (action: Action, area: HTMLDivElement, modal: HTMLButtonElement) => {
  const areaRect = area.getBoundingClientRect();
  const modalRect = modal.getBoundingClientRect();

  const top = action.y! - areaRect.top;
  const left = action.x! - areaRect.left;

  const scaledTop = Math.trunc((top / areaRect.height) * modalRect.height);
  const scaledLeft = Math.trunc((left / areaRect.width) * modalRect.width);

  let indicator = document.querySelector(".mouse-template") as HTMLElement | null;
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "mouse-template";
    modal.appendChild(indicator);
  }
  indicator.classList.remove("click-left", "click-right");
  if (action.type === "mousedown" || action.type === "mouseup") {
    indicator.classList.add(
      action.button === "ml" ? "click-right" : "click-left"
    );
  }

  indicator.style.left = `${scaledLeft}px`;
  indicator.style.top = `${scaledTop}px`;

  if (action.altKey || action.ctrlKey || action.shiftKey) {
    renderKeyboardActions(action);
  }
  modal.appendChild(indicator);
};