// AdminMenuPage component: PROTECTED — only accessible after staff login.
const AdminMenuPage = {
    data() {
        return {
            // Bound to the add menu form fields via v-model.
            newMenu: {
                menu_name: "",
                category: "",
                price: "",
                availability: "Available"
            },
            message: ''
        };
    },

    methods: {
        // CODE 8: Protected POST Request.
        // Uses authHeaders() from api.js which adds: Authorization: Bearer <token>
        // The backend $jwtMiddleware checks this header before allowing the insert.
        async addMenu() {
            try {
                const response = await fetch(API_CONFIG.BASE_URL + "/menu", {
                    method: "POST",
                    headers: authHeaders(),           // from api.js: includes the JWT token
                    body: JSON.stringify(this.newMenu)
                });

                const result = await response.json();

                if (response.ok) {
                    this.message = "Menu item added successfully.";
                    // Reset all form fields back to empty after a successful add.
                    this.newMenu = {
                        menu_name: "",
                        category: "",
                        price: "",
                        availability: "Available"
                    };
                } else {
                    this.message = result.message || "Add menu failed.";
                }
            } catch (error) {
                this.message = "Server connection error.";
                console.error(error);
            }
        },

        async updateMenu(item) { 
            try { 
                const response = await fetch(API_CONFIG.BASE_URL + "/menu/" + item.menu_id, { 
                    method: "PUT", 
                    headers: authHeaders(), 
                    body: JSON.stringify(item) 
                }); 
          
                const result = await response.json(); 
          
                if (response.ok) { 
                    this.message = "Menu item updated successfully."; 
                    this.fetchMenu(); 
                } else { 
                    this.message = result.message || "Update failed."; 
                } 
            } catch (error) { 
                this.message = "Unable to update menu."; 
                console.error(error); 
            } 
        },

        async deleteMenu(id) { 
            if (!confirm("Are you sure you want to delete this menu item?")) { 
                return; 
            } 
          
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
                    this.message = result.message || "Delete failed."; 
                } 
            } catch (error) { 
                this.message = "Unable to delete menu."; 
                console.error(error); 
            } 
        } 

    },

    template: `
        <div>
            <h2>Add New Menu Item</h2>

            <label>Menu Name:</label><br>
            <input v-model="newMenu.menu_name" placeholder="e.g. Nasi Lemak" required><br><br>

            <label>Category:</label><br>
            <input v-model="newMenu.category" placeholder="e.g. Main Course" required><br><br>

            <label>Price (RM):</label><br>
            <input v-model="newMenu.price" type="number" step="0.01" placeholder="e.g. 7.50" required><br><br>

            <label>Availability:</label><br>
            <select v-model="newMenu.availability">
                <option>Available</option>
                <option>Unavailable</option>
            </select><br><br>

            <button @click="addMenu">Add Menu Item</button>
            <p v-if="message">{{ message }}</p>
        </div>
    `
};
