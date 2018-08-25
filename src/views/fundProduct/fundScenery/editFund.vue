<template>
  <article-detail :news-id="rowId" :is-edit='true'></article-detail>
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
        refreshLoading: false,
        rowId:''
      }
    },
    mounted() {
//      alert(this.$route.query.id)
      this.rowId =  this.$route.query.id
    },
    methods: {

    }
  }
</script>

