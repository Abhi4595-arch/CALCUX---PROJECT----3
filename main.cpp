#include <iostream>
#include <limits>
#include <string>
#include "calculator.h"
#include "history.h"
#include "expression.h"
#include "calculator_service.h"

using namespace std;

// Input functions
void clearInput();
bool readNumber(double &number);
bool readInteger(int &number);

// Display menu
void displayMenu();


int main()
{
    int choice;
    double num1, num2;

    do
    {
        displayMenu();

        cout << "Enter your choice: ";

        if (!(cin >> choice))
        {
            cout << "\nError: Please enter a valid numeric choice.\n";
            clearInput();
            continue;
        }

        switch (choice)
        {
            // ==================== ADDITION ====================

            case 1:
            {
                cout << "\nEnter first number: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter second number: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::add(num1, num2);
                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                    break;
                }
                double result = calculation.value;

                cout << "Result = " << result << endl;

                saveCalculation(
                    num1,
                    "+",
                    num2,
                    result
                );

                break;
            }


            // ==================== SUBTRACTION ====================

            case 2:
            {
                cout << "\nEnter first number: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter second number: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::subtract(num1, num2);
                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                    break;
                }
                double result = calculation.value;

                cout << "Result = " << result << endl;

                saveCalculation(
                    num1,
                    "-",
                    num2,
                    result
                );

                break;
            }


            // ==================== MULTIPLICATION ====================

            case 3:
            {
                cout << "\nEnter first number: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter second number: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::multiply(num1, num2);
                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                    break;
                }
                double result = calculation.value;

                cout << "Result = " << result << endl;

                saveCalculation(
                    num1,
                    "*",
                    num2,
                    result
                );

                break;
            }


            // ==================== DIVISION ====================

            case 4:
            {
                cout << "\nEnter first number: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter second number: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::divide(num1, num2);

                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                }
                else
                {
                    double result = calculation.value;

                    cout << "Result = " << result << endl;

                    saveCalculation(
                        num1,
                        "/",
                        num2,
                        result
                    );
                }

                break;
            }


            // ==================== MODULUS ====================

            case 5:
            {
                int a, b;

                cout << "\nEnter first integer: ";

                if (!readInteger(a))
                    break;

                cout << "Enter second integer: ";

                if (!readInteger(b))
                    break;

                CalculationResult calculation = CalculatorService::modulus(a, b);

                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                }
                else
                {
                    int result = static_cast<int>(calculation.value);

                    cout << "Result = " << result << endl;

                    addToHistory(
                        formatNumber(a) +
                        " % " +
                        formatNumber(b) +
                        " = " +
                        formatNumber(result)
                    );
                }

                break;
            }


            // ==================== POWER ====================

            case 6:
            {
                cout << "\nEnter base: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter exponent: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::power(num1, num2);
                double result = calculation.value;

                cout << "Result = " << result << endl;

                saveCalculation(
                    num1,
                    "^",
                    num2,
                    result
                );

                break;
            }


            // ==================== SQUARE ROOT ====================

            case 7:
            {
                cout << "\nEnter number: ";

                if (!readNumber(num1))
                    break;

                CalculationResult calculation = CalculatorService::squareRoot(num1);

                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                }
                else
                {
                    double result = calculation.value;

                    cout << "Result = " << result << endl;

                    addToHistory(
                        "sqrt(" +
                        formatNumber(num1) +
                        ") = " +
                        formatNumber(result)
                    );
                }

                break;
            }


            // ==================== PERCENTAGE ====================

            case 8:
            {
                cout << "\nEnter value: ";

                if (!readNumber(num1))
                    break;

                cout << "Enter percentage: ";

                if (!readNumber(num2))
                    break;

                CalculationResult calculation = CalculatorService::percentage(num1, num2);
                double result = calculation.value;

                cout << "Result = " << result << endl;

                addToHistory(
                    formatNumber(num2) +
                    "% of " +
                    formatNumber(num1) +
                    " = " +
                    formatNumber(result)
                );

                break;
            }


            // ==================== FACTORIAL ====================

            case 9:
            {
                int n;

                cout << "\nEnter a non-negative integer: ";

                if (!readInteger(n))
                    break;

                CalculationResult calculation = CalculatorService::factorial(n);

                if (!calculation.success)
                {
                    cout << "Error: " << calculation.message << endl;
                }
                else
                {
                    unsigned long long result = static_cast<unsigned long long>(calculation.value);

                    cout << "Result = " << result << endl;

                    addToHistory(
                        formatNumber(n) +
                        "! = " +
                        formatNumber(result)
                    );
                }

                break;
            }


            // ==================== PRIME CHECK ====================

            case 10:
            {
                int n;

                cout << "\nEnter an integer: ";

                if (!readInteger(n))
                    break;

                CalculationResult calculation = CalculatorService::primeCheck(n);

                if (calculation.success && calculation.value == 1.0)
                {
                    cout << n << " is a prime number.\n";

                    addToHistory(
                        formatNumber(n) +
                        " -> Prime Number"
                    );
                }
                else
                {
                    cout << n << " is not a prime number.\n";

                    addToHistory(
                        formatNumber(n) +
                        " -> Not a Prime Number"
                    );
                }

                break;
            }


            // ==================== EVEN / ODD ====================

            case 11:
            {
                int n;

                cout << "\nEnter an integer: ";

                if (!readInteger(n))
                    break;

                CalculationResult calculation = CalculatorService::evenOddCheck(n);

                if (calculation.success && calculation.value == 1.0)
                {
                    cout << n << " is an even number.\n";

                    addToHistory(
                        formatNumber(n) +
                        " -> Even Number"
                    );
                }
                else
                {
                    cout << n << " is an odd number.\n";

                    addToHistory(
                        formatNumber(n) +
                        " -> Odd Number"
                    );
                }

                break;
            }


            // ==================== GCD ====================

            case 12:
            {
                int a, b;

                cout << "\nEnter first integer: ";

                if (!readInteger(a))
                    break;

                cout << "Enter second integer: ";

                if (!readInteger(b))
                    break;

                CalculationResult calculation = CalculatorService::gcd(a, b);
                int result = static_cast<int>(calculation.value);

                cout << "GCD = " << result << endl;

                addToHistory(
                    "GCD(" +
                    formatNumber(a) +
                    ", " +
                    formatNumber(b) +
                    ") = " +
                    formatNumber(result)
                );

                break;
            }


            // ==================== LCM ====================

            case 13:
            {
                int a, b;

                cout << "\nEnter first integer: ";

                if (!readInteger(a))
                    break;

                cout << "Enter second integer: ";

                if (!readInteger(b))
                    break;

                CalculationResult calculation = CalculatorService::lcm(a, b);
                int result = static_cast<int>(calculation.value);

                cout << "LCM = " << result << endl;

                addToHistory(
                    "LCM(" +
                    formatNumber(a) +
                    ", " +
                    formatNumber(b) +
                    ") = " +
                    formatNumber(result)
                );

                break;
            }


            // ==================== VIEW HISTORY ====================

            case 14:
            {
                showHistory();

                break;
            }


            // ==================== SEARCH HISTORY ====================

            case 15:
            {
                searchHistory();

                break;
            }


            // ==================== HISTORY STATISTICS ====================

            case 16:
            {
                showHistoryStatistics();

                break;
            }


            // ==================== CLEAR HISTORY ====================

            case 17:
            {
                char confirm;

                cout << "\nAre you sure you want to clear "
                     << "calculation history? (y/n): ";

                cin >> confirm;

                if (confirm == 'y' || confirm == 'Y')
                {
                    clearHistory();
                }
                else
                {
                    cout << "History was not cleared.\n";
                }

                break;
            }


            // ==================== EXPRESSION CALCULATOR ====================

            case 18:
            {
                cin.ignore(numeric_limits<streamsize>::max(), '\n');

                string expression;

                cout << "\nEnter expression: ";
                getline(cin, expression);

                if (expression.empty())
                {
                    cout << "Error: Expression cannot be empty.\n";
                    break;
                }

                CalculationResult calculation =
                    CalculatorService::expression(expression);

                if (!calculation.success)
                {
                    cout << "Error: "
                         << calculation.message
                         << endl;
                }
                else
                {
                    cout << "Result = "
                         << formatNumber(calculation.value)
                         << endl;

                    addToHistory(
                        expression +
                        " = " +
                        formatNumber(calculation.value)
                    );
                }

                break;
            }


            // ==================== EXIT ====================

            case 19:
            {
                cout << "\nThank you for using CALCUX!\n";

                break;
            }


            // ==================== INVALID CHOICE ====================

            default:
            {
                cout << "\nInvalid choice!"
                     << " Please select an option from 1 to 19.\n";

                break;
            }
        }

    } while (choice != 19);

    return 0;
}


