#include "api.h"

#include <cerrno>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <sstream>
#include <string>

#ifdef _WIN32

#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "ws2_32.lib")

using SocketType = SOCKET;

#else

#include <arpa/inet.h>
#include <csignal>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

using SocketType = int;

#endif

namespace
{
    int getPort()
    {
        const char *portEnv = std::getenv("PORT");

        if (portEnv == nullptr || *portEnv == '\0')
            return 8080;

        try
        {
            int port = std::stoi(portEnv);

            if (port < 1 || port > 65535)
                return 8080;

            return port;
        }
        catch (...)
        {
            return 8080;
        }
    }

    std::string makeHttpResponse(
        const std::string &body,
        int statusCode = 200,
        const std::string &statusText = "OK"
    )
    {
        std::ostringstream response;

        response
            << "HTTP/1.1 " << statusCode << " " << statusText << "\r\n"
            << "Content-Type: application/json; charset=utf-8\r\n"
            << "Access-Control-Allow-Origin: *\r\n"
            << "Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS\r\n"
            << "Access-Control-Allow-Headers: Content-Type\r\n"
            << "Content-Length: " << body.size() << "\r\n"
            << "Connection: close\r\n"
            << "\r\n"
            << body;

        return response.str();
    }

    std::string extractBody(const std::string &request)
    {
        const size_t separator = request.find("\r\n\r\n");

        if (separator == std::string::npos)
            return "";

        return request.substr(separator + 4);
    }

    size_t getContentLength(const std::string &request)
    {
        const std::string headerName = "Content-Length:";
        size_t pos = request.find(headerName);

        if (pos == std::string::npos)
            return 0;

        pos += headerName.size();

        while (
            pos < request.size() &&
            (request[pos] == ' ' || request[pos] == '\t')
        )
        {
            ++pos;
        }

        size_t end = request.find("\r\n", pos);

        if (end == std::string::npos)
            end = request.size();

        try
        {
            return static_cast<size_t>(
                std::stoul(
                    request.substr(pos, end - pos)
                )
            );
        }
        catch (...)
        {
            return 0;
        }
    }

    bool receiveHttpRequest(
        SocketType clientSocket,
        std::string &request
    )
    {
        constexpr size_t MAX_REQUEST_SIZE = 1024 * 1024;

        char buffer[8192];

        while (true)
        {
#ifdef _WIN32

            const int received = recv(
                clientSocket,
                buffer,
                sizeof(buffer),
                0
            );

#else

            const ssize_t received = recv(
                clientSocket,
                buffer,
                sizeof(buffer),
                0
            );

#endif

            if (received <= 0)
                break;

            request.append(
                buffer,
                static_cast<size_t>(received)
            );

            if (request.size() > MAX_REQUEST_SIZE)
                return false;

            const size_t headerEnd =
                request.find("\r\n\r\n");

            if (headerEnd == std::string::npos)
                continue;

            const size_t headerSize =
                headerEnd + 4;

            const size_t contentLength =
                getContentLength(request);

            if (
                request.size() >=
                headerSize + contentLength
            )
            {
                return true;
            }
        }

        const size_t headerEnd =
            request.find("\r\n\r\n");

        if (headerEnd == std::string::npos)
            return false;

        return true;
    }

    std::string routeRequest(
        const std::string &request
    )
    {
        if (request.rfind("OPTIONS ", 0) == 0)
            return makeHttpResponse("{}");

        if (request.rfind("GET /health ", 0) == 0)
        {
            return makeHttpResponse(
                "{\"success\":true,\"service\":\"CALCUX API\",\"status\":\"running\"}"
            );
        }

        if (request.rfind("GET /history ", 0) == 0)
        {
            return makeHttpResponse(
                handleHistoryRequest()
            );
        }

        if (request.rfind("GET /history/search", 0) == 0)
{
    std::string query;

    const std::string marker = "query=";
    size_t queryPosition = request.find(marker);

    if (queryPosition != std::string::npos)
    {
        queryPosition += marker.length();

        size_t queryEnd =
            request.find_first_of(" &\r\n", queryPosition);

        if (queryEnd == std::string::npos)
            queryEnd = request.size();

        query = request.substr(
            queryPosition,
            queryEnd - queryPosition
        );
    }

    return makeHttpResponse(
        searchHistoryRequest(query)
    );
}

if (request.rfind("GET /history/statistics ", 0) == 0)
{
    return makeHttpResponse(
        historyStatisticsRequest()
    );
}

        if (request.rfind("DELETE /history ", 0) == 0)
        {
            return makeHttpResponse(
                clearHistoryRequest()
            );
        }

        const std::string body =
            extractBody(request);

        if (request.rfind("POST /calculate ", 0) == 0)
        {
            return makeHttpResponse(
                handleCalculateRequest(body)
            );
        }

        if (request.rfind("POST /expression ", 0) == 0)
        {
            return makeHttpResponse(
                handleExpressionRequest(body)
            );
        }

        return makeHttpResponse(
            "{\"success\":false,\"message\":\"Endpoint not found.\"}",
            404,
            "Not Found"
        );
    }
}

