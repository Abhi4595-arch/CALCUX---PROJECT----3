const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageButtons = document.querySelectorAll("[data-page-target]");

const API_BASE_URL = "http://localhost:8080";


function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageName);

    if (targetPage) {
        targetPage.classList.add("active");
    }


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    const names = {
        dashboard: "Dashboard",
        calculator: "Calculator",
        advanced: "Advanced",
        expression: "Expression",
        history: "History",
        statistics: "Statistics"
    };


    const title = document.querySelector(".topbar h1");
    const breadcrumb = document.querySelector(".breadcrumb");


    if (title) {
        title.textContent = names[pageName] || "CALCUX";
    }


    if (breadcrumb) {
        breadcrumb.textContent =
            `WORKSPACE / ${pageName.toUpperCase()}`;
    }


    window.scrollTo(0, 0);
}


/* =====================================================
   PAGE NAVIGATION
   ===================================================== */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        showPage(item.dataset.page);

    });

});


pageButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.pageTarget);

    });

});


/* =====================================================
   BASIC CALCULATOR
   ===================================================== */

const basicOperationButtons =
    document.querySelectorAll(".basic-operation");

let selectedBasicOperation = "add";


function updateBasicOperation(button) {

    basicOperationButtons.forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");


    selectedBasicOperation =
        button.dataset.operation;


    const symbol =
        button.dataset.symbol;

    const name =
        button.dataset.name;

    const help =
        button.dataset.help;


    const selectedSymbol =
        document.getElementById("selected-symbol");

    const selectedName =
        document.getElementById("selected-operation-name");

    const selectedHelp =
        document.getElementById("selected-operation-help");


    const backendSymbol =
        document.getElementById("advanced-backend-symbol");

    const backendName =
        document.getElementById("advanced-backend-name");


    if (selectedSymbol) {
        selectedSymbol.textContent = symbol;
    }

    if (selectedName) {
        selectedName.textContent = name;
    }

    if (selectedHelp) {
        selectedHelp.textContent = help;
    }


    /*
       Backend operation display
       Uses the actual C++ API operation name.
    */

    const backendOperationSymbol =
        document.getElementById("backend-operation-symbol");

    const backendOperationName =
        document.getElementById("backend-operation-name");


    if (backendOperationSymbol) {
        backendOperationSymbol.textContent = symbol;
    }

    if (backendOperationName) {
        backendOperationName.textContent =
            selectedBasicOperation;
    }


    /*
       Clear previous result when operation changes.
    */

    const result =
        document.getElementById(
            "basic-calculator-result"
        );

    const message =
        document.getElementById(
            "basic-calculator-expression"
        );


    if (result) {
        result.textContent = "—";
    }

    if (message) {
        message.textContent =
            "Enter two numbers and calculate.";
    }
}


basicOperationButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => updateBasicOperation(button)
    );

});


/* =====================================================
   BASIC CALCULATION REQUEST
   ===================================================== */

const calculateBasicButton =
    document.getElementById(
        "calculate-basic-btn"
    );


if (calculateBasicButton) {

    calculateBasicButton.addEventListener(
        "click",
        calculateBasicOperation
    );

}


async function calculateBasicOperation() {

    const firstInput =
        document.getElementById(
            "first-number"
        );

    const secondInput =
        document.getElementById(
            "second-number"
        );


    const resultElement =
        document.getElementById(
            "basic-calculator-result"
        );

    const messageElement =
        document.getElementById(
            "basic-calculator-expression"
        );


    if (!firstInput || !secondInput) {
        return;
    }


    const firstNumber =
        Number(firstInput.value);

    const secondNumber =
        Number(secondInput.value);


    /* Empty input check */

    if (
        firstInput.value.trim() === "" ||
        secondInput.value.trim() === ""
    ) {

        resultElement.textContent = "—";

        messageElement.textContent =
            "Please enter both numbers.";

        return;
    }


    /* Number validation */

    if (
        !Number.isFinite(firstNumber) ||
        !Number.isFinite(secondNumber)
    ) {

        resultElement.textContent = "—";

        messageElement.textContent =
            "Please enter valid numbers.";

        return;
    }


    /* Loading state */

    calculateBasicButton.disabled = true;

    calculateBasicButton.innerHTML =
        "Calculating...";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/calculate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        operation:
                            selectedBasicOperation,

                        a:
                            firstNumber,

                        b:
                            secondNumber
                    })
                }
            );


        const data =
            await response.json();


        /*
           Backend can return calculation errors
           with success:false.
        */

        if (!data.success) {

            resultElement.textContent = "—";

            messageElement.textContent =
                data.message ||
                "Calculation failed.";

            return;
        }


        /*
           Actual calculated value comes from C++.
        */

        resultElement.textContent =
            formatResult(data.value);


        messageElement.textContent =
            createBasicExpression(
                firstNumber,
                secondNumber,
                selectedBasicOperation,
                data.value
            );


    } catch (error) {

        resultElement.textContent = "—";

        messageElement.textContent =
            "Unable to connect to the C++ backend.";

        console.error(
            "CALCUX API error:",
            error
        );

    } finally {

        calculateBasicButton.disabled = false;

        calculateBasicButton.innerHTML =
            'Calculate <span>→</span>';

    }

}


