#include "calculator_service.h"
#include "calculator.h"
#include "expression.h"
#include "history.h"

#include <sstream>
#include <cmath>

namespace
{
    CalculationResult successResult(
        double value,
        const std::string &message = ""
    )
    {
        return {true, value, message};
    }

    CalculationResult errorResult(
        const std::string &message
    )
    {
        return {false, 0.0, message};
    }
}


// ============================================================
// BASIC OPERATIONS
// ============================================================

CalculationResult CalculatorService::add(double a, double b)
{
    double result = ::add(a, b);

    saveCalculation(
        a,
        "+",
        b,
        result,
        "ARITHMETIC"
    );

    return successResult(result);
}


CalculationResult CalculatorService::subtract(double a, double b)
{
    double result = ::subtract(a, b);

    saveCalculation(
        a,
        "-",
        b,
        result,
        "ARITHMETIC"
    );

    return successResult(result);
}


CalculationResult CalculatorService::multiply(double a, double b)
{
    double result = ::multiply(a, b);

    saveCalculation(
        a,
        "*",
        b,
        result,
        "ARITHMETIC"
    );

    return successResult(result);
}


CalculationResult CalculatorService::divide(double a, double b)
{
    if (b == 0)
        return errorResult(
            "Division by zero is not allowed."
        );

    double result = ::divide(a, b);

    saveCalculation(
        a,
        "/",
        b,
        result,
        "ARITHMETIC"
    );

    return successResult(result);
}


CalculationResult CalculatorService::modulus(double a, double b)
{
    if (b == 0)
        return errorResult(
            "Modulus by zero is not allowed."
        );

    double result = std::fmod(a, b);

    saveCalculation(
        a,
        "%",
        b,
        result,
        "ARITHMETIC"
    );

    return successResult(result);
}


// ============================================================
// ADVANCED OPERATIONS
// ============================================================

CalculationResult CalculatorService::power(
    double base,
    double exponent
)
{
    double result = ::power(base, exponent);

    saveCalculation(
        base,
        "^",
        exponent,
        result,
        "ADVANCED"
    );

    return successResult(result);
}


CalculationResult CalculatorService::squareRoot(double number)
{
    if (number < 0)
        return errorResult(
            "Square root of a negative number is not supported."
        );

    double result = ::squareRoot(number);

    std::ostringstream calculation;

    calculation << "√"
                << formatNumber(number)
                << " = "
                << formatNumber(result);

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    return successResult(result);
}


CalculationResult CalculatorService::percentage(
    double value,
    double percent
)
{
    double result = ::percentage(value, percent);

    std::ostringstream calculation;

    calculation << formatNumber(percent)
                << "% of "
                << formatNumber(value)
                << " = "
                << formatNumber(result);

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    return successResult(result);
}


CalculationResult CalculatorService::factorial(int n)
{
    if (n < 0)
        return errorResult(
            "Factorial is not defined for negative numbers."
        );

    if (n > 20)
        return errorResult(
            "Please enter a number from 0 to 20."
        );

    double result =
        static_cast<double>(::factorial(n));

    std::ostringstream calculation;

    calculation << n
                << "! = "
                << formatNumber(result);

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    return successResult(result);
}


CalculationResult CalculatorService::primeCheck(int n)
{
    bool prime = ::isPrime(n);

    std::ostringstream calculation;

    calculation << n
                << " → "
                << (prime ? "Prime Number" : "Not a Prime Number");

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    if (prime)
    {
        return successResult(
            1.0,
            "Prime Number"
        );
    }

    return successResult(
        0.0,
        "Not a Prime Number"
    );
}


CalculationResult CalculatorService::evenOddCheck(int n)
{
    bool even = ::isEven(n);

    std::ostringstream calculation;

    calculation << n
                << " → "
                << (even ? "Even Number" : "Odd Number");

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    if (even)
    {
        return successResult(
            1.0,
            "Even Number"
        );
    }

    return successResult(
        0.0,
        "Odd Number"
    );
}


CalculationResult CalculatorService::gcd(int a, int b)
{
    int result = ::gcd(a, b);

    std::ostringstream calculation;

    calculation << "GCD("
                << a
                << ", "
                << b
                << ") = "
                << result;

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    return successResult(
        static_cast<double>(result)
    );
}


CalculationResult CalculatorService::lcm(int a, int b)
{
    int result = ::lcm(a, b);

    std::ostringstream calculation;

    calculation << "LCM("
                << a
                << ", "
                << b
                << ") = "
                << result;

    addToHistory(
        calculation.str(),
        "ADVANCED"
    );

    return successResult(
        static_cast<double>(result)
    );
}


// ============================================================
// EXPRESSION CALCULATOR
// ============================================================

CalculationResult CalculatorService::expression(
    const std::string &input
)
{
    bool success = false;
    std::string errorMessage;

    double result = evaluateExpression(
        input,
        success,
        errorMessage
    );

    if (!success)
        return errorResult(errorMessage);

    std::ostringstream calculation;

    calculation << input
                << " = "
                << formatNumber(result);

    addToHistory(
        calculation.str(),
        "EXPRESSION"
    );

    return successResult(result);
}