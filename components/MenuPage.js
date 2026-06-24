// MenuPage component: PUBLIC — no login required to view menu items.
const MenuPage = {
    data() {
        return {
            menuItems: [],
            message: ''
        };
    },

    methods: {
        // CODE 6: Fetch Public Menu Data.
        // No token needed — GET /api/menu is a public route on the backend.
        // publicHeaders() is not used here because GET requests don't need Content-Type.
        async fetchMenu() {
            try {
                const response = await fetch(API_CONFIG.BASE_URL + "/menu");
                this.menuItems = await response.json();
            } catch (error) {
                this.message = "Failed to load menu data.";
                console.error(error);
            }
        }
    },

    // mounted() runs automatically when this component is rendered.
    // Calls fetchMenu() immediately so the list appears without needing a button click.
    mounted() {
        this.fetchMenu();
    },

    // CODE 7: Menu Display.
    // v-for loops over each item in menuItems and renders a card.
    // :key="item.menu_id" helps Vue track each card efficiently when the list updates.
    template: `
        <div>
            <h2>Menu List</h2>
            <p v-if="message">{{ message }}</p>
            <p v-if="menuItems.length === 0">No menu items found.</p>
            <div v-for="item in menuItems" :key="item.menu_id" class="menu-card">
                <h3>{{ item.menu_name }}</h3>
                <p>Category: {{ item.category }}</p>
                <p>Price: RM {{ item.price }}</p>
                <p>Status: {{ item.availability }}</p>
            </div>
        </div>
    `
};
