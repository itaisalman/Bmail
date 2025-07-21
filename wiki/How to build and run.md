# How to build and run?

### Getting Started

The BMAIL system includes multiple components:

- A TCP server for URL filtering using a Bloom Filter
- An API server (Node.js + MongoDB)
- A Web client (React)
- An Android client (native app)

All components are containerized and can be run easily using Docker Compose.

## Build and run

Installation
Clone the repository and checkout to branch 'main 5' :

<pre> git clone https://github.com/itaisalman/Bmail.git </pre>

To build and run the entire system:

 <pre>docker-compose up --build </pre>

Make sure Docker is installed and running on your machine.

## Accessing the Web Client

Once Docker is running, open your browser and go to:

<pre> http://localhost:5174/ </pre>

From there, you can: Register or log in, compose and send emails, manage drafts and labels, filter by importance or starred, search and assign labels to emails and more.

## Running the Android Client

Open the Android project in Android Studio.

Run the app on an emulator or physical device.

The app connects automatically to the backend at http://10.0.2.2:3000.

You can perform all actions like registration, login, sending emails, managing labels, and more — directly from your Android device.
