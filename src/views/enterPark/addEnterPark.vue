<template>
  <article-detail :is-edit='false'></article-detail>
</template>

<script>
  import ArticleDetail from './components/ParkDetail'

  export default {
    name: 'createForm',
    components: { ArticleDetail }
  }
</script>

