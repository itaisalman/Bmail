# Bmail

**Bmail** is a fullstack project that simulates an email platform with user authentication, email sending, label management, and malicious URL detection using a Bloom Filter server.
The system includes:

⚙️ A C++ multi-threaded Bloom Filter server

✅ A Node.js backend (MVC architecture)

🌐 A React frontend web application

### **Key Features**

- **User Management**

Register users with name, birth date, gender, username, password, and profile picture.
Login system using JWT stored in HttpOnly cookies.
Protected routes – only authenticated users can access the app.

- **Mail Management**

Send and recieve emails with fields: receiver, title, content.
Also supports: star, mark emails as important, mark as spam and move to trash functionalities.
Save and edit drafts, and delete.
Inbox, Sent, Spam, Drafts, Trash, Labels views with filterable content.

- **Label Management**

Create, update, delete user-defined labels.
Assign labels to mails.
Labels rendered dynamically in the sidebar.

- **Blacklist Filtering**

URLs in mail content are checked via a TCP socket with a C++ Bloom Filter server.
If an email that contains a blacklisted URL is sent, it will appear in Spam section instead of in the Inbox.
Add/delete blacklist entries by adding or removing emails from Spam.
Node.js acts as a client to the C++ backend.

- **UI Features (React)**

Gmail-inspired interface using React + React Router.
Responsive sidebar and topbar navigation.
Live search with dynamic results.
Dark/Light mode toggle using context.

# Project Structure

```text
BMAIL/
|
├── client_side/
|  ├── public/
|  |  ├── favicon.jpg
|  |  ├── index.html
|  |  └── manifest.json
|  ├── src/
|  |  ├── components/
|  |  |  ├── ButtonMailComposer/
|  |  |  │  └── ButtonMailComposer.js
|  |  |  ├── Draft/
|  |  |  │  ├── Draft.css
|  |  |  │  └── Draft.js
|  |  |  ├── DraftMailComposer/
|  |  |  │  └── DraftMailComposer.js
|  |  |  ├── Important/
|  |  |  │  └── Important.js
|  |  |  ├── Inbox/
|  |  |  │  ├── Inbox.css
|  |  |  │  └── Inbox.js
|  |  |  ├── Labels/
|  |  |  │  ├── apiLabels.js
|  |  |  │  ├── LabelDelete.js
|  |  |  │  ├── LabelEditor.js
|  |  |  │  ├── LabelItem.js
|  |  |  │  ├── Labels.css
|  |  |  │  ├── Labels.js
|  |  |  │  └── LabelView.js
|  |  |  ├── LiveSearchResult/
|  |  |  │  ├── LiveSearchResult.css
|  |  |  │  └── LiveSearchResult.js
|  |  |  ├── MailComposer/
|  |  |  │  ├── MailComposer.css
|  |  |  │  └── MailComposer.js
|  |  |  ├── MailList/
|  |  |  │  ├── MailList.css
|  |  |  │  └── MailList.js
|  |  |  ├── MailsControl/
|  |  |  │  ├── MailsControl.css
|  |  |  │  └── MailsControl.js
|  |  |  ├── ProtectedRoute
|  |  |  │  └── ProtectedRoute.js
|  |  |  ├── SearchResult/
|  |  |  |  ├── SearchResult.css
|  |  |  |  └── SearchResult.js
|  |  |  ├── Sent/
|  |  |  |  └── Sent.js
|  |  |  ├── Sidebar/
|  |  |  |  ├── Sidebar.css
|  |  |  |  └── Sidebar.js
|  |  |  ├── Spam/
|  |  |  |  └── Spam.js
|  |  |  ├── Star/
|  |  |  |  └── Star.js
|  |  |  ├── Topbar/
|  |  |  |  ├── Topbar.css
|  |  |  |  └── Topbar.js
|  |  |  ├── Trash/
|  |  |  |  └── Trash.js
|  |  |  ├── ViewMail/
|  |  |  |  ├── ViewMail.css
|  |  |  |  └── ViewMail.js
|  |  |  ├── ViewResult/
|  |  |  └── └── ViewResult.js
|  |  ├── pages/
|  |  |  ├── HomeScreen.css
|  |  |  ├── HomeScreen.js
|  |  |  ├── LoginScreen.css
|  |  |  ├── LoginScreen.js
|  |  |  ├── MainScreen.css
|  |  |  └── MainScreen.js
|  |  |  ├── SignupScreen.css
|  |  |  └── SignupScreen.js
|  |  ├── App.js
|  |  ├── App.test.js
|  |  ├── index.css
|  |  ├── index.js
|  |  ├── logo.jpg
|  |  ├── reportWebVitals.js
|  |  ├── setupTests.js
|  |  └── ThemeContext.js
|  ├── .gitignore
|  ├── Dockerfile.react
|  ├── package-lock.json
|  └── package.json
├── config/
|  └── .env
├── data/
|  ├── upload/
|  |  ├── default_female.png
|  |  └── default_male.jpeg
|  └── Blacklist.txt
├── photos/
|  └── *.jpg
├── src/
|  ├── controllers/
|  |  ├── blacklist.js
|  |  ├── labels.js
|  |  ├── mails.js
|  |  ├── tokens.js
|  |  └── users.js
|  ├── middleware/
|  |  └── auth.js
|  ├── models/
|  |  ├── blacklist.js
|  |  ├── labels.js
|  |  ├── mails.js
|  |  ├── tokens.js
|  |  └── users.js
|  ├── routes/
|  |  ├── blacklist.js
|  |  ├── labels.js
|  |  ├── mails.js
|  |  ├── tokens.js
|  |  └── users.js
|  ├── Add.cpp
|  ├── Add.h
|  ├── app.js
|  ├── BloomFilter.cpp
|  ├── BloomFilter.h
|  ├── Check.cpp
|  ├── Check.h
|  ├── Client.py
|  ├── Command.h
|  ├── Delete.cpp
|  ├── Delete.h
|  ├── functions-test.cpp
|  ├── Input.cpp
|  ├── Input.h
|  ├── server-tests.cpp
|  ├── Server.cpp
|  ├── Storage.cpp
|  └── Storage.h
├── .gitignore
├── CMakeLists.txt
├── docker-compose.yml
├── DockerFile
├── DockerFile.node
├── package-lock.json
├── package.json
└── README.md
```

