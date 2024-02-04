<template>
  <div id="bookForm">
    <!-- Heading for the form -->
    <h2>{{ formTitle }}</h2>
    <!-- Container for the entire form -->
    <div class='formContainer'>
      <!-- Container for the form's input elements -->
      <div class='formContent'>
        <!-- First row of form -->
        <div class='formRow'>
          <!-- Input field for the book's title -->
          <label for='title'>Title:*</label>
          <input type='text' v-model="formData.title" name='title'>
          <!-- Input field for the book's author -->
          <label for='author'>Author:*</label>
          <input type='text' v-model="formData.author" name='author'>
        </div>
        <!-- Second row of form -->
        <div class='formRow'>
          <!-- Input field for the book's series -->
          <label for='series'>Series (if applicable)</label>
          <input type='text' v-model="formData.series" name='series'>
          <!-- Input field for the book's entry number within a series -->
          <label for='seriesNo'>No.:</label>
          <input type='number' v-model="formData.seriesNo" name='seriesNo' placeholder='1' min='0' max='100'>
        </div>
        <!-- Third row of form -->
        <div class='formRow'>
          <!-- Input field for the book's published date -->
          <label for='date'>Published date:</label>
          <input type='date' v-model="formData.publishedDate" name='date'>
          <!-- Input field for the user's rating of the book -->
          <label for='isbn'>Rating (out of 5):</label>
          <input type='number' v-model="formData.starRating" name='starRating' placeholder='5' min='0' max='5'>
        </div>
        <!-- Fourth row of form -->
        <div class='formRow'>
          <!-- Input field for the book's summary -->
          <label for="summary">Book summary:</label>
          <textarea id="summary" v-model="formData.summary" name="summary" rows="6" cols="50"></textarea>
        </div>
        <!-- Row for genres and categories -->
        <div class='formRow genreCategoryRow'>
          <!-- Input group for the book's genres -->
          <div class='inputGroup'>
            <label for='genre'>Genres:</label>
            <input type='text' v-model="genreInput" @keyup.enter="addGenre" name='genre'>
            <!-- Display for added genres -->
            <div class='genreCategoryContainer'>
              <span v-for="genre in formData.genres" :key="genre">{{ genre }}</span>
            </div>
          </div>
          <!-- Input group for the book's categories -->
          <div class='inputGroup'>
            <label for='category'>Categories:</label>
            <input type='text' v-model="categoryInput" @keyup.enter="addCategory" name='category'>
            <!-- Display for added categories -->
            <div class='genreCategoryContainer'>
              <span v-for="category in formData.categories" :key="category">{{ category }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Section for the cover upload -->
      <div class='coverUpload'>
        <!-- Front cover section with preview image and upload input -->
        <div class='coverUploadSection'>
          <img :src='coverFrontPreview'>
          <input type='file' name='frontCover' @change="previewCover($event, 'front')" ref="coverFrontInput">
          <label for='frontCover'>Add front cover</label>
        </div>
        <!-- Back cover section with preview image and upload input -->
        <div class='coverUploadSection'>
          <img :src='coverBackPreview'>
          <input type='file' name='backCover' @change="previewCover($event, 'back')" ref="coverBackInput">
          <label for='backCover'>Add back cover</label>
        </div>
      </div>
    </div>
    <!-- Container for the Reset and Submit buttons at the end of the form -->
    <div class='buttonBar'>
      <nav-button v-if="mode === 'edit'" text="Cancel" eventName="cancel-edit" @cancel-edit="cancelEdit"></nav-button>
      <nav-button v-else text="Reset" eventName="reset-form" @reset-form="resetForm"></nav-button>
      <nav-button text="Submit" eventName="submit-form" @submit-form="submitForm"></nav-button>
    </div>
  </div>
</template>
  
<script>
import { ref, reactive, computed, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import NavButton from './nav-button.vue';

export default {
  components: {
    'nav-button': NavButton,
  },
  props: {
    // Indicate the form mode - 'add' or 'edit'
    mode: {
      type: String,
      required: true,
      default: 'add',
      validator: function (value) {
        return ['add', 'edit'].includes(value);
      },
    },
    bookId: {
      type: String,
      required: false
    },
    // Books array passed down from App.vue
    books: {
      type: Array,
      required: false,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const updateBook = inject('updateBook');
    const formData = reactive({
      title: '',
      author: '',
      series: '',
      seriesNo: 1,
      publishedDate: '',
      starRating: 0,
      summary: '',
      genres: [],
      categories: [],
      coverFront: 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png',
      coverBack: 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png'
    });
    // Temporary storage for genre and category inputs
    const genreInput = ref('');
    const categoryInput = ref('');
    // Placeholder image paths for the cover previews
    const coverFrontPreview = ref('https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png');
    const coverBackPreview = ref('https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png');

    const formTitle = computed(() => {
      return props.mode === 'edit' ? 'Edit book...' : 'Add a new book...';
    });
    watch(() => props.bookId, (newBookId) => {
      console.log(props.books);
      if (props.mode === 'edit' && newBookId && props.books) {
        const bookToEdit = props.books.find(book => book.id === newBookId);
        if (bookToEdit) {
          Object.assign(formData, bookToEdit);
          // coverFrontPreview.value = formData.coverFront || '';
          // coverBackPreview.value = formData.coverBack || '';
          console.log(formData);
        }
        // Object.assign(formData, newValue, {
        //   genres: newValue.genres || [],
        //   categories: newValue.categories || [],
        //   coverFront: newValue.coverFront || 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png',
        //   coverBack: newValue.coverBack || 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png'
        // });
        // coverFrontPreview.value = formData.coverFront;
        // coverBackPreview.value = formData.coverBack;
      }
    }, {
      deep: true,
      immediate: true,
    });

    // Method to preview the book cover image
    const previewCover = (event, coverType) => {
      const file = event.target.files[0];
      if (file) {
        // Create a URL for the file object for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          // Update preview with image based on cover type (front or back)
          if (coverType === 'front') {
            coverFrontPreview.value = e.target.result;
            formData.coverFront = e.target.result;
          } else if (coverType === 'back') {
            coverBackPreview.value = e.target.result;
            formData.coverBack = e.target.result;
          }
        };
        // Read the file's name
        reader.readAsDataURL(file);
      }
    };

    const cancelEdit = () => {
      router.back();
    }

    // Method to reset form to its initial state
    const resetForm = () => {
      Object.assign(formData, initialFormData());
      coverFrontPreview.value = 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png';
      coverBackPreview.value = 'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png';
    };

    // Method to submit the form's data
    const submitForm = () => {
      // Check if required fields are filled
      if (isValidFormData(formData)) {
        // Explicitly set starRating as an integer
        formData.starRating = +formData.starRating;
        // Format and set the published date
        // if (formData.publishedDate) {
        //   formData.publishedDate = formatDate(formData.publishedDate);
        // }
        if (props.mode === 'add') {
          // Emit event with the submitted data and log to console
          console.log('Book added: ', formData);
          emit('add-book', formData);
        } else if (props.mode === 'edit') {
          // Find the book in the books array using bookId and update it
          const bookIndex = props.books.findIndex(book => book.id === props.bookId);
          if (bookIndex !== -1) {
            const updatedBook = { ...props.books[bookIndex], ...formData, id: props.bookId };
            console.log('Book updated:', updatedBook);
            updateBook(updatedBook); // Assuming updateBook is a provided method to update the book in the parent component or store
            router.push(`/book/${props.bookId}`);
          } else {
            console.error('Book to edit not found');
          }
        }
      } else {
        // Input validation alert if required fields aren't filled
        alert('Please fill out all required fields correctly.');
      }
    };

    const isValidFormData = (data) => {
      return data.title.trim() && data.author.trim();
    };

    // Method to add a genre to the formData's genre array
    const addGenre = () => {
      if (genreInput.value.trim()) {
        formData.genres = [...formData.genres, genreInput.value.trim()];
        genreInput.value = '';
      }
    };

    // Method to add a category to the formData's category array
    const addCategory = () => {
      if (categoryInput.value.trim()) {
        formData.categories = [...formData.categories, categoryInput.value.trim()];
        categoryInput.value = '';
      }
    };

    // Initialise function to return object containing empty form data
    const initialFormData = () => {
      return {
        title: '',
        author: '',
        series: '',
        seriesNo: 1,
        publishedDate: '',
        starRating: 0,
        summary: '',
        genres: [],
        categories: [],
        coverFront: '',
        coverBack: ''
      };
    };

    return { formData, genreInput, categoryInput, coverFrontPreview, coverBackPreview, formTitle, previewCover, cancelEdit, resetForm, submitForm, isValidFormData, addGenre, addCategory, initialFormData };
  }
};
</script>
  
<style scoped>
/* Set flex styling on main container with column direction */
#bookForm {
  display: flex;
  flex-direction: column;
  padding: 2em;
}

#bookForm h2 {
  margin-bottom: 1em;
}

