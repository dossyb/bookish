<template>
  <!-- Container for the side panel with a dynamic class and style -->
  <div id="panelContainer" :class="{ collapsed: isCollapsed }" :style="panelStyle">
    <!-- Tab for collapsing/expanding side panel with a click event -->
    <div id="collapseTab" v-on:click="togglePanel">
      <!-- Icon for expanding/collapsing displayed on default laptop view -->
      <span class="icon-default" v-html="defaultIcon"></span>
      <!-- Icon for expanding/collapsing displayed on mobile -->
      <span class="icon-mobile" v-html="mobileIcon"></span>
    </div>
    <!-- Container for side panel's content -->
    <div id="sidePanel">
      <!-- Table displaying bookshelf categories -->
      <table>
        <thead>
          <tr>
            <th>Your Bookshelves</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamically rendered rows for each bookshelf category -->
          <tr v-for="(category, index) in categories" :key="index" @click="filterByCategory(category)"
            :class="{ selected: selectedCategory === category }">
            <td>{{ category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Input area for adding a new bookshelf -->
    <div id="addNewShelf">
      <!-- Input field for new bookshelf name -->
      <input type='text' placeholder='Add new bookshelf...' class='newBookshelf' v-model="newBookshelf"
        @keyup.enter="addBookshelf">
        <!-- Submit button for new bookshelf -->
      <img src='https://simpleicon.com/wp-content/uploads/plus.svg' v-on:click="addBookshelf">
    </div>
  </div>
</template>
  
<script>

export default {
  props: {
    // Prop to receive Boolean value from App.vue which determines styling of panel
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    // Props to receive the current list of categories and which category is currently selected
    categories: Array,
    selectedCategory: String,
  },
  data() {
    return {
      // Temporary storage for new bookshelf name added by user
      newBookshelf: ''
    }
  },
  computed: {
    // Computed style to determine the panel's position
    panelStyle() {
      return { right: this.isCollapsed ? '-300px' : '0' };
    },
    // Computed property to determine collapse tab icon's HTML content on mobile
    mobileIcon() {
      return this.isCollapsed ? '&#9776;' : '&#10005;';
    },
    // Computed property to determine collapse tab icon's HTML content on bigger screens
    defaultIcon() {
      return this.isCollapsed ? '&#10094;' : '&#10095;';
    }
  },
  methods: {
    // Method to toggle the side panel's collapsed state
    togglePanel() {
      this.$emit('update:isCollapsed', !this.isCollapsed);
    },
    // Method to add a new bookshelf to the categories array
    addBookshelf() {
      const newCategory = this.newBookshelf.trim();
      if (newCategory) {
        this.$emit('update:categories', newCategory);
        this.newBookshelf = '';
      }
    },
    // Method to emit the filtered category to the parent component when the bookshelf is clicked
    filterByCategory(category) {
      this.$emit('update:selectedCategory', category);
      this.$emit('filter-category', category);
    }
  }
}
</script>
  
<style scoped>
/* Set panel to be fixed relative to viewport along right edge and occupy full height of viewport */
#panelContainer {
  position: fixed;
  right: 0;
  width: 300px;
  top: 50%;
  transform: translateY(-50%);
  transition: right 0.5s ease;
  height: 100%;
  z-index: 1;
  background-color: #d1d1d1;
}

/* Side panel content absolutely positioned within container and set to allow scrolling for overflown content */
#sidePanel {
  position: absolute;
  right: 0;
  width: 100%;
  background-color: #d1d1d1;
  height: 100%;
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

/* Collapse tab absolutely positioned within the container and styled appropriately */
#collapseTab {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 100px;
  background-color: #e98953;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.1s ease;
}

/* Change background color of tab when hovered over */
#collapseTab:hover {
  background-color: #cb7f50;
}

/* Position input field for new bookshelf at the bottom of the panel */
.newBookshelf {
  position: absolute;
  bottom: 0%;
  width: 80%;
  height: 30px;
  font-size: 16px;
  margin: 2px;
}

/* Position plus icon for adding new bookshelf */
#addNewShelf img {
  position: absolute;
  bottom: 0.5%;
  margin-left: 85%;
  height: 30px;
  cursor: pointer;
  user-select: none;
}

#addNewShelf img:hover {
  transform: scale(1.2);
}

/* Style table to occupy full width of side panel */
#sidePanel table {
  width: 100%;
}

#sidePanel th {
  font-size: 20px;
  background-color: #573b0c;
  padding: 10px;
  color: white;
}

#sidePanel td {
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px #573b0c solid;
}

#sidePanel tr:hover {
  background-color: white;
  cursor: pointer;
}

/* Give selected category different background colour */
.selected {
  background-color: #a68b6d;
}

/* Show default icon set and hide mobile on larger screens */
.icon-default {
  display: inline; 
}

.icon-mobile {
  display: none; 
}

@media (max-width: 700px) {
  /* Collapsed state of panel container on mobile */
  #panelContainer {
    position: fixed;
    right: auto; 
    left: 0; 
    bottom: 0;
    top: auto; 
    width: 100%; 
    height: 50px;
    transform: none; 
    transition: bottom 0.5s ease; 
  }

  #panelContainer.collapsed #sidePanel,
  #panelContainer.collapsed #addNewShelf {
    display: none; 
  }

  /* Panel fills screen when expanded and extends from the bottom up */
  #panelContainer:not(.collapsed) {
    height: 100%;
    top: 0px; 
    bottom: 50px; 
    overflow-y: auto; 
    padding-bottom: 280px;
  }

  /* Input field fixed at bottom of expanded view */
  #addNewShelf {
    position: fixed; 
    bottom: 50px; 
    left: 0; 
    width: 100%; 
    padding: 0 10px;
    box-sizing: border-box; 
    background: #d1d1d1; 
    z-index: 3; 
  }

  /* Fix collapse tab to the bottom of the viewport */
  #collapseTab {
    position: fixed;
    bottom: 0; 
    right: 0;
    width: 100%;
    height: 50px;
    z-index: 4; 
    top: auto;
    bottom: 0; 
    transform: none; 
  }

  /* Make sure the panel's content starts from the top */
  #sidePanel {
    top: 0;
    padding-bottom: 280px;
  }

  /* Show mobile icon set and hide default on smaller screens */
  .icon-default {
    display: none; 
  }

  .icon-mobile {
    display: inline; 
  }
}

</style>