## Folder Overview

The project is organized into the following main parts:

src/ – Node.js backend, built in an MVC pattern:
routes/: define REST API endpoints
controllers/: handle logic and response formatting
models/: manage in-memory data and validation
middleware/: includes JWT authentication logic

client_side/ – React-based frontend application:
components/: reusable UI components such as Sidebar, MailList, ViewMail
pages/: screen-level views like Login, Signup, Main (Inbox)

C++ sources – Multi-threaded Bloom Filter server:
Server.cpp, BloomFilter.cpp/.h, Input.cpp, etc.

data/ – Persistent files:
Blacklist.txt: list of blocked URLs
upload/: uploaded user profile images

# Executing The Program

To start the system, simply run:

```bash
docker compose up --build
```

This command will launch three containers:

cpp-server runs on internal port 8080 and is exposed on port 8081. It handles all Bloom Filter logic and receives TCP requests from the Node.js backend for URL checks.

node-client runs on port 3000 and serves as the REST API server for handling users, mails, labels, authentication, and blacklist logic.

react-app runs the React frontend. It starts on internal port 3000, but is exposed on your machine through port 5174. The app communicates with the backend API through HTTP.

Once the system is up and running, you can open your browser and access the following:

The React frontend: http://localhost:5174
Note: The React app proxies API requests internally to port 3000 to communicate with the Node.js backend.

## Installation

Clone the repository:

```bash
git clone - https://github.com/itaisalman/Bmail
```

## Authors

[Itai Salman](https://github.com/itaisalman)
[Omer Golan](https://github.com/Omergolan11)
[Shachar Ganon](https://github.com/ShacharGanon)

## Screenshots Exampels

### Build:

here will be image of building

### Runs:

here will be images of program flow