/* Set flex styling on the container for the form's elements with row direction */
.formContainer {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.formContent {
  flex-grow: 1;
  margin-right: 2em;
}

/* Style the individual form rows to use flex wrapping and centre alignment */
.formRow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1em;
}

/* Additional styling for the genre/category input row */
.genreCategoryRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2em;
}

/* Styling for input group to occupy almost half of the container and render its child elements in a column */
.inputGroup {
  flex-basis: 48%;
  display: flex;
  flex-direction: column;
}

/* Styling for genres and categories added to the list and displayed on the page */
.genreCategoryContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.genreCategoryRow .inputGroup input[type='text'] {
  margin-bottom: 0.5em;
}

/* Add margins to space out form's elements */
.formRow label,
.formRow input,
.formRow textarea {
  margin-right: 10px;
  margin-bottom: 10px;
}

.formRow label {
  font-size: 18px;
  white-space: nowrap;
}

.formRow input[type="text"],
.formRow input[type="number"],
.formRow input[type="date"] {
  flex-grow: 1;
  font-size: 16px;
}

.formRow textarea {
  flex-grow: 1;
  font-size: 16px;
  margin-right: 0;
}

/* Set flex styling on cover upload container to display each in line */
.coverUpload {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 1em;
}

/* Set flex styling on each cover upload to show elements in a column */
.coverUploadSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1em;
}

