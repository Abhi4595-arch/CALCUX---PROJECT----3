#ifndef HISTORY_H
#define HISTORY_H

#include <string>
#include <vector>

struct HistoryStatistics
{
    int total;
    int addition;
    int subtraction;
    int multiplication;
    int division;
    int modulus;
    int power;
    int other;
};

std::string formatNumber(double number);

void addToHistory(
    const std::string &calculation,
    const std::string &category = ""
);

void saveCalculation(
    double a,
    const std::string &operation,
    double b,
    double result,
    const std::string &category = "ARITHMETIC"
);

// Data-oriented history functions
std::vector<std::string> getHistory();
std::vector<std::string> searchHistoryResults(
    const std::string &keyword
);

HistoryStatistics getHistoryStatistics();

// Console functions
void showHistory();
void searchHistory();
void showHistoryStatistics();
void clearHistory();

#endif