/* =====================================================
   RESULT FORMATTING
   ===================================================== */

function formatResult(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "—";
    }


    if (Number.isInteger(value)) {
        return value.toString();
    }


    return Number(
        value.toFixed(10)
    ).toString();

}


/* =====================================================
   BASIC EXPRESSION DISPLAY
   ===================================================== */

function createBasicExpression(
    a,
    b,
    operation,
    result
) {

    const symbols = {

        add: "+",

        subtract: "−",

        multiply: "×",

        divide: "÷",

        modulus: "%"

    };


    const symbol =
        symbols[operation] || operation;


    return `${formatResult(a)} ${symbol} ${formatResult(b)} = ${formatResult(result)}`;

}


/* =====================================================
   DEFAULT OPERATION
   ===================================================== */

const defaultBasicOperation =
    document.querySelector(
        '.basic-operation[data-operation="add"]'
    );


if (defaultBasicOperation) {
    updateBasicOperation(
        defaultBasicOperation
    );
}
/* =====================================================
   ADVANCED OPERATIONS INTEGRATION
   ===================================================== */

const advancedButtons =
    document.querySelectorAll(".advanced-option");

const advancedFields =
    document.getElementById("advanced-fields");

const advancedTitle =
    document.getElementById("advanced-title");

const advancedSymbol =
    document.getElementById("advanced-symbol");

const advancedHelp =
    document.getElementById("advanced-help");

const advancedResult =
    document.getElementById("advanced-result");

const advancedMessage =
    document.getElementById("advanced-message");

const advancedCalculateButton =
    document.getElementById("advanced-calculate-btn");

const advancedBackendSymbol =
    document.getElementById("advanced-backend-symbol");

const advancedBackendName =
    document.getElementById("advanced-backend-name");


let selectedAdvancedOperation = "power";


const advancedOperationConfig = {

    power: {
        title: "Power",
        symbol: "^",
        help: "Raise a base to an exponent.",
        inputs: [
            {
                label: "Base",
                placeholder: "Enter base",
                step: "any"
            },
            {
                label: "Exponent",
                placeholder: "Enter exponent",
                step: "any"
            }
        ]
    },

    squareRoot: {
        title: "Square Root",
        symbol: "√",
        help: "Find the square root of a number.",
        inputs: [
            {
                label: "Number",
                placeholder: "Enter number",
                step: "any"
            }
        ]
    },

    percentage: {
        title: "Percentage",
        symbol: "%",
        help: "Calculate a percentage of a value.",
        inputs: [
            {
                label: "Value",
                placeholder: "Enter value",
                step: "any"
            },
            {
                label: "Percentage",
                placeholder: "Enter percentage",
                step: "any"
            }
        ]
    },

    factorial: {
        title: "Factorial",
        symbol: "!",
        help: "Calculate the factorial of an integer.",
        inputs: [
            {
                label: "Integer",
                placeholder: "Enter integer",
                step: "1"
            }
        ]
    },

    primeCheck: {
        title: "Prime Check",
        symbol: "P",
        help: "Check whether an integer is prime.",
        inputs: [
            {
                label: "Integer",
                placeholder: "Enter integer",
                step: "1"
            }
        ]
    },

    evenOddCheck: {
        title: "Even / Odd",
        symbol: "E/O",
        help: "Check whether an integer is even or odd.",
        inputs: [
            {
                label: "Integer",
                placeholder: "Enter integer",
                step: "1"
            }
        ]
    },

    gcd: {
        title: "GCD",
        symbol: "GCD",
        help: "Find the greatest common divisor of two integers.",
        inputs: [
            {
                label: "First Integer",
                placeholder: "Enter first integer",
                step: "1"
            },
            {
                label: "Second Integer",
                placeholder: "Enter second integer",
                step: "1"
            }
        ]
    },

    lcm: {
        title: "LCM",
        symbol: "LCM",
        help: "Find the least common multiple of two integers.",
        inputs: [
            {
                label: "First Integer",
                placeholder: "Enter first integer",
                step: "1"
            },
            {
                label: "Second Integer",
                placeholder: "Enter second integer",
                step: "1"
            }
        ]
    }

};