/* Styling for preview image */
.coverUploadSection img {
  height: auto;
  max-height: 200px;
  margin-bottom: 0.5em;
}

.coverUploadSection input[type='file'] {
  margin-bottom: 0.5em;
}

/* Set flex styling for Reset and Submit buttons */
.buttonBar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
}

.buttonBar nav-button {
  margin-right: 1em;
}

/* Responsive styling for screens smaller than 1000px wide */
@media (max-width: 1000px) {

  /* Set form container to display in a column so cover upload section is moved below the input fields */
  .formContainer {
    flex-direction: column;
  }

  .coverUpload,
  .formContent {
    width: 100%;
  }

  .coverUpload img {
    max-height: 300px;
  }

  .coverUploadSection {
    margin-right: 0;
  }
}

/* Responsive styling for screens smaller than 700px wide */
@media (max-width: 700px) {

  /* Display each input field on individual row */
  .formRow {
    flex-direction: column;
  }

  .formRow label,
  .formRow input,
  .formRow textarea {
    width: 100%;
    margin-right: 0;
  }

  /* Display cover uploads in a column rather than side-by-side  */
  .coverUpload {
    flex-direction: column;
  }

  .coverUploadSection {
    margin-right: 0;
    width: 100%;
  }

  .genreCategoryRow {
    flex-direction: column;
  }

  .inputGroup {
    width: 100%;
  }
}
</style>