<template>
    <button id="navButton" @click="$emit(eventName)">
        <!-- Nav button's text passed via prop -->
        <span>{{ text }}</span>
    </button>
</template>
  
<script>

export default {
    // Prop to pass down nav button's text from parent component
    props: {
        text: {
            type: String,
            default: 'Button'
        },
        eventName: String
    }
}
</script>
  
<style scoped>
/* Styling for the button */
#navButton {
    height: 60px;
    line-height: 40px;
    padding: 0px 20px;
    margin-right: 50px;
    background-color: #573b0c;
    color: #ffefd5;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

}

/* Change button's background color when hovered over */
#navButton:hover {
    background-color: #6a6e3b;
}

#navButton span {
    cursor: pointer;
}
</style>