#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <vector>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>
#include <iostream>

using namespace std;

class ThreadPool {
private:
    vector<thread> workers;
    queue<function<void()>> tasks;
    mutex queueMutex;
    condition_variable condition;
    atomic<bool> stop;

public:
    explicit ThreadPool(size_t threads);
    ~ThreadPool();

    void enqueue(function<void()> task);
};

ThreadPool::ThreadPool(size_t threads) : stop(false) {
    for (size_t i = 0; i < threads; ++i) {
        workers.emplace_back([this]() {
            while (true) {
                function<void()> task;

                {
                    unique_lock<mutex> lock(this->queueMutex);
                    this->condition.wait(lock, [this] { return this->stop || !this->tasks.empty(); });

                    if (this->stop && this->tasks.empty())
                        return;

                    task = move(this->tasks.front());
                    this->tasks.pop();
                }

                task();
            }
        });
    }
}

ThreadPool::~ThreadPool() {
    stop = true;
    condition.notify_all();
    for (thread &worker : workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}

void ThreadPool::enqueue(function<void()> task) {
    {
        lock_guard<mutex> lock(queueMutex);
        tasks.push(move(task));
    }
    condition.notify_one();
}

#endif
