// ─────────────────────────────────────────────────────────────────────────────
// Standalone functions — defined outside Vue so they can be referenced
// by name in methods: { loginStaff, fetchMenu, ... } (Code 11 shorthand).
// When Vue calls these as methods, "this" refers to the Vue component instance,
// so this.menuItems, this.message, this.isLoggedIn, etc. all work correctly.
// ─────────────────────────────────────────────────────────────────────────────

async function loginStaff() {
    try {
        const response = await fetch(API_CONFIG.BASE_URL + "/login", {
            method: "POST",
            headers: publicHeaders(),       // from api.js: Content-Type only, no token
            body: JSON.stringify({
                username: this.login.username,
                password: this.login.password
            })
        });

        const result = await response.json();

        if (response.ok && result.token) {
            setToken(result.token);         // from api.js: saves token to localStorage
            this.isLoggedIn = true;
            this.message = "Login successful. Welcome, " + result.staff.username + "!";
        } else {
            this.message = result.message || "Invalid login.";
        }
    } catch (error) {
        this.message = "Unable to connect to server.";
        console.error(error);
    }
}

async function fetchMenu() {
    try {
        const response = await fetch(API_CONFIG.BASE_URL + "/menu");
        this.menuItems = await response.json();
    } catch (error) {
        this.message = "Failed to load menu data.";
        console.error(error);
    }
}

async function addMenu() {
    try {
        const response = await fetch(API_CONFIG.BASE_URL + "/menu", {
            method: "POST",
            headers: authHeaders(),         // from api.js: includes Authorization: Bearer <token>
            body: JSON.stringify(this.newMenu)
        });

        const result = await response.json();

        if (response.ok) {
            this.message = "Menu item added successfully.";
            this.newMenu = { menu_name: "", category: "", price: "", availability: "Available" };
            this.fetchMenu();
        } else {
            this.message = handleApiError(response, result);  // from api.js
        }
    } catch (error) {
        this.message = "Server connection error.";
        console.error(error);
    }
}

async function updateMenu(item) {
    try {
        const response = await fetch(API_CONFIG.BASE_URL + "/menu/" + item.menu_id, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(item)
        });

        const result = await response.json();

        if (response.ok) {
            this.message = "Menu item updated successfully.";
            this.editingItem = null;    // close the edit form after saving
            this.fetchMenu();
        } else {
            this.message = handleApiError(response, result);  // from api.js
        }
    } catch (error) {
        this.message = "Unable to update menu.";
        console.error(error);
    }
}

// Opens the inline edit form for a specific menu card.
// Spreads the item into a copy so the original card values don't change while typing.
function startEdit(item) {
    this.editingItem = { ...item };
}

// Closes the edit form without saving.
function cancelEdit() {
    this.editingItem = null;
}

async function deleteMenu(id) {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
        const response = await fetch(API_CONFIG.BASE_URL + "/menu/" + id, {
            method: "DELETE",
            headers: authHeaders()
        });

        const result = await response.json();

        if (response.ok) {
            this.message = "Menu item deleted successfully.";
            this.fetchMenu();
        } else {
            this.message = handleApiError(response, result);  // from api.js
        }
    } catch (error) {
        this.message = "Unable to delete menu.";
        console.error(error);
    }
}

function logout() {
    clearToken();               // from api.js: clears localStorage + authStore
    this.isLoggedIn = false;
    this.message = "";
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE 11: Suggested Vue Application Structure (Task A10)
// All data lives here. Methods reference the standalone functions above.
// ─────────────────────────────────────────────────────────────────────────────

const app = Vue.createApp({
    data() {
        return {
            menuItems: [],
            message: "",
            isLoggedIn: !!getToken(),   // true if token already exists in localStorage
            login: {
                username: "",
                password: ""
            },
            newMenu: {
                menu_name: "",
                category: "",
                price: "",
                availability: "Available"
            },
            editingItem: null       // holds a copy of the item currently being edited
        };
    },

    mounted() {
        this.fetchMenu();               // load public menu as soon as the page opens
    },

    methods: {
        loginStaff,
        fetchMenu,
        addMenu,
        updateMenu,
        deleteMenu,
        logout,
        startEdit,
        cancelEdit
    }
});

app.mount("#app");
