// Import Vue and necessary components/data
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Homepage from './components/homepage.vue';
import BookDetails from './components/book-details.vue';
import BookForm from './components/book-form.vue';
import booksData from '../public/books.json';

// Define Vue app routes - each route is mapped to a component and receives specific props
const routes = [
  { path: '/', component: Homepage, props: { books: booksData } },
  { path: '/book/:id', component: BookDetails, props: { books: booksData } },
  { path: '/new', component: BookForm, props: { mode: 'add' } },
  {
    path: '/edit/:id',
    component: BookForm,
    // Modify this line to include booksData in the props
    props: (route) => ({ mode: 'edit', bookId: route.params.id, books: booksData }),
  },
];

// Create VueRouter instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Define scroll behaviour to snap to top of page when view changes
  scrollBehavior() {
    document.getElementById('app').scrollIntoView();
  }
})

// Create new Vue instance to render App.vue and assign routing
const app = createApp(App);
app.use(router);
app.mount('#app');