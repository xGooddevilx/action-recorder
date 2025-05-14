import type { Action } from "../types";

const keyboardStackContainer = document.getElementById(
  "keyboard-stack"
) as HTMLDivElement;
export const enteredKeys = new Set<string>();

export const renderKeyboardActions = (action: Action) => {
  const keyCard = document.createElement("div");
  keyCard.className = "key-card";

  const keys: string[] = [];

  if (action.altKey) keys.push("Alt");
  if (action.ctrlKey || action.key === "control") keys.push("Ctrl");
  if (action.shiftKey) keys.push("Shift");
  if (action.key && !["Shift", "Ctrl", "Alt"].includes(action.key)) {
    keys.push(action.key.charAt(0).toUpperCase() + action.key.slice(1));
  }

  const keyCombination = keys.join("+ ");
  if (enteredKeys.has(keyCombination)) return;

  enteredKeys.add(keyCombination);
  keyCard.innerText = keyCombination;

  keyboardStackContainer.appendChild(keyCard);

  setTimeout(() => {
    keyCard.remove();
    enteredKeys.delete(keyCombination);
  }, action.time);
};
