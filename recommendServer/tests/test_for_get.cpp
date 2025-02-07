#include <gtest/gtest.h>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>
#include "../headers/Get.h"

using namespace std;

class GetTest : public ::testing::Test {
protected:
    unique_ptr<IMenu> menu;
    unique_ptr<Get> getHandler;
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector;
    
    void SetUp(){
        menu = nullptr;
        getHandler = make_unique<Get>(menu.get());
        string input = "1 104";
        dbvector = {
            {1, {100, 101, 102, 103}},
            {2, {101, 102, 104, 105, 106}},
            {3, {100, 104, 105, 107, 108}},
            {4, {101, 105, 106, 107, 109, 110}},
            {5, {100, 102, 103, 105, 108, 111}},
            {6, {100, 103, 104, 110, 111, 112, 113}},
            {7, {102, 105, 106, 107, 108, 109, 110}},
            {8, {101, 104, 105, 106, 109, 111, 114}},
            {9, {100, 103, 105, 107, 112, 113, 115}},
            {10, {100, 102, 105, 106, 107, 109, 110, 116}}
        };
    }
    void TearDown(){
    }
};
TEST_F(GetTest, LogicGet_SanityTest) {
    string input = "1 104";
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {100, 101, 102, 103}},
        {2, {101, 102, 104, 105, 106}},
        {3, {100, 104, 105, 107, 108}},
        {4, {101, 105, 106, 107, 109, 110}},
        {5, {100, 102, 103, 105, 108, 111}},
        {6, {100, 103, 104, 110, 111, 112, 113}},
        {7, {102, 105, 106, 107, 108, 109, 110}},
        {8, {101, 104, 105, 106, 109, 111, 114}},
        {9, {100, 103, 105, 107, 112, 113, 115}},
        {10, {100, 102, 105, 106, 107, 109, 110, 116}}};
    EXPECT_STREQ(getHandler->logicGet(input, dbvector).c_str(), "200 Ok\n\n105 106 111 110 112 113 107 108 109 114");
}
TEST_F(GetTest, LogicGet_NegativeTest){
    string input = "1 104";
    unordered_map<unsigned long int, vector<unsigned long int>> dbvector = {
        {1, {100, 101, 102, 103}},
        {2, {101, 102, 104, 105, 106}},
        {3, {100, 104, 105, 107, 108}},
        {4, {101, 105, 106, 107, 109, 110}},
        {5, {100, 102, 103, 105, 108, 111}},
        {6, {100, 103, 104, 110, 111, 112, 113}},
        {7, {102, 105, 106, 107, 108, 109, 110}},
        {8, {101, 104, 105, 106, 109, 111, 114}},
        {9, {100, 103, 105, 107, 112, 113, 115}},
        {10, {100, 102, 105, 106, 107, 109, 110, 116}}};
    EXPECT_STRNE(getHandler->logicGet(input, dbvector).c_str(), "404 Not Found");
}
