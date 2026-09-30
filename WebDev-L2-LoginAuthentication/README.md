# Login Authentication System

A frontend-only login authentication system built using HTML5, CSS3, and Vanilla JavaScript.

## Features

- User registration with username, email, password, and confirm password
- Password validation with a minimum of 8 characters and at least 1 number
- Duplicate username and email detection
- Login using username or email
- Generic error message for incorrect credentials
- Protected dashboard for authenticated users
- Logout functionality
- SHA-256 password hashing
- Basic form validation
- Responsive layout for desktop and mobile screens
- User data stored using browser localStorage
- Login session handled using sessionStorage

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage
- Browser SessionStorage
- Web Crypto API

## Project Structure

```text
WebDev-L2-LoginAuthentication/
├── index.html
├── register.html
├── dashboard.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── registration-success.png
    ├── password-validation.png
    ├── duplicate-username.png
    ├── duplicate-email.png
    ├── login-success.png
    ├── invalid-login.png
    └── protected-dashboard.png
```

## How to Run

1. Open the project folder.
2. Open `register.html` in a web browser.
3. Create a new account using a valid username, email, and password.
4. After registration, go to the login page.
5. Enter the registered username or email and password.
6. Click `Login` to access the dashboard.
7. Use the `Logout` button to end the current session.

## Password Security

Passwords are converted into SHA-256 hashes before being stored in the browser's localStorage.

This project is designed as a frontend-only internship project for learning purposes and is not intended to replace a production authentication system.

## Data Storage

Registered user information is stored in browser localStorage.

The authenticated user's session is stored in sessionStorage and is cleared when the user logs out.

## Task

This project was created as part of the Oasis Infobyte Web Development & Designing internship, Level 2 Login Authentication System task.

## Author

Uttam Kumar