int main()
{

#ifdef _WIN32

    WSADATA wsaData;

    const int wsaResult =
        WSAStartup(
            MAKEWORD(2, 2),
            &wsaData
        );

    if (wsaResult != 0)
    {
        std::cerr
            << "Error: WSAStartup failed: "
            << wsaResult
            << "\n";

        return 1;
    }

#else

    std::signal(SIGPIPE, SIG_IGN);

#endif


    const int port = getPort();


    SocketType serverSocket =
        socket(
            AF_INET,
            SOCK_STREAM,
            0
        );


#ifdef _WIN32

    if (serverSocket == INVALID_SOCKET)

#else

    if (serverSocket < 0)

#endif

    {
        std::cerr
            << "Error: Could not create server socket.\n";

#ifdef _WIN32

        std::cerr
            << "Winsock error: "
            << WSAGetLastError()
            << "\n";

        WSACleanup();

#else

        std::cerr
            << "System error: "
            << std::strerror(errno)
            << "\n";

#endif

        return 1;
    }


    int reuseAddress = 1;

    setsockopt(
        serverSocket,
        SOL_SOCKET,
        SO_REUSEADDR,
        reinterpret_cast<const char *>(
            &reuseAddress
        ),
        sizeof(reuseAddress)
    );


    sockaddr_in serverAddress{};

    serverAddress.sin_family =
        AF_INET;

    serverAddress.sin_addr.s_addr =
        htonl(INADDR_ANY);

    serverAddress.sin_port =
        htons(
            static_cast<unsigned short>(
                port
            )
        );


    if (
        bind(
            serverSocket,
            reinterpret_cast<sockaddr *>(
                &serverAddress
            ),
            sizeof(serverAddress)
        ) < 0
    )
    {
        std::cerr
            << "Error: Could not bind to port "
            << port
            << "\n";

#ifdef _WIN32

        std::cerr
            << "Winsock error: "
            << WSAGetLastError()
            << "\n";

        closesocket(serverSocket);
        WSACleanup();

#else

        std::cerr
            << "System error: "
            << std::strerror(errno)
            << "\n";

        close(serverSocket);

#endif

        return 1;
    }


    if (
        listen(
            serverSocket,
            20
        ) < 0
    )
    {
        std::cerr
            << "Error: Could not start listening.\n";

#ifdef _WIN32

        std::cerr
            << "Winsock error: "
            << WSAGetLastError()
            << "\n";

        closesocket(serverSocket);
        WSACleanup();

#else

        std::cerr
            << "System error: "
            << std::strerror(errno)
            << "\n";

        close(serverSocket);

#endif

        return 1;
    }


    std::cout
        << "\n========================================\n"
        << "       CALCUX C++ BACKEND API\n"
        << "========================================\n"
        << "Server listening on port: "
        << port
        << "\n"
        << "Health endpoint: /health\n"
        << "========================================\n";


    while (true)
    {

        SocketType clientSocket =
            accept(
                serverSocket,
                nullptr,
                nullptr
            );


#ifdef _WIN32

        if (clientSocket == INVALID_SOCKET)

#else

        if (clientSocket < 0)

#endif

        {

#ifdef _WIN32

            std::cerr
                << "Warning: accept() failed: "
                << WSAGetLastError()
                << "\n";

#else

            if (errno == EINTR)
                continue;

            std::cerr
                << "Warning: accept() failed: "
                << std::strerror(errno)
                << "\n";

#endif

            continue;
        }


        std::string request;


        if (
            receiveHttpRequest(
                clientSocket,
                request
            )
        )
        {

            const std::string response =
                routeRequest(request);


            size_t totalSent = 0;


            while (
                totalSent < response.size()
            )
            {

#ifdef _WIN32

                const int sent =
                    send(
                        clientSocket,
                        response.data() + totalSent,
                        static_cast<int>(
                            response.size() - totalSent
                        ),
                        0
                    );

#else

                const ssize_t sent =
                    send(
                        clientSocket,
                        response.data() + totalSent,
                        response.size() - totalSent,
                        0
                    );

#endif

                if (sent <= 0)
                    break;

                totalSent +=
                    static_cast<size_t>(sent);
            }
        }


#ifdef _WIN32

        closesocket(clientSocket);

#else

        close(clientSocket);

#endif

    }


#ifdef _WIN32

    closesocket(serverSocket);
    WSACleanup();

#else

    close(serverSocket);

#endif

    return 0;
}