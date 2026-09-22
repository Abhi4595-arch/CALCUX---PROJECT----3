#include "api.h"

#include "../calculator_service.h"
#include "../history.h"

#include <cstdlib>
#include <fstream>
#include <vector>
#include <sstream>
#include <string>

namespace
{

// ============================================================
// EXTRACT NUMBER FROM JSON BODY
// ============================================================

bool extractNumber(
    const std::string &body,
    const std::string &key,
    double &value
)
{
    std::string token = "\"" + key + "\"";

    size_t pos = body.find(token);

    if (pos == std::string::npos)
        return false;

    pos = body.find(':', pos);

    if (pos == std::string::npos)
        return false;

    ++pos;

    try
    {
        value = std::stod(body.substr(pos));
        return true;
    }
    catch (...)
    {
        return false;
    }
}


// ============================================================
// EXTRACT STRING FROM JSON BODY
// ============================================================

bool extractString(
    const std::string &body,
    const std::string &key,
    std::string &value
)
{
    std::string token = "\"" + key + "\"";

    size_t pos = body.find(token);

    if (pos == std::string::npos)
        return false;

    pos = body.find(':', pos);

    if (pos == std::string::npos)
        return false;

    pos = body.find('"', pos);

    if (pos == std::string::npos)
        return false;

    ++pos;

    size_t end = body.find('"', pos);

    if (end == std::string::npos)
        return false;

    value = body.substr(pos, end - pos);

    return true;
}


// ============================================================
// JSON ESCAPE
// ============================================================

std::string jsonEscape(
    const std::string &text
)
{
    std::string result;

    for (char c : text)
    {
        if (c == '"')
        {
            result += "\\\"";
        }
        else if (c == '\\')
        {
            result += "\\\\";
        }
        else if (c == '\n')
        {
            result += "\\n";
        }
        else if (c == '\r')
        {
            result += "\\r";
        }
        else if (c == '\t')
        {
            result += "\\t";
        }
        else
        {
            result += c;
        }
    }

    return result;
}


// ============================================================
// CALCULATION RESULT JSON
// ============================================================

std::string resultJson(
    const CalculationResult &result
)
{
    std::ostringstream response;

    response
        << "{"
        << "\"success\":"
        << (result.success ? "true" : "false")
        << ",\"value\":"
        << result.value
        << ",\"message\":\""
        << jsonEscape(result.message)
        << "\""
        << "}";

    return response.str();
}


// ============================================================
// HISTORY SEARCH JSON
// ============================================================

std::string searchHistoryJson(
    const std::string &query
)
{
    std::vector<std::string> results =
        searchHistoryResults(query);

    std::ostringstream response;

    response
        << "{"
        << "\"success\":true,"
        << "\"query\":\""
        << jsonEscape(query)
        << "\","
        << "\"count\":"
        << results.size()
        << ","
        << "\"history\":[";

    for (size_t i = 0; i < results.size(); ++i)
    {
        if (i > 0)
            response << ",";

        response
            << "\""
            << jsonEscape(results[i])
            << "\"";
    }

    response << "]}";

    return response.str();
}


// ============================================================
// HISTORY STATISTICS JSON
// ============================================================

std::string historyStatisticsJson()
{
    HistoryStatistics statistics =
        getHistoryStatistics();

    std::ostringstream response;

    response
        << "{"
        << "\"success\":true,"
        << "\"total\":"
        << statistics.total
        << ","
        << "\"addition\":"
        << statistics.addition
        << ","
        << "\"subtraction\":"
        << statistics.subtraction
        << ","
        << "\"multiplication\":"
        << statistics.multiplication
        << ","
        << "\"division\":"
        << statistics.division
        << ","
        << "\"modulus\":"
        << statistics.modulus
        << ","
        << "\"power\":"
        << statistics.power
        << ","
        << "\"other\":"
        << statistics.other
        << "}";

    return response.str();
}

}


// ============================================================
// CALCULATE REQUEST
// ============================================================

