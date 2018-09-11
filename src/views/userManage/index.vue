<template>
  <div class="tab-container">
    <!--<el-tag>mounted times ：{{createdTimes}}</el-tag>-->

    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-setting" @click="goUserDegree">会员等级管理</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="refreshLoading" @click="reloads">刷新</el-button>
      </el-col>
      <el-col :span="4" :offset="20">
        <el-input placeholder="名称搜索" v-model="searchQuery.surname" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"  @click="search()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" @tab-click="reloads">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key' @create='showCreatedTimes' @refreshLoading="showRefresLoading" ref="childPane"></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/tabPane'

  export default {
    name: 'tab',
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '全部', key: 'null' },
//          { label: '在架', key: '1' },
//          { label: '已下架', key: '0' }
        ],
        searchQuery: {
          page: 1,
          size: 10,
          surname: ''
        },
        activeName: 'null',
        createdTimes: 0,
        productName: '',
        refreshLoading: false,
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      showRefresLoading(msg) {
        console.log('stop: ' + msg)
        this.refreshLoading = msg
      },
      goUserDegree() {
        this.$router.push({ path: '/userDegree/index' })
      },
      search() {

      },
      reloads() {
        this.refreshLoading =true
        console.log( this.$refs.childPane[0])
        this.$refs.childPane[0].getList();
      },
      search() {
          debugger
        this.$refs.childPane[0].handlesearchGoods(this.searchQuery);
      }
    }
  }
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
  .own-refresh{
    color: black;
    font-size: 24px;
    font-weight: 600;
  }
</style>
