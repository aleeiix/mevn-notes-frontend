<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link
      v-for="(page, index) in pages"
      :key="index"
      :to="{ query: { page } }"
      class="btn btn-primary btn-block"
    >{{page}}</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: [1, 2, 3]
    };
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      handler: newValue => {
        console.log(`Page ==> ${newValue}`);
      }
    }
  }
};
</script>
