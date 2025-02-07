# cmake for the tests folder
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Include the headers directory
include_directories(${CMAKE_SOURCE_DIR}/recommendServer/headers)

# Add include paths for headers and source files
# include_directories(${CMAKE_SOURCE_DIR}/headers)
# include_directories(${CMAKE_SOURCE_DIR}/src)

set(
    TESTS_FILES
    main_test.cpp
    test_for_add.cpp
    test_for_recommend.cpp
    test_for_get.cpp
    test_for_help.cpp
    test_for_file.cpp
    test_for_consoleMenu.cpp
    test_for_app.cpp
    test_for_post.cpp
    tests_for_patch.cpp
    test_for_delete.cpp
)

add_executable(runTests ${TESTS_FILES})

target_link_libraries(runTests gtest_main netflix_p1)

#add the test
add_test(NAME runTests COMMAND runTests)