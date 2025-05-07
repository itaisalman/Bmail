cmake_minimum_required(VERSION 3.10)

project(Bmail)

# GoogleTest requires at least C++14
set(CMAKE_CXX_STANDARD 14)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# Create a list of all test files
set(TEST_FILES
  src/function-tests.cpp
  src/server-tests.cpp  
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests ${TEST_FILES} src/Storage.cpp src/BloomFilter.cpp src/Input.cpp)
add_executable(runServer src/Server.cpp src/Storage.cpp src/BloomFilter.cpp src/Input.cpp src/Add.cpp src/Check.cpp src/Delete.cpp)

# Add include path for headers in src/
target_include_directories(runTests PRIVATE ${CMAKE_SOURCE_DIR}/src)
target_include_directories(runServer PRIVATE ${CMAKE_SOURCE_DIR}/src)

target_link_libraries(runTests gtest_main)

target_compile_features(runTests PRIVATE cxx_std_11)
target_compile_features(runServer PRIVATE cxx_std_11)