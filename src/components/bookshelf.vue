<template>
  <div class="bookshelf">
    <!-- Create book div for each book in array -->
    <div class='book' v-for="book in books" :key="book.id">
      <!-- Book cover acts as a link to the respective book's details page -->
      <router-link :to="`/book/${book.id}`">
        <div class='cover' :style="{ backgroundImage: 'url(/assets/covers/' + book.coverFront + ')' }"></div>
      </router-link>
    </div>
    <!-- Divider separates bookshelf from other instances of component -->
    <div class='shelfDivider'>
    </div>
  </div>
</template>
  
<script>

export default {
  props: {
    books: {
      type: Array,
      default: () => []
    }
  }
}

</script>
  
<style scoped>
/* Bookshelf set to fill entire width of page */
.bookshelf {
  width: 100%;
  background-repeat: no-repeat;
  background-size: auto;
  padding-top: 20px;
  margin: 0;
  font-size: 0;
}

/* Divider set to 25px high and fills entire width of page */
.shelfDivider {
  height: 25px;
  width: 100%;
  background-image: url('@/assets/shelf-divider.png');
  margin: 0;
}

/* Set styling for each book container to be evenly spaced in line */
.book {
  display: inline-flex;
  justify-content: center;
  align-items: flex-end;
  height: 200px;
  width: 12.50%;
  margin: 0;
  padding: 0;
}

.book:hover {
  transform: scale(0.9);
  cursor: pointer;
}

/* Set styling for book cover to fill book container */
.cover {
  width: 150px;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0;
  padding: 0;
}

/* Responsive styling to increase the width of each book container as the screen size reduces and less books are display on one bookshelf */
@media (max-width: 1750px) {
  .book {
    width: 14.28%;
  }
}

@media (max-width: 1500px) {
  .book {
    width: 16.66%;
  }
}

@media (max-width: 1250px) {
  .book {
    width: 25%;
  }
}

@media (max-width: 1000px) {
  .book {
    width: 33.33%;
  }
}

@media (max-width: 600px) {
  .book {
    width: 50%;
  }
}
</style>