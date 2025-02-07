# EDY Netflix - Efrat, Dvir and Yehonatan
## Detailed run of the backend part of the project.

* This part is irrelevant for running the project along with the frontend.

* It has been used for an earlier stage of the project but we thought keeping this in since
  it contains more details about the program's backend execution. 

## How to run the program?
### For running with Docker:
```bash
docker-compose build
```
![alt text](<pictures/BUILD1_screenshot.png>)
![alt text](<pictures/BUILD2_screenshot.png>)
#### For running the tests:
```bash
docker-compose run tests
```
![alt text](<pictures/TESTS_screenshot.png>)

#### For running the NodeJS Server:
```bash
docker-compose up webserver
```

#### For cleaning the currently stored database information:
```bash
docker-compose run webserver node app.js --clear-db
```

#### For running the Recommendations Server with default port (8080):
```bash
docker compose run --name server server
```
![alt text](<pictures/SERVER_DEFAULT.png>)
#### For running the Recommendations Server with a custom port:
```bash
docker compose run --name server server <serverPort>
```
![alt text](<pictures/SERVER_screenshot.png>)
#### For running the Client:

##### If a port was inserted in the server command:

In order to run the client, the user must add as arguments the following:
```bash
docker-compose run client <serverIP> <serverPort>
```

In order to create a successful connection, the inserted values should be:
```bash
serverIP = "server"
serverPort = The port that was inserted in the server command.
```
![alt text](<pictures/ARG_CUSTOM.png>)
##### If no port was inserted in the server command:

```bash
serverIP = "server"
serverPort = 8080
```

Therefore, the input that should be inserted is:
```bash
docker-compose run client server 8080
```
![alt text](<pictures/ARG_screenshot.png>)

If the wrong IP is inserted, this will be the output:
![alt text](<pictures/WRONG_IP.png>)

If the wrong Port is inserted, this will be the output:
![alt text](<pictures/WRONG_PORT.png>)

If both the IP and Port are wrong, this will be the output:
![alt text](<pictures/BOTH_INVALID.png>)

If you (the client) want to disconnect from the server, press on your keyboard: "Ctrl + C".

## About our project
This application will recommend users on relevant movies, based on viewers data.

It supports the next commands:
Get: Using an input of a UserID and a MovieID, the client will recieve a recommendation on top relevant movies for him/her.
![alt text](<pictures/GET_screenshot.png>)

Post: After inserting a new userID and some movieIDs, the new user and it's movies will be saved in the database.
![alt text](<pictures/POST_screenshot.png>)

Patch: After inserting an existing userID and some movieIDs, the new movies will be saved in the database.
![alt text](<pictures/PATCH_screenshot.png>)

Help: Will display the optional commands with the order of parameters needed to be inserted. The commands will appear in alphabetical order (besides "help" which will appear in the end).
![alt text](<pictures/help_screenshot.png>)

Delete: After inserting an existing userID and some movieIDs, those movies will be deleted from the user's watch list.

![alt text](<pictures/DELETE_screenshot.png>)

Additionally, we created a client-server system that will enable few clients use the app at the same time.
### Code structure

The structure of our code fulfills loose coupling and SOLID principles.
The fact that the command names have changed barely required us to touch code parts that were supposed to be "closed for changes but open for extension".

We did have to split some functions in classes like Add, Recommand, and Help because they were too long and fulfilled too many roles, while we only needed a few of them. As a result, we split those functions into smaller ones with a single responsibility.

Also, the Recommand class needed a few changes we didn't predict, related to different types of errors. These little changes, we believe, will help us maintain the code better and ensure that we won't need to touch it next time.

The Help command from Part 1 directly outputs the help content without validating the input.
The current version adds input validation, ensuring only the exact "help" command is accepted.
If invalid input is detected, it throws an exception and responds with "400 Bad Request." This makes the second version more robust and reliable while maintaining dynamic command retrieval.

Moreover, the addition of new commands and changes in their output didn't require us to touch the former code, except in the points we described earlier.
We built new classes in which the content is mostly based on the former class's functionality (like wrappers). Of course, we added some new functionality to the new classes so they would support the new instructions.

Finally, the fact that the output/input comes from sockets instead of the console didn't force us to change a thing, and the loose coupling was perfect. In part 1, we created an IMenu interface to support every type of input/output platform. We only needed to implement IMenu to suit sockets.

In general, every command has its own class implementing it, and the class fulfills just the functionality related to it.
The commands are invoked by the App class, which runs the whole program.

It is worth mentioning that we used the ICommandable interface, which every command class implements, as part of invoking the command without having to use an explicit menu.

In addition, we have an IDatabase interface that enables us to replace our database (in this case, database.txt) with any database we want, as part of loose coupling principles. As a result, we have a File class (which also has a header, of course) that implements IDatabase.

Also, we have an IMenu interface, which is responsible for enabling multiple input and output platforms.

The Server follows loose coupling and SOLID principles to ensure clean, modular, and maintainable code. Each command (e.g., Help, Delete, Get, Post, Patch) is handled independently using interfaces and dependency injection, reducing dependencies between components. This allows the server to easily add new commands without modifying existing code, following the Open/Closed Principle. By keeping responsibilities separate and modular, the design ensures flexibility and scalability while maintaining a robust architecture.