// ============================================================
// DISPLAY MENU
// ============================================================

void displayMenu()
{
    cout << "\n========================================\n";
    cout << "          CALCUX - CALCULATOR\n";
    cout << "========================================\n";

    cout << "1.  Addition\n";
    cout << "2.  Subtraction\n";
    cout << "3.  Multiplication\n";
    cout << "4.  Division\n";
    cout << "5.  Modulus\n";

    cout << "6.  Power\n";
    cout << "7.  Square Root\n";
    cout << "8.  Percentage\n";
    cout << "9.  Factorial\n";

    cout << "10. Prime Check\n";
    cout << "11. Even / Odd Check\n";
    cout << "12. GCD\n";
    cout << "13. LCM\n";

    cout << "14. View History\n";
    cout << "15. Search History\n";
    cout << "16. History Statistics\n";
    cout << "17. Clear History\n";
    cout << "18. Expression Calculator\n";
    cout << "19. Exit\n";

    cout << "========================================\n";
}


// ============================================================
// INPUT HANDLING
// ============================================================

// Clear invalid input
void clearInput()
{
    cin.clear();

    cin.ignore(
        numeric_limits<streamsize>::max(),
        '\n'
    );
}


// Read decimal number
bool readNumber(double &number)
{
    if (cin >> number)
    {
        return true;
    }

    cout << "Error: Please enter a valid number.\n";

    clearInput();

    return false;
}


// Read integer
bool readInteger(int &number)
{
    if (cin >> number)
    {
        return true;
    }

    cout << "Error: Please enter a valid integer.\n";

    clearInput();

    return false;
}