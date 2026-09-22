#ifndef CALCULATOR_SERVICE_H
#define CALCULATOR_SERVICE_H

#include <string>

struct CalculationResult
{
    bool success;
    double value;
    std::string message;
};

class CalculatorService
{
public:
    static CalculationResult add(double a, double b);
    static CalculationResult subtract(double a, double b);
    static CalculationResult multiply(double a, double b);
    static CalculationResult divide(double a, double b);
    static CalculationResult modulus(double a, double b);

    static CalculationResult power(double base, double exponent);
    static CalculationResult squareRoot(double number);
    static CalculationResult percentage(double value, double percent);

    static CalculationResult factorial(int n);
    static CalculationResult primeCheck(int n);
    static CalculationResult evenOddCheck(int n);
    static CalculationResult gcd(int a, int b);
    static CalculationResult lcm(int a, int b);

    static CalculationResult expression(
        const std::string &input
    );
};

#endif