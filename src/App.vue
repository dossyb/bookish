<template>
  <!-- Main container for the application -->
  <div id="app">
    <div id="content">
      <!-- App header component including bindings for the side panel's collapse state, currently selected category, and whether categories are being filtered -->
      <app-header v-bind="{ isCollapsed, selectedCategory, isFiltered }" :style="{ 'margin-right': contentMargin }"
        @reset-filter="handleResetFilter" />
        <!-- Side panel component including bindings for the category list, collapse state, and the currently selected category -->
      <side-panel v-bind="{ categories, isCollapsed, selectedCategory }" @update:categories="updateCategories"
        @update:isCollapsed="isCollapsed = $event" @update:selectedCategory="selectedCategory = $event"
        @filter-category="handleCategoryFilter" />
        <!-- Router view displaying the component for the current route -->
      <router-view :filtered-books="filteredBooks" :style="{ 'margin-right': contentMargin }" @add-book="addNewBook" />
      <!-- App footer component -->
      <app-footer :style="{ 'margin-right': contentMargin }" />
      <!-- Popup notification for when a new book is added -->
      <div v-if="showPopup" class="popup">Book added!</div>
    </div>
  </div>
</template>

<script>
// Import Vue components and data
import AppHeader from './components/app-header.vue'
import AppFooter from './components/app-footer.vue'
import SidePanel from './components/side-panel.vue'
import booksData from '../public/books.json'

// Constants for the screen width that the side panel automatically collapses at and the popup timeout duration
const COLLAPSE_WIDTH = 700;
const POPUP_TIMEOUT = 5000;

export default {
  // Register components used in the templates
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter,
    'side-panel': SidePanel,
  },
  data() {
    return {
      title: 'Bookish',
      books: booksData,
      selectedBook: booksData[0],
      selectedCategory: 'All Books',
      isCollapsed: window.innerWidth < 700,
      isFiltered: false,
      categories: ['All Books', 'Favourites', 'Read', 'Currently Reading', 'Unread', 'DNF', 'Fantasy', 'Classics', 'LGBT', 'Science Fiction', 'Non-Fiction', 'eBook', 'Audiobook', 'Paperback', 'Hardcover', 'Borrowed'],
      filteredBooks: booksData,
      showPopup: false,
      windowWidth: window.innerWidth,
    }
  },
  // Add event listener to handle window resizes when component loads
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  // Remove event listener when component is destroyed
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  // Computed property that handles dynamic content margin based on the width of the user's window
  computed: {
    contentMargin() {
      return this.windowWidth < COLLAPSE_WIDTH ? '0' : (this.isCollapsed ? '0' : '280px');
    }
  },
  props: {
    book: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // Method handling category filtering when the user clicks on a category in the side panel
    handleCategoryFilter(category) {
      this.isFiltered = category !== 'All Books';
      if (category === 'All Books') {
        this.filteredBooks = this.books;
      } else {
        this.filteredBooks = this.books.filter(book => book.categories.includes(category));
      }
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    // Method handling filter resetting to show all books when back button or header logo is clicked
    handleResetFilter() {
      this.isFiltered = false;
      this.selectedCategory = 'All Books';
      this.handleCategoryFilter('All Books');
    },
    // Method handling the window resizing
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.isCollapsed = window.innerWidth < COLLAPSE_WIDTH;
    },
    // Method that updates the category list when the user adds a new category
    updateCategories(newCategory) {
      if (!this.categories.includes(newCategory)) {
        this.categories.push(newCategory);
      }
    },
    // Method that pushes book data submitted via new book form to the books array and shows a confirmation popup
    addNewBook(newBookData) {
      newBookData.id = `${Date.now()}`;
      this.books.push(newBookData);
      this.$router.push('/');
      this.showPopup = true;
      setTimeout(() => {
        this.showPopup = false;
      }, POPUP_TIMEOUT);
    }
  }
}
</script>

<style>
/* Global styling for the html and body */
html,
body {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
  background-color: #ffefd5;
}

/* Main app container's styling defining font and sizing */
#app {
  width: 100%;
  height: 100%;
  font-family: 'Arial';
}

#content {
  flex: 1;
}

#footer {
  text-align: center;
  padding: 20px;
  background-color: #ffefd5;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffefd5;
  padding: 40px;
  font-size: 36px;
  border: 1px solid #000;
  z-index: 1000;
  animation: fadeOut 5s forwards;
}

/* Keyframes for the popup notification fadeOut animation */
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
