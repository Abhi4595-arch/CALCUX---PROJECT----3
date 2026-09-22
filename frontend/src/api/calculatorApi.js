const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Server error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Keep default error.
    }

    throw new Error(message);
  }

  return response.json();
}


/*
 * Backend health
 */
export async function checkHealth() {
  return request("/health");
}


/*
 * Binary calculations
 *
 * add
 * subtract
 * multiply
 * divide
 * modulus
 * power
 * percentage
 * gcd
 * lcm
 */
export async function calculate(operation, a, b) {
  return request("/calculate", {
    method: "POST",

    body: JSON.stringify({
      operation,
      a,
      b,
    }),
  });
}


/*
 * Unary calculations
 *
 * squareRoot
 * factorial
 * primeCheck
 * evenOddCheck
 */
export async function calculateUnary(operation, value) {
  return request("/calculate", {
    method: "POST",

    body: JSON.stringify({
      operation,
      value,
    }),
  });
}


/*
 * Expression calculator
 */
export async function calculateExpression(expression) {
  return request("/expression", {
    method: "POST",

    body: JSON.stringify({
      expression,
    }),
  });
}


/*
 * History
 */
export async function getHistory() {
  return request("/history");
}


/*
 * Clear history
 */
export async function clearHistory() {
  const response = await fetch(
    `${API_BASE_URL}/history`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    let message = `Server error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Keep default error.
    }

    throw new Error(message);
  }

  return response.json();
}
export async function searchHistory(query) {
  return request(
    `/history/search?query=${encodeURIComponent(query)}`
  );
}

export async function getHistoryStatistics() {
  return request("/history/statistics");
}
