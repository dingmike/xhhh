<template>
  <article-detail :is-edit='true'></article-detail>
</template>

<script>
  import ArticleDetail from './components/ArticleDetail'

  export default {
    name: 'createForm',
    components: { ArticleDetail },
    data() {
      return {
        activeName: 'null',
        createdTimes: 0,
        productName: '',
        refreshLoading: false
      }
    },
    mounted() {
       // alert(this.$route.query.id)
    },
    methods: {

    }
  }
</script>

