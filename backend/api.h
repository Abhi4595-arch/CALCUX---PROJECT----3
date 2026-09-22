#ifndef API_H
#define API_H

#include <string>

std::string handleCalculateRequest(
    const std::string &body
);

std::string handleExpressionRequest(
    const std::string &body
);

std::string handleHistoryRequest();

std::string searchHistoryRequest(
    const std::string &query
);

std::string historyStatisticsRequest();

std::string clearHistoryRequest();

#endif