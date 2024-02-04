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
      <div v-if="showPopup" class="popup">{{ popupMessage }}</div>
    </div>
  </div>
</template>

<script>
// Import Vue components and data
import { onMounted, onBeforeUnmount, ref, computed, reactive, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  setup() {
    const router = useRouter();
    const route = useRoute();
    const title = ref('Bookish');
    const books = reactive(booksData);
    const selectedBook = ref(booksData[0]);
    const selectedCategory = ref('All Books');
    const isCollapsed = ref(window.innerWidth < 700);
    const isFiltered = ref(false);
    const categories = ref(['All Books', 'Favourites', 'Read', 'Currently Reading', 'Unread', 'DNF', 'Fantasy', 'Classics', 'LGBT', 'Science Fiction', 'Non-Fiction', 'eBook', 'Audiobook', 'Paperback', 'Hardcover', 'Borrowed']);
    const showPopup = ref(false);
    const windowWidth = ref(window.innerWidth);
    const popupMessage = ref('');

    const contentMargin = computed(() => {
      return windowWidth.value < COLLAPSE_WIDTH ? '0' : (isCollapsed.value ? '0' : '280px');
    });

    const filteredBooks = computed(() => {
      if (selectedCategory.value === 'All Books') {
        return books; // Assuming books is reactive
      } else {
        return books.filter(book => book.categories.includes(selectedCategory.value));
      }
    });

    const handleResize = () => {
      windowWidth.value = window.innerWidth;
      isCollapsed.value = window.innerWidth < COLLAPSE_WIDTH;
    };
    // Add event listener to handle window resizes when component loads
    onMounted(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
    });
    // Remove event listener when component is destroyed
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });
    // Method handling category filtering when the user clicks on a category in the side panel
    const handleCategoryFilter = (category) => {
      isFiltered.value = category !== 'All Books';
      console.log(isFiltered.value);
      if (category === 'All Books') {
        filteredBooks.value = books;
      } else {
        filteredBooks.value = books.filter(book => book.categories.includes(category));
      }
      if (route.path !== '/') {
        router.push('/');
      }
    };
    // Method handling filter resetting to show all books when back button or header logo is clicked
    const handleResetFilter = () => {
      isFiltered.value = false;
      selectedCategory.value = 'All Books';
      handleCategoryFilter('All Books');
    };
    // Method that updates the category list when the user adds a new category
    const updateCategories = (newCategory) => {
      if (!categories.value.includes(newCategory)) {
        categories.value.push(newCategory);
      }
    };
    // Method that pushes book data submitted via new book form to the books array and shows a confirmation popup
    const addNewBook = (newBookData) => {
      console.log(newBookData);
      newBookData.id = `${Date.now()}`;
      books.push(newBookData);
      router.push('/');
      popupMessage.value = "Book added!";
      showPopup.value = true;
      setTimeout(() => {
        showPopup.value = false;
      }, POPUP_TIMEOUT);
    };

    const updateBook = (updatedBook) => {
      const index = books.findIndex(book => book.id === updatedBook.id);
      if (index !== -1) {
        books[index] = updatedBook;
      }
      popupMessage.value = "Book updated!";
      showPopup.value = true;
      setTimeout(() => {
        showPopup.value = false;
      }, POPUP_TIMEOUT);
    };

    provide('updateBook', updateBook);

    return { title, books, popupMessage, selectedBook, selectedCategory, isCollapsed, isFiltered, categories, filteredBooks, showPopup, windowWidth, contentMargin, handleCategoryFilter, handleResetFilter, updateCategories, addNewBook };
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
