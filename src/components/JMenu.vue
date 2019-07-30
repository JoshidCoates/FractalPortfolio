<template>
    <div class="menu-container">
        <button class="menu-button" v-for="(menuItem, index) in menuItems" :key=index>{{ menuItem.name }}</button>
    </div>
</template>

<script>
    export default {
        name: "JMenu",
        data() {
            return {
                menuItems: [
                    { name: "Home"},
                    { name: "About"},
                    { name: "Portfolio"},
                    { name: "Contact"}
                ]
            }
        }
    }
</script>

<style scoped>

    .menu-container {
        border: 2px white solid;
        width: 12em;
    }

    .menu-button {
        display: block;
        background-color: transparent;
        border: none;
        font-family: inherit;
        font-size: 2.5em;
        margin: 0.25em auto;
        font-weight: 900;
        color: #fff;
        cursor: pointer;
    }

    .menu-button:hover,
    .menu-button:focus {
        color: #d7d7d7;
        outline: none;
        transform: scale(0.99);
    }

    .menu-button:active {
        position: relative;
        top: 0.025em;
    }

</style>