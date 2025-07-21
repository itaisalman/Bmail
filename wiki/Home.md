# Bmail – Email Client & Server System

Bmail is a full-stack email application that supports user registration, login, sending and receiving emails, and advanced label management. BMAIL delivers a 360-degree experience, offering users full control and accessibility across web, Android, and server-side – all in a unified, user-friendly ecosystem. The system includes a backend server, a web client, and an Android application, all running together via Docker Compose. This WIKI provides an overview of the project, installation instructions, and details about its components.

## Application Security

In order to ensure the security of the BMAIL system, we integrated a Bloom Filter-based blacklist mechanism.
Every time a user attempts to send an email containing a link, the system checks whether the link is malicious or blacklisted. If the URL exists in the Bloom Filter, the email will be sent directly to spam.

## Components

Backend Server (Node.js + MongoDB): Handles authentication, email logic, label management, and communication with the Bloom Filter.

Web Client (React): User-friendly interface for email creation, inbox management, and label assignment.

Android App (Java): Native mobile experience with similar capabilities: login, inbox, labels, and more.

Docker Compose: Used to run the entire environment locally with a single command.
