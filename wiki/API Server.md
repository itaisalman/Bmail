# API Server

The server is built on Node.js and Express.js. It's responsible for handling the client's requests, and communicating with the database and the TCP server.

The server exposes it's functionality through a REST API. Here's a list of the API's endpoints:

## Endpoint Reference Table

| Endpoint                 | Method | Description                             |
| ------------------------ | ------ | --------------------------------------- |
| /api/users               | POST   | Create a new user                       |
| /api/users/user_id       | GET    | Get user by ID                          |
| /api/tokens              | POST   | Log in and receive authentication token |
| /api/mails               | POST   | Send a mail                             |
| /api/mails               | GET    | Get last 50 emails                      |
| /api/mails/mail_id       | GET    | Get email by ID                         |
| /api/mails/mail_id       | PATCH  | Edit an existing email by ID            |
| /api/mails/mail_id       | DELETE | Delete an existing email by ID          |
| /api/labels              | GET    | Get all labels                          |
| /api/labels              | POST   | Create a new label                      |
| /api/labels/label_id     | GET    | Get label by ID                         |
| /api/labels/label_id     | PATCH  | Edit a label by ID                      |
| /api/labels/label_id     | DELETE | Delete a label by ID                    |
| /api/blacklist           | POST   | Add a URL to the blacklist              |
| /api/blacklist           | DELETE | Remove a URL from the blacklist         |
| /api/mails/search/string | GET    | Search emails by string                 |
| /mail/:mail_id           | DELETE | Remove a mail from its assigned label   |
| /:mail_id/assign-label   | PATCH  | Assign a mail to a label                |

Most endpoints require the user to be authenticated. The authentication is done by sending the JWT token in the request's header.

## Server Architecture

The BMAIL server is structured according to the MVCS architecture, which extends the classic MVC pattern with an additional Service Layer.
This design promotes clean separation of concerns, modularity, and scalability.

### Model:

Represents the data schema and is responsible for direct interaction with the database (MongoDB).
Defines entities like User, Mail, Label, BlacklistItem. Implemented using Mongoose schemas.

### Controller

Handles incoming HTTP requests and orchestrates the logic.
Responsible for handling request/response objects and returning proper status codes and JSON.

### Service

Contains the core business logic of the application.
Services often call models to interact with the DB, and abstract complex operations from the controllers.

### Routes:

Defines the RESTful API endpoints.
Maps each route to a controller method.
Acts as the entry point for frontend or client requests.
