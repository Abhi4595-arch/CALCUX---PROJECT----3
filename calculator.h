#ifndef CALCULATOR_H
#define CALCULATOR_H

// Basic operations
double add(double a, double b);
double subtract(double a, double b);
double multiply(double a, double b);
double divide(double a, double b);
int calculateModulus(int a, int b);

// Advanced operations
double power(double base, double exponent);
double squareRoot(double number);
double percentage(double value, double percent);
unsigned long long factorial(int n);
bool isPrime(int n);
bool isEven(int n);
int gcd(int a, int b);
int lcm(int a, int b);

#endif