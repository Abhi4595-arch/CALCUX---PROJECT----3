#include "expression.h"

#include <cmath>
#include <cctype>
#include <cstdlib>
#include <stack>
#include <sstream>
#include <string>

using namespace std;


// Check whether character is an operator
bool isOperator(char ch)
{
    return ch == '+' ||
           ch == '-' ||
           ch == '*' ||
           ch == '/' ||
           ch == '^';
}


// Operator precedence
int precedence(char op)
{
    if (op == '+' || op == '-')
        return 1;

    if (op == '*' || op == '/')
        return 2;

    if (op == '^')
        return 3;

    return 0;
}


// Apply an operation
bool applyOperation(
    stack<double> &values,
    char operation,
    string &errorMessage
)
{
    if (values.size() < 2)
    {
        errorMessage = "Invalid expression.";
        return false;
    }

    double right = values.top();
    values.pop();

    double left = values.top();
    values.pop();

    double result = 0;

    switch (operation)
    {
        case '+':

            result = left + right;
            break;


        case '-':

            result = left - right;
            break;


        case '*':

            result = left * right;
            break;


        case '/':

            if (right == 0)
            {
                errorMessage =
                    "Division by zero is not allowed.";

                return false;
            }

            result = left / right;
            break;


        case '^':

            result = pow(left, right);
            break;


        default:

            errorMessage = "Unknown operator.";
            return false;
    }

    values.push(result);

    return true;
}


// Evaluate expression
double evaluateExpression(
    const string &expression,
    bool &success,
    string &errorMessage
)
{
    stack<double> values;
    stack<char> operators;

    success = false;
    errorMessage = "";

    bool expectingNumber = true;

    for (size_t i = 0; i < expression.length();)
    {
        char ch = expression[i];


        // Ignore spaces
        if (isspace(ch))
        {
            i++;
            continue;
        }


        // Number
        if (isdigit(ch) || ch == '.')
        {
            size_t start = i;

            while (
                i < expression.length() &&
                (isdigit(expression[i]) ||
                 expression[i] == '.')
            )
            {
                i++;
            }

            string numberText =
                expression.substr(
                    start,
                    i - start
                );

            char *endPointer;

            double number =
                strtod(
                    numberText.c_str(),
                    &endPointer
                );

            if (*endPointer != '\0')
            {
                errorMessage =
                    "Invalid number.";

                return 0;
            }

            values.push(number);

            expectingNumber = false;

            continue;
        }


        // Opening parenthesis
        if (ch == '(')
        {
            operators.push(ch);

            expectingNumber = true;

            i++;

            continue;
        }


        // Closing parenthesis
        if (ch == ')')
        {
            while (
                !operators.empty() &&
                operators.top() != '('
            )
            {
                char op = operators.top();

                operators.pop();

                if (!applyOperation(
                        values,
                        op,
                        errorMessage))
                {
                    return 0;
                }
            }

            if (operators.empty())
            {
                errorMessage =
                    "Mismatched parentheses.";

                return 0;
            }

            operators.pop();

            expectingNumber = false;

            i++;

            continue;
        }


        // Operator
        if (isOperator(ch))
        {
            // Unary minus
            if (ch == '-' && expectingNumber)
            {
                values.push(0);
            }
            else if (expectingNumber)
            {
                errorMessage =
                    "Invalid operator placement.";

                return 0;
            }

            while (
                !operators.empty() &&
                operators.top() != '(' &&
                precedence(operators.top()) >=
                    precedence(ch)
            )
            {
                char op = operators.top();

                operators.pop();

                if (!applyOperation(
                        values,
                        op,
                        errorMessage))
                {
                    return 0;
                }
            }

            operators.push(ch);

            expectingNumber = true;

            i++;

            continue;
        }


        // Invalid character
        errorMessage =
            "Invalid character in expression.";

        return 0;
    }


    if (expectingNumber && !values.empty())
    {
        errorMessage =
            "Expression cannot end with an operator.";

        return 0;
    }


    // Apply remaining operators
    while (!operators.empty())
    {
        char op = operators.top();

        operators.pop();

        if (op == '(')
        {
            errorMessage =
                "Mismatched parentheses.";

            return 0;
        }

        if (!applyOperation(
                values,
                op,
                errorMessage))
        {
            return 0;
        }
    }


    if (values.size() != 1)
    {
        errorMessage =
            "Invalid expression.";

        return 0;
    }


    success = true;

    return values.top();
}