const USERS_KEY = "oibsip_auth_users";
const SESSION_KEY = "oibsip_current_user";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
    const encodedPassword = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function setMessage(element, message) {
    if (element) {
        element.textContent = message;
    }
}

function isValidPassword(password) {
    return password.length >= 8 && /\d/.test(password);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");

    errorElements.forEach((element) => {
        element.textContent = "";
    });
}

function storeSession(user) {
    const sessionData = {
        username: user.username,
        email: user.email
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function getSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
}

function redirectToDashboard() {
    window.location.href = "dashboard.html";
}

function redirectToLogin() {
    window.location.href = "index.html";
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        const usernameInput = document.getElementById("registerUsername");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmPasswordInput =
            document.getElementById("confirmPassword");
        const registerMessage =
            document.getElementById("registerMessage");

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let hasError = false;

        if (username === "") {
            showError("usernameError", "Username is required.");
            hasError = true;
        }

        if (email === "") {
            showError("emailError", "Email is required.");
            hasError = true;
        } else if (!isValidEmail(email)) {
            showError("emailError", "Enter a valid email address.");
            hasError = true;
        }

        if (password === "") {
            showError("passwordError", "Password is required.");
            hasError = true;
        } else if (!isValidPassword(password)) {
            showError(
                "passwordError",
                "Password must be at least 8 characters and include 1 number."
            );
            hasError = true;
        }

        if (confirmPassword === "") {
            showError(
                "confirmPasswordError",
                "Please confirm your password."
            );
            hasError = true;
        } else if (password !== confirmPassword) {
            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const users = getUsers();

        const usernameExists = users.some(
            (user) => user.username.toLowerCase() === username.toLowerCase()
        );

        const emailExists = users.some(
            (user) => user.email.toLowerCase() === email
        );

        if (usernameExists) {
            showError("usernameError", "Username already exists.");
            return;
        }

        if (emailExists) {
            showError("emailError", "Email already exists.");
            return;
        }

        const passwordHash = await hashPassword(password);

        const newUser = {
            id: Date.now(),
            username,
            email,
            passwordHash
        };

        users.push(newUser);
        saveUsers(users);

        setMessage(
            registerMessage,
            "Account created successfully. Redirecting to login..."
        );

        registerForm.reset();

        setTimeout(() => {
            redirectToLogin();
        }, 5000);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        const identifierInput =
            document.getElementById("loginIdentifier");
        const passwordInput =
            document.getElementById("loginPassword");
        const loginMessage =
            document.getElementById("loginMessage");

        const identifier = identifierInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let hasError = false;

        if (identifier === "") {
            showError(
                "loginIdentifierError",
                "Username or email is required."
            );
            hasError = true;
        }

        if (password === "") {
            showError("loginPasswordError", "Password is required.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const users = getUsers();

        const user = users.find(
            (currentUser) =>
                currentUser.username.toLowerCase() === identifier ||
                currentUser.email.toLowerCase() === identifier
        );

        if (!user) {
            setMessage(loginMessage, "Invalid username/email or password.");
            return;
        }

        const enteredPasswordHash = await hashPassword(password);

        if (enteredPasswordHash !== user.passwordHash) {
            setMessage(loginMessage, "Invalid username/email or password.");
            return;
        }

        storeSession(user);
        redirectToDashboard();
    });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    const session = getSession();

    if (!session) {
        redirectToLogin();
    } else {
        const usernameElement =
            document.getElementById("dashboardUsername");
        const emailElement =
            document.getElementById("dashboardEmail");
        const welcomeMessage =
            document.getElementById("welcomeMessage");

        if (usernameElement) {
            usernameElement.textContent = session.username;
        }

        if (emailElement) {
            emailElement.textContent = session.email;
        }

        if (welcomeMessage) {
            welcomeMessage.textContent =
                `Welcome, ${session.username}! You have successfully logged in.`;
        }
    }

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        redirectToLogin();
    });
}