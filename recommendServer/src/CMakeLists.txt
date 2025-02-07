# Include the headers directory
include_directories(${CMAKE_SOURCE_DIR}/recommendServer/headers)

# list all source files in the directory
set(
    SRC_FILES
    Add.cpp
    App.cpp
    ConsoleMenu.cpp
    FileDb.cpp
    Delete.cpp
    Help.cpp
    Server.cpp
    Recommend.cpp
    Post.cpp
    Patch.cpp
    Get.cpp
    SocketMenu.cpp
    # add more source files here when creating new classes
)

# Create a library from all the source files in the directory
add_library(netflix_p1 ${SRC_FILES})

# Create an executable from Server.cpp
add_executable(netflix Server.cpp)

# set the output directory of the executable
set_target_properties(netflix PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/")

# Link the executable with the library
target_link_libraries(netflix netflix_p1)