<template>
  <div id="newBookForm">
    <!-- Heading for the form -->
    <h2>Add a new book...</h2>
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
      <nav-button text="Reset" eventName="reset-form" @reset-form="resetForm"></nav-button>
      <nav-button text="Submit" eventName="submit-form" @submit-form="submitForm"></nav-button>
    </div>
  </div>
</template>
  
<script>
import { ref, reactive } from 'vue';
import NavButton from './nav-button.vue';

export default {
  components: {
    'nav-button': NavButton,
  },
  setup(_, { emit }) {
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
      coverFront: 'placeholder.png',
      coverBack: 'placeholder.png'
    });
    // Temporary storage for genre and category inputs
    const genreInput = ref('');
    const categoryInput = ref('');
    // Placeholder image paths for the cover previews
    const coverFrontPreview = ref('/assets/covers/placeholder.png');
    const coverBackPreview = ref('/assets/covers/placeholder.png');

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
          } else if (coverType === 'back') {
            coverBackPreview.value = e.target.result;
          }
        };
        // Read the file's name
        reader.readAsDataURL(file);
        // Set the file name in formData for submission
        if (coverType === 'front') {
          formData.coverFront = file.name;
        } else if (coverType === 'back') {
          formData.coverBack = file.name;
        }
      }
    };
    // Method to reset form to its initial state
    const resetForm = () => {
      Object.assign(formData, initialFormData());
      coverFrontPreview.value = '/assets/covers/placeholder.png';
      coverBackPreview.value = '/assets/covers/placeholder.png';
    };

    // Method to submit the form's data
    const submitForm = () => {
      // Check if required fields are filled
      if (formData.title.trim() && formData.author.trim()) {
        // Explicitly set starRating as an integer
        formData.starRating = +formData.starRating;

        // Format and set the published date
        if (formData.publishedDate) {
          formData.publishedDate = formatDate(formData.publishedDate);
        }

        // Emit event with the submitted data and log to console
        console.log('Book added: ', formData);
        emit('add-book', formData);
      } else {
        // Input validation alert if required fields aren't filled
        alert('Please fill out all required fields.');
      }
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

    // Format date string into a readable format for display in the book's details
    const formatDate = (date) => {
      // Return empty string if no date set
      if (!date) return '';

      const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const dateParts = date.split('-');
      const year = dateParts[0];
      const month = months[parseInt(dateParts[1], 10) - 1];
      const day = parseInt(dateParts[2], 10);

      return `${month} ${day}, ${year}`;
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

    return { formData, genreInput, categoryInput, coverFrontPreview, coverBackPreview, previewCover, resetForm, submitForm, addGenre, addCategory, formatDate, initialFormData };
  },
  // this.genreInput = '';
  // this.categoryInput = '';
  // if (this.$refs.coverFrontInput) this.$refs.coverFrontInput.value = '';
  // if (this.$refs.coverBackInput) this.$refs.coverBackInput.value = '';

}
</script>
  
<style scoped>
/* Set flex styling on main container with column direction */
#newBookForm {
  display: flex;
  flex-direction: column;
  padding: 2em;
}

#newBookForm h2 {
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