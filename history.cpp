#include "history.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>
#include <vector>

using namespace std;

const string HISTORY_FILE = "history.txt";


// ============================================================
// FORMAT NUMBER
// ============================================================

string formatNumber(double number)
{
    ostringstream output;

    output << fixed << setprecision(10) << number;

    string result = output.str();

    // Remove unnecessary trailing zeros
    result.erase(
        result.find_last_not_of('0') + 1
    );

    // Remove trailing decimal point
    if (!result.empty() && result.back() == '.')
    {
        result.pop_back();
    }

    return result;
}


// ============================================================
// ADD TO HISTORY
// ============================================================

void addToHistory(
    const string &calculation,
    const string &category
)
{
    ofstream file(HISTORY_FILE, ios::app);

    if (!file)
    {
        cout << "Warning: Unable to save calculation history.\n";
        return;
    }

    // Store category only when provided
    if (!category.empty())
    {
        file << "[" << category << "] "
             << calculation
             << endl;
    }
    else
    {
        file << calculation << endl;
    }

    file.close();
}


// ============================================================
// SAVE STANDARD CALCULATION
// ============================================================

void saveCalculation(
    double a,
    const string &operation,
    double b,
    double result,
    const string &category
)
{
    string calculation =
        formatNumber(a) + " " +
        operation + " " +
        formatNumber(b) + " = " +
        formatNumber(result);

    addToHistory(calculation, category);
}


// ============================================================
// GET HISTORY
// ============================================================

vector<string> getHistory()
{
    vector<string> history;

    ifstream file(HISTORY_FILE);

    if (!file)
    {
        return history;
    }

    string line;

    while (getline(file, line))
    {
        if (!line.empty())
        {
            history.push_back(line);
        }
    }

    file.close();

    return history;
}


// ============================================================
// SEARCH HISTORY RESULTS
// ============================================================

vector<string> searchHistoryResults(
    const string &keyword
)
{
    vector<string> results;

    vector<string> history = getHistory();

    for (size_t i = 0; i < history.size(); i++)
    {
        if (history[i].find(keyword) != string::npos)
        {
            results.push_back(history[i]);
        }
    }

    return results;
}


// ============================================================
// HISTORY STATISTICS DATA
// ============================================================

HistoryStatistics getHistoryStatistics()
{
    HistoryStatistics statistics;

    statistics.total = 0;
    statistics.addition = 0;
    statistics.subtraction = 0;
    statistics.multiplication = 0;
    statistics.division = 0;
    statistics.modulus = 0;
    statistics.power = 0;
    statistics.other = 0;

    vector<string> history = getHistory();

    for (size_t i = 0; i < history.size(); i++)
    {
        const string &line = history[i];

        statistics.total++;

        if (line.find(" + ") != string::npos)
        {
            statistics.addition++;
        }
        else if (line.find(" - ") != string::npos)
        {
            statistics.subtraction++;
        }
        else if (line.find(" * ") != string::npos)
        {
            statistics.multiplication++;
        }
        else if (line.find(" / ") != string::npos)
        {
            statistics.division++;
        }
        else if (line.find(" % ") != string::npos)
        {
            statistics.modulus++;
        }
        else if (line.find(" ^ ") != string::npos)
        {
            statistics.power++;
        }
        else
        {
            statistics.other++;
        }
    }

    return statistics;
}


// ============================================================
// VIEW HISTORY
// ============================================================

void showHistory()
{
    vector<string> history = getHistory();

    cout << "\n========================================\n";
    cout << "          CALCULATION HISTORY\n";
    cout << "========================================\n";

    if (history.empty())
    {
        cout << "No calculation history available.\n";
    }
    else
    {
        for (size_t i = 0; i < history.size(); i++)
        {
            cout << i + 1 << ". "
                 << history[i]
                 << endl;
        }
    }

    cout << "========================================\n";
}


// ============================================================
// SEARCH HISTORY - CONSOLE
// ============================================================

void searchHistory()
{
    cin.ignore();

    string keyword;

    cout << "\nEnter search keyword: ";
    getline(cin, keyword);

    vector<string> results = searchHistoryResults(keyword);

    cout << "\n========================================\n";
    cout << "           SEARCH RESULTS\n";
    cout << "========================================\n";

    for (size_t i = 0; i < results.size(); i++)
    {
        cout << i + 1 << ". "
             << results[i]
             << endl;
    }

    if (results.empty())
    {
        cout << "No matching calculations found.\n";
    }
    else
    {
        cout << "\nMatches found: "
             << results.size()
             << endl;
    }

    cout << "========================================\n";
}


// ============================================================
// HISTORY STATISTICS - CONSOLE
// ============================================================

void showHistoryStatistics()
{
    HistoryStatistics statistics =
        getHistoryStatistics();

    cout << "\n========================================\n";
    cout << "          HISTORY STATISTICS\n";
    cout << "========================================\n";

    cout << "Total Calculations : "
         << statistics.total
         << endl;

    cout << "\nOperation Breakdown\n";
    cout << "----------------------------\n";

    cout << "Addition           : "
         << statistics.addition
         << endl;

    cout << "Subtraction        : "
         << statistics.subtraction
         << endl;

    cout << "Multiplication     : "
         << statistics.multiplication
         << endl;

    cout << "Division           : "
         << statistics.division
         << endl;

    cout << "Modulus            : "
         << statistics.modulus
         << endl;

    cout << "Power              : "
         << statistics.power
         << endl;

    cout << "Other Operations   : "
         << statistics.other
         << endl;

    cout << "========================================\n";
}


// ============================================================
// CLEAR HISTORY
// ============================================================

void clearHistory()
{
    ofstream file(HISTORY_FILE, ios::trunc);

    if (!file)
    {
        cout << "Error: Unable to clear history.\n";
        return;
    }

    file.close();

    cout << "\nCalculation history cleared successfully.\n";
}