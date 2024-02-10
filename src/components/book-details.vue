<template>
    <div class="bookDetails" v-if="book.coverFront">
        <!-- Book cover component displaying either front or back cover -->
        <book-cover :coverFront="book.id.startsWith('501') ? '/assets/covers/' + book.coverFront : book.coverFront"
            :coverBack="book.coverBack && !book.id.startsWith('501') ? book.coverBack : (book.coverBack ? '/assets/covers/' + book.coverBack : null)"></book-cover>
        <div class="detailsContent">
            <div class="modButtonContainer">
                <nav-button text="Edit" eventName="navigate" @navigate="navToEditBook" class="modButton"></nav-button>
                <nav-button text="Delete" eventName="navigate" @navigate="deleteBook" class="modButton"></nav-button>
            </div>
            <!-- Heading section with series shown dynamically if series data exists-->
            <div class='detailsHeading'>
                <h1>{{ book.title }}</h1>
                <h2>{{ book.author }}</h2>
                <h3 v-if="book.series && book.seriesNo">Book {{ book.seriesNo }} of {{ book.series }}</h3>
                <h3>Published {{ formattedDate }}</h3>
            </div>
            <!-- Book summary section -->
            <div class='detailsText'>
                <p v-for="(paragraph, index) in paragraphs" v-bind:key="index">{{ paragraph }}</p>
            </div>
            <!-- List of genres -->
            <div class="genreList">
                <ul>Genres:
                    <li v-for="(genre, index) in book.genres" v-bind:key="index">{{ genre }}</li>
                </ul>
            </div>
            <!-- List of categories -->
            <div class="categoryList">
                <ul>Categories:
                    <li v-for="(category, index) in book.categories" v-bind:key="index">{{ category }}</li>
                </ul>
            </div>
            <!-- Star rating section -->
            <div class='starRating' v-if="book.starRating > 0">My rating:
                <img v-for="n in book.starRating" :key="n"
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Five_Pointed_Star_Solid.svg/768px-Five_Pointed_Star_Solid.svg.png?20210728193546'>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookCover from './book-cover.vue';
import NavButton from './nav-button.vue';

export default {
    // Books array passed down from App.vue
    props: {
        books: {
            type: Array,
            required: true,
        },
    },
    components: {
        'book-cover': BookCover,
        'nav-button': NavButton,
    },
    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter();
        // Initialise book as empty object
        const book = ref({});

        // Populate book object with details of the book in the books array with the ID matching the route
        onMounted(() => {
            const bookId = route.params.id;
            book.value = props.books.find(b => b.id === bookId) || {};
        });

        // Computed property to split the book summary into separate paragraphs
        const paragraphs = computed(() => {
            return book.value.summary ? book.value.summary.split('\\n\\n') : [];
        });

        // Format date string into a readable format for display in the book's details
        const formattedDate = computed(() => {
            if (!book.value.publishedDate) return '';
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const dateParts = book.value.publishedDate.split('-');
            const year = dateParts[0];
            const month = months[parseInt(dateParts[1], 10) - 1];
            const day = parseInt(dateParts[2], 10);

            return `${month} ${day}, ${year}`;
        });

        const navToEditBook = () => {
            router.push({ path: `/edit/${book.value.id}` });
        };

        const deleteBook = () => {
            emit('delete-book', book.value.id);
            router.push('/');
            console.log('Book deleted');
        };

        return { book, paragraphs, formattedDate, navToEditBook, deleteBook };
    }
}
</script>
  
<style scoped>
/* Set flex styling and ensure div occupies at least 70% of the viewport's height */
.bookDetails {
    min-height: 70vh;
    background-color: #ffefd5;
    display: flex;
    justify-content: left;
    align-items: flex-start;
    padding: 2em;
}

/* Set max width to prevent content overflowing behind side panel */
.detailsContent {
    position: relative;
    max-width: 70%;
}

.detailsHeading {
    margin-top: 0;
}

.modButtonContainer {
    display: flex;
    justify-content: right;
    margin: 1em 0;
}

.modButton {
    margin: 0 0.5em;
}


.detailsText,
.genreList,
.categoryList,
.starRating {
    margin: 1em 0;
}


.genreList ul,
.categoryList ul {
    font-weight: bold;
}

.genreList li,
.categoryList li {
    display: inline;
    list-style-type: none;
    margin: 0.4em;
    font-weight: normal;
}

.starRating {
    margin-left: 2.5em;
    font-weight: bold;
}

/* Show star images in line */
.starRating img {
    display: inline;
    width: 30px;
    margin: 0;
}

@media (max-width: 1200px) {

    /* Display book cover and details in a column on smaller screens */
    .bookDetails {
        flex-direction: column;
        align-items: center;
    }

    .detailsHeading {
        text-align: center;
    }

    .detailsContent {
        max-width: 100%;
        margin-top: 25px;
    }

    /* Display genres, categories and star rating left-aligned as the indent is no longer suitable without the book cover to its left */
    ul {
        padding-left: 0;
    }

    .starRating {
        margin-left: 0;
    }

    .modButtonContainer {
        position: static;
        order: -1; 
        width: 100%;
        justify-content: center;
        margin-bottom: 20px;

    }
    .modButton {
    margin: 0 3em;
}
}
</style>