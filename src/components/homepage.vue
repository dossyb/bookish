<template>
    <div id="homepage">
        <!-- Create bookshelf div for however many shelves are computed -->
        <div v-for="(shelf, index) in shelves" :key="index" :class="`bookshelf bookshelf-${getShelfBackground(index)}`">
            <bookshelf :books="shelf"></bookshelf>
        </div>
    </div>
</template>
  
<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Bookshelf from './bookshelf.vue';

export default {
    components: {
        'bookshelf': Bookshelf
    },
    props: {
        // Filtered list of books passed down from App.vue
        filteredBooks: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        // Store the current window's width
        const windowWidth = ref(window.innerWidth);

        // Add event listener and update screen width value when the component is mounted
        onMounted(() => {
            window.addEventListener('resize', updateWidth);
            updateWidth();
        });

        // Remove event listener when component is destroyed
        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateWidth);
        });

        // Method to update window width when window is resized
        const updateWidth = () => {
            windowWidth.value = window.innerWidth;
        };

        // Method to determine size of shelf based on window width
        const getShelfSize = () => {
            // Return max amount of books to fit on shelf
            const width = windowWidth.value;
            if (width > 1750) return 8;
            if (width > 1500) return 7;
            if (width > 1250) return 6;
            if (width > 1000) return 4;
            if (width > 600) return 3;
            return 2;
        };

        // Method to select one of four background image for each shelf
        const getShelfBackground = (index) => {
            return (index % 4) + 1;
        };

        // Organise books into shelves based on current size of shelf.
        const shelves = computed(() => {
            const shelfSize = getShelfSize();
            const shelves = [];
            // Split book array to fit on each shelf.
            for (let i = 0; i < props.filteredBooks.length; i += shelfSize) {
                shelves.push(props.filteredBooks.slice(i, i + shelfSize));
            }
            return shelves;
        });
        return { windowWidth, shelves, updateWidth, getShelfSize, getShelfBackground };
    },
}
</script>
  
<style scoped>
/* Background images for each bookshelf in sequence */
.bookshelf-1 {
    background-image: url('@/assets/bookshelf-1.png');
}

.bookshelf-2 {
    background-image: url('@/assets/bookshelf-2.png');
}

.bookshelf-3 {
    background-image: url('@/assets/bookshelf-3.png');
}

.bookshelf-4 {
    background-image: url('@/assets/bookshelf-4.png');
}
</style>