/* -----------------------------------------------------
   CREATE INPUT FIELDS
   ----------------------------------------------------- */

function renderAdvancedFields(operation) {

    const config =
        advancedOperationConfig[operation];

    if (!config || !advancedFields) {
        return;
    }


    advancedFields.innerHTML = "";


    config.inputs.forEach((input, index) => {

        const field =
            document.createElement("div");

        field.className =
            "advanced-field";


        field.innerHTML = `
            <label for="advanced-input-${index + 1}">
                ${input.label}
            </label>

            <input
                class="input-field"
                id="advanced-input-${index + 1}"
                type="number"
                step="${input.step}"
                placeholder="${input.placeholder}"
                autocomplete="off"
            >
        `;


        advancedFields.appendChild(field);

    });

}


/* -----------------------------------------------------
   SELECT ADVANCED OPERATION
   ----------------------------------------------------- */

function selectAdvancedOperation(button) {

    advancedButtons.forEach(item => {
        item.classList.remove("active");
    });


    button.classList.add("active");


    selectedAdvancedOperation =
        button.dataset.operation;


    const config =
        advancedOperationConfig[
            selectedAdvancedOperation
        ];


    if (!config) {
        return;
    }


    advancedTitle.textContent =
        config.title;

    advancedSymbol.textContent =
        config.symbol;

    advancedHelp.textContent =
        config.help;


    if (advancedBackendSymbol) {
        advancedBackendSymbol.textContent =
            config.symbol;
    }

    if (advancedBackendName) {
        advancedBackendName.textContent =
            selectedAdvancedOperation;
    }


    advancedResult.textContent =
        "—";

    advancedMessage.textContent =
        "Enter the required value(s) and calculate.";


    renderAdvancedFields(
        selectedAdvancedOperation
    );

}


/* -----------------------------------------------------
   OPERATION BUTTON EVENTS
   ----------------------------------------------------- */

advancedButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => selectAdvancedOperation(button)
    );

});


/* -----------------------------------------------------
   SEND ADVANCED REQUEST TO C++ API
   ----------------------------------------------------- */

if (advancedCalculateButton) {

    advancedCalculateButton.addEventListener(
        "click",
        calculateAdvancedOperation
    );

}


