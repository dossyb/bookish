<template>
    <!-- Footer section of the web app -->
    <div id="footer">
        Created by Dossy B with the Vue.js framework.
    </div>
</template>
  
<script></script>
  
<style scoped>
/* Align footer to center of page */
#footer {
    text-align: center;
    transition: margin-right 0.5s ease;
}

/* Adjust padding for screens under 700px wide */
@media (max-width: 700px) {
    #footer {
        padding-bottom: 50px;
}
}
</style>