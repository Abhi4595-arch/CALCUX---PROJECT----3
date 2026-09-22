#ifndef EXPRESSION_H
#define EXPRESSION_H

#include <string>

double evaluateExpression(
    const std::string &expression,
    bool &success,
    std::string &errorMessage
);

#endif