async function calculateAdvancedOperation() {

    const config =
        advancedOperationConfig[
            selectedAdvancedOperation
        ];


    if (!config) {
        return;
    }


    const input1 =
        document.getElementById(
            "advanced-input-1"
        );

    const input2 =
        document.getElementById(
            "advanced-input-2"
        );


    if (!input1) {
        return;
    }


    /* Empty input check */

    if (input1.value.trim() === "") {

        advancedResult.textContent =
            "—";

        advancedMessage.textContent =
            "Please enter the required value.";

        return;
    }


    if (
        config.inputs.length === 2 &&
        (!input2 || input2.value.trim() === "")
    ) {

        advancedResult.textContent =
            "—";

        advancedMessage.textContent =
            "Please enter both values.";

        return;
    }


    const value1 =
        Number(input1.value);

    const value2 =
        input2
            ? Number(input2.value)
            : null;


    /* Number validation */

    if (!Number.isFinite(value1)) {

        advancedResult.textContent =
            "—";

        advancedMessage.textContent =
            "Please enter a valid number.";

        return;
    }


    if (
        config.inputs.length === 2 &&
        !Number.isFinite(value2)
    ) {

        advancedResult.textContent =
            "—";

        advancedMessage.textContent =
            "Please enter valid numbers.";

        return;
    }


    /* Integer operations */

    const integerOperations = [
        "factorial",
        "primeCheck",
        "evenOddCheck",
        "gcd",
        "lcm"
    ];


    if (
        integerOperations.includes(
            selectedAdvancedOperation
        )
    ) {

        if (!Number.isInteger(value1)) {

            advancedResult.textContent =
                "—";

            advancedMessage.textContent =
                "Please enter an integer.";

            return;
        }


        if (
            config.inputs.length === 2 &&
            !Number.isInteger(value2)
        ) {

            advancedResult.textContent =
                "—";

            advancedMessage.textContent =
                "Please enter integers.";

            return;
        }

    }


    /* Loading */

    advancedCalculateButton.disabled =
        true;

    advancedCalculateButton.innerHTML =
        "Calculating...";


    try {

        let requestBody;


        /* Binary operations */

        if (
            selectedAdvancedOperation === "power" ||
            selectedAdvancedOperation === "percentage" ||
            selectedAdvancedOperation === "gcd" ||
            selectedAdvancedOperation === "lcm"
        ) {

            requestBody = {

                operation:
                    selectedAdvancedOperation,

                a: value1,

                b: value2

            };

        }


        /* Unary operations */

        else {

            requestBody = {

                operation:
                    selectedAdvancedOperation,

                value: value1

            };

        }


        const response =
            await fetch(
                `${API_BASE_URL}/calculate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );


        const data =
            await response.json();


        /* Backend error */

        if (!data.success) {

            advancedResult.textContent =
                "—";

            advancedMessage.textContent =
                data.message ||
                "Calculation failed.";

            return;
        }


        /*
           Prime / Even-Odd return
           semantic text in message.
        */

        if (
            selectedAdvancedOperation ===
            "primeCheck" ||
            selectedAdvancedOperation ===
            "evenOddCheck"
        ) {

            advancedResult.textContent =
                data.message || "—";


            advancedMessage.textContent =
                `Input: ${formatResult(value1)}`;

        }

        else {

            advancedResult.textContent =
                formatResult(data.value);


            advancedMessage.textContent =
                buildAdvancedExpression(
                    selectedAdvancedOperation,
                    value1,
                    value2,
                    data.value
                );

        }


    } catch (error) {

        advancedResult.textContent =
            "—";

        advancedMessage.textContent =
            "Unable to connect to the C++ backend.";

        console.error(
            "CALCUX Advanced API error:",
            error
        );

    } finally {

        advancedCalculateButton.disabled =
            false;

        advancedCalculateButton.innerHTML =
            'Calculate <span>→</span>';

    }

}


/* -----------------------------------------------------
   ADVANCED RESULT DESCRIPTION
   ----------------------------------------------------- */

function buildAdvancedExpression(
    operation,
    value1,
    value2,
    result
) {

    switch (operation) {

        case "power":
            return `${formatResult(value1)} ^ ${formatResult(value2)} = ${formatResult(result)}`;


        case "squareRoot":
            return `√${formatResult(value1)} = ${formatResult(result)}`;


        case "percentage":
            return `${formatResult(value2)}% of ${formatResult(value1)} = ${formatResult(result)}`;


        case "factorial":
            return `${formatResult(value1)}! = ${formatResult(result)}`;


        case "gcd":
            return `GCD(${formatResult(value1)}, ${formatResult(value2)}) = ${formatResult(result)}`;


        case "lcm":
            return `LCM(${formatResult(value1)}, ${formatResult(value2)}) = ${formatResult(result)}`;


        default:
            return `Result: ${formatResult(result)}`;
    }

}


/* -----------------------------------------------------
   INITIAL ADVANCED OPERATION
   ----------------------------------------------------- */

const defaultAdvancedOperation =
    document.querySelector(
        '.advanced-option[data-operation="power"]'
    );


if (defaultAdvancedOperation) {

    selectAdvancedOperation(
        defaultAdvancedOperation
    );

}
/* =====================================================
   EXPRESSION CALCULATOR INTEGRATION
   ===================================================== */

const expressionInput =
    document.getElementById("expression-input");

const expressionResult =
    document.getElementById("expression-result");

const expressionCharCount =
    document.getElementById("expression-char-count");

const expressionClear =
    document.getElementById("expression-clear");

const expressionEvaluate =
    document.getElementById("expression-evaluate");

const expressionKeypad =
    document.querySelector(".expression-keypad");


/* -----------------------------------------------------
   CHARACTER COUNT
   ----------------------------------------------------- */

function updateExpressionCount() {

    if (!expressionInput || !expressionCharCount) {
        return;
    }

    const count =
        expressionInput.value.length;

    expressionCharCount.textContent =
        `${count} character${count === 1 ? "" : "s"}`;
}


if (expressionInput) {

    expressionInput.addEventListener(
        "input",
        updateExpressionCount
    );

}


/* -----------------------------------------------------
   KEYPAD
   ----------------------------------------------------- */

if (expressionKeypad) {

    const keypadKeys =
        expressionKeypad.querySelectorAll(
            ".keypad-key"
        );


    keypadKeys.forEach(button => {

        button.addEventListener(
            "click",
            () => handleExpressionKey(button)
        );

    });

}


function handleExpressionKey(button) {

    if (!expressionInput) {
        return;
    }


    const key =
        button.textContent.trim();


    /* Clear */

    if (key === "C") {

        expressionInput.value = "";

        updateExpressionCount();

        expressionInput.focus();

        return;
    }


    /* Backspace */

    if (key === "⌫") {

        const start =
            expressionInput.selectionStart;

        const end =
            expressionInput.selectionEnd;


        if (start !== null && end !== null) {

            if (start !== end) {

                expressionInput.setRangeText(
                    "",
                    start,
                    end,
                    "start"
                );

            }
            else if (start > 0) {

                expressionInput.setRangeText(
                    "",
                    start - 1,
                    end,
                    "start"
                );

            }

        }


        updateExpressionCount();

        expressionInput.focus();

        return;
    }


    /*
       Convert visual keypad symbols
       to the exact characters expected
       by the C++ expression parser.
    */

    const keyMap = {

        "×": "*",

        "÷": "/",

        "−": "-",

        "–": "-"

    };


    const value =
        keyMap[key] || key;


    const start =
        expressionInput.selectionStart ??
        expressionInput.value.length;

    const end =
        expressionInput.selectionEnd ??
        expressionInput.value.length;


    expressionInput.setRangeText(
        value,
        start,
        end,
        "end"
    );


    updateExpressionCount();

    expressionInput.focus();

}


/* -----------------------------------------------------
   CLEAR BUTTON
   ----------------------------------------------------- */

if (expressionClear) {

    expressionClear.addEventListener(
        "click",
        () => {

            if (!expressionInput) {
                return;
            }

            expressionInput.value = "";

            if (expressionResult) {
                expressionResult.textContent = "—";
            }

            updateExpressionCount();

            expressionInput.focus();

        }
    );

}


/* -----------------------------------------------------
   EVALUATE BUTTON
   ----------------------------------------------------- */

if (expressionEvaluate) {

    expressionEvaluate.addEventListener(
        "click",
        evaluateExpressionWithCpp
    );

}


async function evaluateExpressionWithCpp() {

    if (!expressionInput || !expressionResult) {
        return;
    }


    const expression =
        expressionInput.value.trim();


    /* Empty expression */

    if (expression === "") {

        expressionResult.textContent =
            "—";

        if (expressionCharCount) {
            expressionCharCount.textContent =
                "Please enter an expression.";
        }

        return;
    }


    /* Loading */

    expressionEvaluate.disabled = true;

    expressionEvaluate.innerHTML =
        "Evaluating...";


    try {

        /*
           Exact backend request:
           POST /expression

           {
               "expression": "2 + 3 * 4"
           }
        */

        const response =
            await fetch(
                `${API_BASE_URL}/expression`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        expression: expression
                    })
                }
            );


        const data =
            await response.json();


        /* Backend error */

        if (!data.success) {

            expressionResult.textContent =
                "—";

            if (expressionCharCount) {
                expressionCharCount.textContent =
                    data.message ||
                    "Invalid expression.";
            }

            return;
        }


        /*
           Result is calculated by C++.
        */

        expressionResult.textContent =
            formatResult(data.value);


        if (expressionCharCount) {

            expressionCharCount.textContent =
                `${expression.length} character${expression.length === 1 ? "" : "s"}`;

        }


    } catch (error) {

        expressionResult.textContent =
            "—";

        if (expressionCharCount) {
            expressionCharCount.textContent =
                "Unable to connect to the C++ backend.";
        }

        console.error(
            "CALCUX Expression API error:",
            error
        );

    } finally {

        expressionEvaluate.disabled =
            false;

        expressionEvaluate.innerHTML =
            'Evaluate <span>→</span>';

    }

}


/* -----------------------------------------------------
   ENTER KEY
   ----------------------------------------------------- */

if (expressionInput) {

    expressionInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                evaluateExpressionWithCpp();

            }

        }
    );

}


/* -----------------------------------------------------
   INITIAL COUNT
   ----------------------------------------------------- */

updateExpressionCount();

/* =====================================================
   HISTORY INTEGRATION
   ===================================================== */

const historyList =
    document.getElementById("history-list");

const historyCount =
    document.getElementById("history-count");

const historySearchInput =
    document.getElementById("history-search");

const historySearchButton =
    document.getElementById("history-search-button");

const historyRefreshButton =
    document.getElementById("history-refresh");

const clearHistoryButton =
    document.getElementById("clear-history");


/* -----------------------------------------------------
   DISPLAY HISTORY
   ----------------------------------------------------- */

function renderHistory(entries) {

    if (!historyList) {
        return;
    }

    historyList.innerHTML = "";


    if (!Array.isArray(entries) || entries.length === 0) {

        const empty = document.createElement("div");

        empty.className = "history-empty";

        empty.innerHTML = `
            <div class="history-empty-icon">◷</div>

            <h4>No calculations found</h4>

            <p>
                No matching calculations are available
                in the C++ history.
            </p>
        `;

        historyList.appendChild(empty);

        if (historyCount) {
            historyCount.textContent = "0 calculations";
        }

        return;
    }


    if (historyCount) {

        historyCount.textContent =
            `${entries.length} calculation${entries.length === 1 ? "" : "s"}`;

    }


    entries.forEach(entry => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";


        const left =
            document.createElement("div");

        left.className =
            "history-item-left";


        const icon =
            document.createElement("div");

        icon.className =
            "history-item-icon";

        icon.textContent =
            "ƒx";


        const text =
            document.createElement("div");

        text.className =
            "history-item-text";


        const calculation =
            document.createElement("strong");

        calculation.textContent =
            entry;


        const source =
            document.createElement("small");

        source.textContent =
            "C++ HISTORY ENGINE";


        text.appendChild(calculation);
        text.appendChild(source);

        left.appendChild(icon);
        left.appendChild(text);

        item.appendChild(left);

        historyList.appendChild(item);

    });

}


/* -----------------------------------------------------
   LOAD COMPLETE HISTORY
   GET /history
   ----------------------------------------------------- */

async function loadHistory() {

    if (!historyList) {
        return;
    }


    historyList.innerHTML = `
        <div class="history-empty">
            <div class="history-empty-icon">◷</div>
            <h4>Loading history...</h4>
            <p>Reading calculations from the C++ engine.</p>
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/history`
            );


        const data =
            await response.json();


        if (!data.success) {

            historyList.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon">!</div>
                    <h4>Unable to load history</h4>
                    <p>${data.message || "History request failed."}</p>
                </div>
            `;

            return;
        }


        renderHistory(
            data.history || []
        );


    } catch (error) {

        historyList.innerHTML = `
            <div class="history-empty">
                <div class="history-empty-icon">!</div>
                <h4>C++ backend unavailable</h4>
                <p>
                    Unable to connect to the history service.
                </p>
            </div>
        `;

        console.error(
            "CALCUX History API error:",
            error
        );

    }

}


