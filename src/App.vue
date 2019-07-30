<template>
  <div id="app">
    <JFractal></JFractal>
    <JMenu></JMenu>
    <JContentArea></JContentArea>
  </div>
</template>

<script>
    import JMenu from "@/components/JMenu";
    import JContentArea from "@/components/JContentArea";
    import JFractal from "@/components/JFractal";

    export default {
      name: 'app',
      components: {
        JFractal,
        JContentArea,
        JMenu
      }
    }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Catamaran:400,900&display=swap');
  #app {
    font-family: 'Catamaran', sans-serif;
    font-size: 1.5vh;
  }
</style>
