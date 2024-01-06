<template>
  <div class="bookCover">
    <!-- Transition container for book cover image -->
    <transition name="fade">
      <!-- Image element bound to the current book's cover -->
      <img :src='currentCover' :key="currentCover" id='coverImg' alt="Book Cover">
    </transition>
    <!-- Arrows for changing cover, displayed only if back cover exists -->
    <div class='arrow' v-if="hasBackCover">
      <img class='arrow arrow-l' src="../assets/arrow-l.png" @click="switchCover">
      <img class='arrow arrow-r' src="../assets/arrow-r.png" @click="switchCover">
    </div>
  </div>
</template>
  
<script>

export default {
  // Pass through book's front and back cover from books array
  props: {
    coverFront: {
      type: String,
      default: ''
    },
    coverBack: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // Initialise currentCover with the book's front cover
      currentCover: this.coverFront
    }
  },
  computed: {
    // Check if back cover image exists in the current book object
    hasBackCover() {
      return this.coverBack && this.coverBack.trim().length > 0;
    }
  },
  methods: {
    // Switch cover between front and back
    switchCover() {
      this.currentCover = this.currentCover === this.coverFront ? this.coverBack: this.coverFront;
    }
  }
}

</script>
  
<style scoped>
/* Set height and width of the component */
.bookCover {
  position: relative;
  height: 400px;
  width: 250px;
  margin: 2em;
  user-select: none;
}

/* Fill component with cover image and add drop shadow */
#coverImg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

/* Position and size the arrows */
.arrow-l, .arrow-r {
  position: absolute;
  top: 105%; 
  max-width: 50px;
  max-height: 40px;
  cursor: pointer;
  user-select: none;
}

.arrow-l {
  left: 10px;
}

.arrow-r {
  right: 10px;
}

/* Animation for arrow when hovered over */
img.arrow:hover {
  transform: scale(1.2);
}

/* Transition for the book cover change */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>