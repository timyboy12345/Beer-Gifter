<template>
  <RouterLink :active-class="activeClass" :to="computedLink">
    <slot></slot>
  </RouterLink>
</template>


<script>
export default {
  data() {
    return {
      computedLink: '/'
    }
  },
  props: {
    to: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    activeClass: {
      type: String,
      required: false
    }
  },
  created() {
    this.generateLink();
  },
  watch: {
    '$route'() {
      this.generateLink();
      this.$forceUpdate();
    }
  },
  methods: {
    generateLink() {
      if (this.to) {
        this.computedLink = this.to;
      }

      if (this.name) {
        if (this.$route.fullPath.includes('/en/')) {
          this.computedLink = {name: 'en_' + this.name};
          return;
        }

        this.computedLink = {name: 'nl_' + this.name};
      }
    }
  }
}
</script>