std::string handleCalculateRequest(
    const std::string &body
)
{
    std::string operation;

    double a = 0;
    double b = 0;

    if (!extractString(
            body,
            "operation",
            operation
        ))
    {
        return
            "{\"success\":false,"
            "\"message\":\"Operation is required.\"}";
    }


    // --------------------------------------------------------
    // Binary operations
    // --------------------------------------------------------

    if (
        operation == "add" ||
        operation == "subtract" ||
        operation == "multiply" ||
        operation == "divide" ||
        operation == "modulus" ||
        operation == "power" ||
        operation == "percentage" ||
        operation == "gcd" ||
        operation == "lcm"
    )
    {
        if (!extractNumber(
                body,
                "a",
                a
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"First number 'a' is required.\"}";
        }

        if (!extractNumber(
                body,
                "b",
                b
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"Second number 'b' is required.\"}";
        }
    }


    CalculationResult result;


    // --------------------------------------------------------
    // Basic operations
    // --------------------------------------------------------

    if (operation == "add")
    {
        result =
            CalculatorService::add(
                a,
                b
            );
    }

    else if (operation == "subtract")
    {
        result =
            CalculatorService::subtract(
                a,
                b
            );
    }

    else if (operation == "multiply")
    {
        result =
            CalculatorService::multiply(
                a,
                b
            );
    }

    else if (operation == "divide")
    {
        result =
            CalculatorService::divide(
                a,
                b
            );
    }

    else if (operation == "modulus")
    {
        result =
            CalculatorService::modulus(
                a,
                b
            );
    }


    // --------------------------------------------------------
    // Advanced binary operations
    // --------------------------------------------------------

    else if (operation == "power")
    {
        result =
            CalculatorService::power(
                a,
                b
            );
    }

    else if (operation == "percentage")
    {
        result =
            CalculatorService::percentage(
                a,
                b
            );
    }

    else if (operation == "gcd")
    {
        result =
            CalculatorService::gcd(
                static_cast<int>(a),
                static_cast<int>(b)
            );
    }

    else if (operation == "lcm")
    {
        result =
            CalculatorService::lcm(
                static_cast<int>(a),
                static_cast<int>(b)
            );
    }


    // --------------------------------------------------------
    // Advanced unary operations
    // --------------------------------------------------------

    else if (operation == "squareRoot")
    {
        double value;

        if (!extractNumber(
                body,
                "value",
                value
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"Value is required.\"}";
        }

        result =
            CalculatorService::squareRoot(
                value
            );
    }

    else if (operation == "factorial")
    {
        double value;

        if (!extractNumber(
                body,
                "value",
                value
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"Value is required.\"}";
        }

        result =
            CalculatorService::factorial(
                static_cast<int>(value)
            );
    }

    else if (operation == "primeCheck")
    {
        double value;

        if (!extractNumber(
                body,
                "value",
                value
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"Value is required.\"}";
        }

        result =
            CalculatorService::primeCheck(
                static_cast<int>(value)
            );
    }

    else if (operation == "evenOddCheck")
    {
        double value;

        if (!extractNumber(
                body,
                "value",
                value
            ))
        {
            return
                "{\"success\":false,"
                "\"message\":\"Value is required.\"}";
        }

        result =
            CalculatorService::evenOddCheck(
                static_cast<int>(value)
            );
    }

    else
    {
        return
            "{\"success\":false,"
            "\"message\":\"Unsupported operation.\"}";
    }

    return resultJson(result);
}


// ============================================================
// EXPRESSION REQUEST
// ============================================================

std::string handleExpressionRequest(
    const std::string &body
)
{
    std::string input;

    if (!extractString(
            body,
            "expression",
            input
        ))
    {
        return
            "{\"success\":false,"
            "\"message\":\"Expression is required.\"}";
    }

    CalculationResult result =
        CalculatorService::expression(
            input
        );

    return resultJson(result);
}


// ============================================================
// GET /history
// ============================================================

std::string handleHistoryRequest()
{
    std::vector<std::string> entries =
        getHistory();

    std::ostringstream response;

    response
        << "{"
        << "\"success\":true,"
        << "\"count\":"
        << entries.size()
        << ","
        << "\"history\":[";

    for (size_t i = 0; i < entries.size(); ++i)
    {
        if (i > 0)
            response << ",";

        response
            << "\""
            << jsonEscape(entries[i])
            << "\"";
    }

    response << "]}";

    return response.str();
}


// ============================================================
// SEARCH /history
// ============================================================

std::string searchHistoryRequest(
    const std::string &query
)
{
    return searchHistoryJson(query);
}


// ============================================================
// HISTORY STATISTICS
// ============================================================

std::string historyStatisticsRequest()
{
    return historyStatisticsJson();
}


// ============================================================
// DELETE /history
// ============================================================

std::string clearHistoryRequest()
{
    std::ofstream file(
        "history.txt",
        std::ios::trunc
    );

    if (!file.is_open())
    {
        return
            "{\"success\":false,"
            "\"message\":\"Unable to clear history.\"}";
    }

    file.close();

    return
        "{\"success\":true,"
        "\"message\":\"History cleared successfully.\"}";
}