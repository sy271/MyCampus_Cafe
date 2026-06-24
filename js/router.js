// Each route maps a URL path to a component defined in the components/ folder.
const routes = [
    { path: "/",       component: MenuPage },       // public: anyone can view menu
    { path: "/login",  component: LoginPage },      // public: login form
    { path: "/admin",  component: AdminMenuPage }   // protected: add/delete menu items
];

// createWebHashHistory uses # in the URL (e.g. index.html#/login).
// This works without a web server rewrite rule, suitable for XAMPP CDN setup.
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});
