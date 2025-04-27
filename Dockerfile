FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/mytest
WORKDIR /usr/src/mytest

RUN mkdir build
RUN mkdir -p /app/data

WORKDIR /usr/src/mytest/build

RUN cmake .. && make

CMD ./runTests && ./runMain