/* -----------------------------------------------------
   SEARCH HISTORY
   GET /history/search?query=...
   ----------------------------------------------------- */

async function searchHistory() {

    if (!historySearchInput) {
        return;
    }


    const query =
        historySearchInput.value.trim();


    if (query === "") {

        await loadHistory();

        return;
    }


    if (historyList) {

        historyList.innerHTML = `
            <div class="history-empty">
                <div class="history-empty-icon">⌕</div>
                <h4>Searching...</h4>
                <p>Searching the C++ history.</p>
            </div>
        `;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/history/search?query=${encodeURIComponent(query)}`
            );


        const data =
            await response.json();


        if (!data.success) {

            if (historyList) {

                historyList.innerHTML = `
                    <div class="history-empty">
                        <div class="history-empty-icon">!</div>
                        <h4>Search failed</h4>
                        <p>${data.message || "Unable to search history."}</p>
                    </div>
                `;

            }

            return;
        }


        renderHistory(
            data.history || []
        );


    } catch (error) {

        if (historyList) {

            historyList.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon">!</div>
                    <h4>Search unavailable</h4>
                    <p>
                        Unable to connect to the C++ backend.
                    </p>
                </div>
            `;

        }

        console.error(
            "CALCUX History Search API error:",
            error
        );

    }

}


