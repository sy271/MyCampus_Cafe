// ── TASK C1: Development vs Production API URL ────────────────────────────────
// To switch to production, comment out the development URL and
// uncomment the production URL. All fetch() calls use API_CONFIG.BASE_URL
// so only this one line needs to change for the whole frontend.

// Development API URL (used while running on XAMPP locally)
const API_CONFIG = {
    BASE_URL: "http://localhost/lab-acitivity-10-sy271/mycampus-cafe-slim-api/public/api"
};

// Production API URL (uncomment this and comment out the one above when deploying)
// const API_CONFIG = {
//     BASE_URL: "https://your-backend-domain.infinityfreeapp.com/api"
// };
// ─────────────────────────────────────────────────────────────────────────────

// Shared reactive state — updates nav bar automatically on login/logout.
const authStore = Vue.reactive({
    token: localStorage.getItem("mycampus_token") || ""
});

function getToken() {
    return authStore.token;
}

function setToken(token) {
    localStorage.setItem("mycampus_token", token);
    authStore.token = token;
}

function clearToken() {
    localStorage.removeItem("mycampus_token");
    authStore.token = "";
}

// Used for protected routes: includes Authorization: Bearer <token>
function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

// Used for public routes like login: no token needed
function publicHeaders() {
    return {
        "Content-Type": "application/json"
    };
}

// ── TASK C2: Basic API Error Handling Helper ──────────────────────────────────
// Called instead of result.message so users see a clear message for each
// HTTP status code rather than a raw server error or a blank screen.
function handleApiError(response, result) {
    if (response.status === 401) {
        return "Unauthorized access. Please login again.";
    }
    if (response.status === 403) {
        return "You are not allowed to perform this operation.";
    }
    if (response.status === 404) {
        return "Requested record was not found.";
    }
    if (response.status >= 500) {
        return "Server error. Please contact administrator.";
    }
    return result.message || "Unexpected error occurred.";
}
