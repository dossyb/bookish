<template>
    <div id="header">
        <!-- Header's main content area -->
        <div id="content">
            <!-- Header's logo that returns to default view when clicked -->
            <div id="logo" @click="resetFilter">
                <img src="../assets/bookish-logo.png" />
            </div>
            <!-- Display the name of the currently selected bookshelf -->
            <div id="selectedBookshelf">{{ displayedCategory }}</div>
            <!-- Container for right-aligned header items -->
            <div id="headerRight">
                <!-- Container for the search bar and icon -->
                <div id="search">
                    <input type='text' placeholder='Search for a book...' id='searchBar'>
                    <img src='https://simpleicons.org/icons/searxng.svg'>
                </div>
                <!-- Nav button for general navigation -->
                <nav-button :text="buttonText" eventName="navigate" @navigate="handleNavigation"></nav-button>
                <!-- Secondary nav button conditionally shown when the view is filtered by a category -->
                <nav-button :text="backButtonText" eventName="navigate" v-if="isFiltered & isHomepage"
                    @navigate="resetFilter"></nav-button>
            </div>
        </div>
        <!-- Header's bottom border separating from app content. -->
        <div id='border'></div>
    </div>
</template>
  
<script>
// Import the NavButton component
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavButton from './nav-button.vue'

// Constant for the responsive breakpoint
const BREAKPOINT_WIDTH = 1000;

export default {
    props: {
        isFiltered: {
            type: Boolean,
            default: false
        },
    },
    components: {
        'nav-button': NavButton,
    },
    setup(_, { emit }) {
        const route = useRoute();
        const router = useRouter();
        const isHomepage = computed(() => route.path === '/');
        // Initial screen width
        const screenWidth = ref(window.innerWidth);
        const selectedCategory = ref('Your Books');
        // Add event listener and update screen width value when the component is mounted
        onMounted(() => {
            window.addEventListener('resize', updateScreenWidth);
            updateScreenWidth();
        });
        // Remove event listener when component is destroyed
        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateScreenWidth);
        });
        // Dynamically update nav button's inner text based on screen width
        const buttonText = computed(() => {
            if (screenWidth.value <= BREAKPOINT_WIDTH) {
                return route.path === '/' ? '+' : '<';
            }
            return route.path === '/' ? 'Add a book' : 'Go back';
        });
        // Dynamically update secondary nav button's inner text based on screen width
        const backButtonText = computed(() => {
            if (screenWidth.value <= BREAKPOINT_WIDTH) {
                return '<';
            }
            return 'Go back';
        });
        // Dynamically display the currently selected category or 'Your Books' by default
        const displayedCategory = computed(() => {
            return selectedCategory.value === 'All Books' ? 'Your Books' : selectedCategory.value;
        });

        // Handle navigation of the nav buttons
        const handleNavigation = () => {
            if (route.path === '/') {
                router.push('/new');
            } else {
                router.push('/');
            }
        };
        // Reset filtered category to default
        const resetFilter = () => {
            emit('reset-filter');
        };
        // Update the screen width value upon resize
        const updateScreenWidth = () => {
            screenWidth.value = window.innerWidth;
        };
        return { isHomepage, screenWidth, selectedCategory, buttonText, backButtonText, displayedCategory, handleNavigation, resetFilter, updateScreenWidth };
    }
}

</script>
  
<style scoped>
/* Header styling with orange background */
#header {
    background-color: #e98953;
    padding: 0 20px;
    transition: margin-right 0.5s ease;
}

/* Flex layout to center and evenly space content */
#content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 125px;
    position: relative;
}

/* Style the text for the selected bookshelf */
#selectedBookshelf {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    font-weight: bold;
    user-select: none;
}

/* Prevent shrinking of container for header's right-aligned items */
#headerRight {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
}

#logo {
    flex-shrink: 0;
    cursor: pointer;
}

#logo img {
    height: 120px;
}

/* Extend border width beyond edges of page to fill entire page width */
#border {
    margin: 0 -3em;
    width: 120%;
    border-bottom: 2px solid black;
}

/* Flex styling for search content container */
#search {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#searchBar {
    flex-grow: 1;
    height: 30px;
    font-size: 16px;
    margin-right: 5px;
}

#search img {
    height: 30px;
    cursor: pointer;
    user-select: none;
    margin-right: 20px;
}

#search img:hover {
    transform: scale(1.2);
}

/* Hide search input on screens under 1800px wide */
@media (max-width: 1800px) {
    #search input[type='text'] {
        display: none;
    }
}

/* Adjust font size and margin for screens under 1200px wide */
@media (max-width: 1200px) {
    #selectedBookshelf {
        font-size: 24px;
    }

    #navButton {
        margin-right: 10px;
    }
}

/* Collapse the nav buttons on screens under 800px wide  */
@media (max-width: 800px) {
    nav-button {
        font-size: 24px;
    }

    nav-button::before {
        content: "+";
    }

    #logo img {
        max-height: 80px;
    }

    #search img {
        margin-right: 10px;
    }
}

/* Minute adjustments on screens under 500px wide */
@media (max-width: 500px) {
    #header {
        padding: 0;
    }

    #navButton {
        height: 40px;
        padding: 0 15px;
        font-size: 10px;
        margin-right: 5px;
    }

    #selectedBookshelf {
        font-size: 16px;
    }

    #content {
        height: 100px;
    }
}
</style>