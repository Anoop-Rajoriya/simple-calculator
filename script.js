// Calculator variables
const calcButtonsFormat = [
  "(",
  ")",
  "%",
  "CE",
  7,
  8,
  9,
  "÷",
  4,
  5,
  6,
  "x",
  1,
  2,
  3,
  "-",
  0,
  ".",
  "=",
  "+",
];
const calcKey = "calc190525";
const calcButtonsContainer = document.querySelector(".calc-buttons");
const calcAns = document.querySelector(".calc-ans");
const calcInput = document.querySelector("input");
const calcInputDeleteButton = document.querySelector(".calc-back");
const calcThemeButton = document.querySelector(".calc-theme-button");
const calcHistoryButton = document.querySelector(".calc-history");
const calcHistoryMenu = document.querySelector(".history-window");
const calcHistoryDeleteButton = document.querySelector(".calc-delete-history");
// Storing calc info
function storeCalcInfo() {
  const { calcHistory: localHistory } = JSON.parse(
    localStorage.getItem(calcKey)
  ) || { calcHistory: null };
  const data = {
    isDark: document.body.classList.contains("theme-dark"),
    calcHistory: localHistory || [],
  };

  const expression = calcInput.value.trim();
  const answer = calcAns.textContent.slice(6);
  const condition =
    expression !== "0" &&
    answer !== "0" &&
    answer !== "NaN" &&
    expression !== answer;
  if (condition) {
    // data.calcHistory = [...localHistory, `${expression} = ${answer}`];
    data.calcHistory.push(`${expression} = ${answer}`);
  }
  // Updating data on browser local storage
  localStorage.setItem(calcKey, JSON.stringify(data));
}
// Main Calculation Function
function evaluateExpression(expression) {
  // Handling empty expression
  if (!expression.length) return;
  // Ensuring x,* for multiplication and /,÷ division are working
  expression = expression.replace(/x|÷/g, (match) =>
    match === "x" ? "*" : "/"
  ); // Replace all occurance of x, ÷ to *, /

  // Evaluating expression safely
  try {
    const ans = new Function(`return (${expression})`)();
    calcAns.textContent = `Ans = ${ans}`;
    storeCalcInfo();
  } catch (error) {
    // Handling invalid answer
    calcAns.textContent = "Ans = invalid";
  }
}
// Theme switcher Function
function switchTheme(isDark) {
  if (isDark) {
    calcThemeButton.innerHTML = "&#9728;";
    document.body.classList.add("theme-dark");
  } else {
    calcThemeButton.innerHTML = "&#9789;";
    document.body.classList.remove("theme-dark");
  }
}

// Calculator event handlers
function calcButtonHandler(clickEvent) {
  // Button Click handler
  const eventButton = clickEvent.currentTarget;
  const buttonText = eventButton.textContent.trim();

  // Handling clear button click
  if (buttonText === "CE") {
    calcAns.textContent = "Ans = 0";
    calcInput.value = "";
    return;
  }
  // Handling equal button click
  if (buttonText === "=") {
    const ans = calcAns.textContent;
    if (ans !== "Ans = invalid" && ans !== "Ans = 0") {
      calcInput.value = ans.replace("Ans = ", "");
    }
    return;
  }
  // Displaying expression
  calcInput.value += buttonText;
  // Evaluating expression
  evaluateExpression(calcInput.value);
}
function calcInputHandler(inputEvent) {
  // Input handler
  let expression = inputEvent.target.value;
  // Validating expression
  if (!/^[0-9.+\-x*/÷%()]+$/.test(expression)) {
    expression = expression.replace(/[^0-9.+\-x*/÷%()]/g, "");
    inputEvent.target.value = expression;
  }
  // Evaluating expression
  evaluateExpression(expression);
}
function calcHistoryHandler(clickEvent) {
  // History button attribute value toggling
  const historyMenuState = JSON.parse(
    clickEvent.currentTarget.getAttribute("calc-history-window")
  );
  calcHistoryButton.setAttribute("calc-history-window", `${!historyMenuState}`);

  // History menu ui toggling
  const newHistoryMenuState = JSON.parse(
    clickEvent.currentTarget.getAttribute("calc-history-window")
  );
  if (newHistoryMenuState) {
    // Listing history
    calcHistoryMenu.textContent = "";
    calcHistoryMenu.classList.remove("empty");
    const { calcHistory } = JSON.parse(localStorage.getItem(calcKey));
    if (!calcHistory.length) calcHistoryMenu.classList.add("empty");
    calcHistory.forEach((historyText) => {
      const li = document.createElement("li");
      li.textContent = historyText;
      calcHistoryMenu.append(li);
    });
    // Displaying history menu
    calcHistoryMenu.classList.remove("hidden");
  } else {
    calcHistoryMenu.classList.add("hidden");
  }
}

// Deleting operands
calcInputDeleteButton.addEventListener("click", (clickEvent) => {
  const expression = calcInput.value;
  if (!expression.length) return;
  calcInput.value = expression.slice(0, expression.length - 1);
  // Evaluating expression
  evaluateExpression(calcInput.value);
});

// Handling direct input
calcInput.addEventListener("input", calcInputHandler);

// Inserting button elements
calcButtonsFormat.forEach((btnText) => {
  const button = document.createElement("button");
  button.textContent = btnText;

  if (btnText === "=") {
    button.className = "calc-equal-button";
  } else if (btnText === "CE") {
    button.className = "calc-clear-button";
  } else if (/^[()+\-\/÷x*%]+$/.test(btnText)) {
    button.className = "calc-operator-button";
  } else {
    button.className = "calc-num-button";
  }

  button.addEventListener("click", calcButtonHandler);
  calcButtonsContainer.append(button);
});

// Handling history view
calcHistoryButton.addEventListener("click", calcHistoryHandler);

// Handling history delete
calcHistoryDeleteButton.addEventListener("click", () => {
  const { isDark, calcHistory } = JSON.parse(localStorage.getItem(calcKey));
  if (calcHistory.length) {
    alert("Calculator history will deleted permanently!");
    localStorage.setItem(calcKey, JSON.stringify({ isDark, calcHistory: [] }));
  }
});

// Theme switch logic
calcThemeButton.addEventListener("click", (clickEvent) => {
  const isDark = document.body.classList.contains("theme-dark");
  if (isDark) {
    switchTheme(false);
  } else {
    switchTheme(true);
  }
  storeCalcInfo();
});

// Update app theme by local Storage
if (localStorage.getItem(calcKey)) {
  const { isDark } = JSON.parse(localStorage.getItem(calcKey));
  switchTheme(isDark);
}