/* -----------------------------------------------------
   SEARCH BUTTON
   ----------------------------------------------------- */

if (historySearchButton) {

    historySearchButton.addEventListener(
        "click",
        searchHistory
    );

}


/* -----------------------------------------------------
   ENTER KEY FOR SEARCH
   ----------------------------------------------------- */

if (historySearchInput) {

    historySearchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchHistory();

            }

        }
    );

}


/* -----------------------------------------------------
   REFRESH
   ----------------------------------------------------- */

if (historyRefreshButton) {

    historyRefreshButton.addEventListener(
        "click",
        loadHistory
    );

}


/* -----------------------------------------------------
   CLEAR ALL HISTORY
   DELETE /history
   ----------------------------------------------------- */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        clearHistory
    );

}


async function clearHistory() {

    const confirmed =
        window.confirm(
            "Are you sure you want to clear all calculation history?"
        );


    if (!confirmed) {
        return;
    }


    clearHistoryButton.disabled = true;

    clearHistoryButton.textContent =
        "Clearing...";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/history`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Unable to clear history."
            );

            return;
        }


        if (historySearchInput) {
            historySearchInput.value = "";
        }


        await loadHistory();


    } catch (error) {

        alert(
            "Unable to connect to the C++ backend."
        );

        console.error(
            "CALCUX Clear History API error:",
            error
        );

    } finally {

        clearHistoryButton.disabled = false;

        clearHistoryButton.textContent =
            "Clear All";

    }

}


/* -----------------------------------------------------
   LOAD HISTORY WHEN HISTORY PAGE OPENS
   ----------------------------------------------------- */

navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            if (item.dataset.page === "history") {
                loadHistory();
            }

        }
    );

});


pageButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (
                button.dataset.pageTarget ===
                "history"
            ) {
                loadHistory();
            }

        }
    );

});
/* =====================================================
   STATISTICS INTEGRATION
   ===================================================== */

const statTotal =
    document.getElementById("stat-total");

const statOther =
    document.getElementById("stat-other");

const statAddition =
    document.getElementById("stat-addition");

const statSubtraction =
    document.getElementById("stat-subtraction");

const statMultiplication =
    document.getElementById("stat-multiplication");

const statDivision =
    document.getElementById("stat-division");

const statModulus =
    document.getElementById("stat-modulus");

const statPower =
    document.getElementById("stat-power");

const statOtherBreakdown =
    document.getElementById("stat-other-breakdown");

const statTotalBreakdown =
    document.getElementById("stat-total-breakdown");


/* -----------------------------------------------------
   LOAD STATISTICS FROM C++ BACKEND
   GET /history/statistics
   ----------------------------------------------------- */

async function loadStatistics() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/history/statistics`
            );


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "CALCUX statistics error:",
                data.message
            );

            return;
        }


        /*
           These values come directly from
           HistoryStatistics in the C++ backend.
        */

        if (statTotal) {
            statTotal.textContent =
                data.total;
        }

        if (statOther) {
            statOther.textContent =
                data.other;
        }

        if (statAddition) {
            statAddition.textContent =
                data.addition;
        }

        if (statSubtraction) {
            statSubtraction.textContent =
                data.subtraction;
        }

        if (statMultiplication) {
            statMultiplication.textContent =
                data.multiplication;
        }

        if (statDivision) {
            statDivision.textContent =
                data.division;
        }

        if (statModulus) {
            statModulus.textContent =
                data.modulus;
        }

        if (statPower) {
            statPower.textContent =
                data.power;
        }

        if (statOtherBreakdown) {
            statOtherBreakdown.textContent =
                data.other;
        }

        if (statTotalBreakdown) {
            statTotalBreakdown.textContent =
                data.total;
        }


    } catch (error) {

        console.error(
            "CALCUX Statistics API error:",
            error
        );

    }

}


/* -----------------------------------------------------
   LOAD WHEN STATISTICS PAGE IS OPENED
   ----------------------------------------------------- */

navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            if (item.dataset.page === "statistics") {
                loadStatistics();
            }

        }
    );

});


pageButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (
                button.dataset.pageTarget ===
                "statistics"
            ) {
                loadStatistics();
            }

        }
    );

});