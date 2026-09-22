#include "calculator.h"
#include <cmath>
#include <cstdlib>

// Addition
double add(double a, double b)
{
    return a + b;
}

// Subtraction
double subtract(double a, double b)
{
    return a - b;
}

// Multiplication
double multiply(double a, double b)
{
    return a * b;
}

// Division
double divide(double a, double b)
{
    return a / b;
}

// Modulus
int calculateModulus(int a, int b)
{
    return a % b;
}

// Power
double power(double base, double exponent)
{
    return pow(base, exponent);
}

// Square root
double squareRoot(double number)
{
    return sqrt(number);
}

// Percentage
double percentage(double value, double percent)
{
    return (value * percent) / 100.0;
}

// Factorial
unsigned long long factorial(int n)
{
    unsigned long long result = 1;

    for (int i = 1; i <= n; i++)
    {
        result *= i;
    }

    return result;
}

// Prime check
bool isPrime(int n)
{
    if (n < 2)
    {
        return false;
    }

    for (int i = 2; i <= sqrt(n); i++)
    {
        if (n % i == 0)
        {
            return false;
        }
    }

    return true;
}

// Even / Odd
bool isEven(int n)
{
    return n % 2 == 0;
}

// GCD
int gcd(int a, int b)
{
    a = abs(a);
    b = abs(b);

    while (b != 0)
    {
        int remainder = a % b;
        a = b;
        b = remainder;
    }

    return a;
}

// LCM
int lcm(int a, int b)
{
    a = abs(a);
    b = abs(b);

    if (a == 0 || b == 0)
    {
        return 0;
    }

    return (a / gcd(a, b)) * b;
}