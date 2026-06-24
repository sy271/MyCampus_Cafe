const LoginPage = {
    data() {
        return {
            // These match the v-model bindings in Code 4's form fields.
            login: {
                username: '',
                password: ''
            },
            // Controls whether the login form or a success message is shown.
            isLoggedIn: false,
            // Displayed below the form to show success or error feedback.
            message: ''
        };
    },

    methods: {
        // CODE 3: Login Request from Vue to PHP Slim.
        // Sends username and password to POST /api/login.
        // On success, saves the token using setToken() from api.js.
        async loginStaff() {
            try {
                const response = await fetch(API_CONFIG.BASE_URL + "/login", {
                    method: "POST",
                    headers: publicHeaders(),         // from api.js: { "Content-Type": "application/json" }
                    body: JSON.stringify({
                        username: this.login.username,
                        password: this.login.password
                    })
                });

                const result = await response.json();

                if (response.ok && result.token) {
                    setToken(result.token);           // from api.js: saves token to localStorage + updates authStore
                    this.message = "Login successful.";
                    this.$router.push("/admin");      // navigate to admin panel after login
                } else {
                    this.message = result.message || "Invalid login.";
                }
            } catch (error) {
                this.message = "Unable to connect to server.";
                console.error(error);
            }
        }
    },

    // CODE 4: Login Form HTML.
    // @submit.prevent stops the default browser form submission and calls loginStaff() instead.
    // v-model="login.username" and v-model="login.password" bind inputs to data() above.
    template: `
        <div>
            <h2>Staff Login</h2>

            <form @submit.prevent="loginStaff">
                <input v-model="login.username" placeholder="Username" required><br><br>
                <input v-model="login.password" type="password" placeholder="Password" required><br><br>
                <button type="submit">Login</button>
            </form>

            <p>{{ message }}</p>
        </div>
    `
};
