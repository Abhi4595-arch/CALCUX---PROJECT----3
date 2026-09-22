FROM debian:bookworm-slim AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN g++ -std=c++17 -O2 \
    backend/server.cpp \
    backend/api.cpp \
    calculator_service.cpp \
    calculator.cpp \
    expression.cpp \
    history.cpp \
    -o calcux_server

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=build /app/calcux_server /app/calcux_server

RUN mkdir -p /app/data

EXPOSE 10000

CMD ["./calcux_server"]