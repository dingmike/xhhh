<template>
  <div class="tab-container">
    <!--<el-tag>mounted times ：{{createdTimes}}</el-tag>-->

    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-plus" @click="showSavePark">添加园区</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-plus" @click="showSaveScenery">添加景区</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="refreshLoading" @click="reloads">刷新</el-button>
      </el-col>
      <!--<el-col :span="4" :offset="20">
        <el-input placeholder="名称搜索" v-model="searchQuery.name" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"  @click="search()"></el-button>
        </el-input>
      </el-col>-->
    </el-row>
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" @tab-click="reloads">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key' @create='showCreatedTimes' @refreshLoading="showRefresLoading" ref="childPane"></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>


    <!--添加园区弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="添加园区"
               :visible.sync="visibleSavebox"
               width="30%"
               center
               :before-close="handleClose">
      <el-form class="form-container" :model="content" :rules="rules" ref="content" label-width="80px">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="12">
              <el-form-item label="园区名称" prop="parkName">
                <el-input v-model="content.parkName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleSavebox = false">取 消</el-button>
        <el-button type="primary" :loading="false" @click="addParks">添 加</el-button>
      </span>
    </el-dialog>
    <!--添加园区弹窗 end-->

    <!--添加景区弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="添加景区"
               :visible.sync="visibleSaveScenerybox"
               width="30%"
               center
               :before-close="handleClose">
      <el-form class="form-container" :model="sceneryContent" :rules="rules" ref="sceneryContent" label-width="80px">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="12">
              <el-form-item  label="选择园区" prop="park">
            <el-select size="small" v-model="sceneryContent.park" filterable placeholder="选择园区">
              <el-option
                v-for="item in parksOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="景区名称" prop="sceneryName">
                <el-input v-model="sceneryContent.sceneryName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleSaveScenerybox = false">取 消</el-button>
        <el-button type="primary" :loading="false" @click="addScenery">添 加</el-button>
      </span>
    </el-dialog>
    <!--添加景区弹窗 end-->



  </div>
</template>

<script>
  import tabPane from './components/tabPane'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {
    parkList,
    savePark,
    saveSight
  } from '@/api/scenery'


  const defaultNews={
    parkName: ""
  }
  const defaultScenery={
    id: "",
    park: '',
    sceneryName: ""
  }
  export default {
    name: 'parksList',
    directives: {elDragDialog},
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
//          { label: '全部', key: 'null' },
//          { label: '在架', key: '1' },
//          { label: '已下架', key: '0' }
        ],
        parksOptions: [],
        content: Object.assign({}, defaultNews),
        sceneryContent:Object.assign({}, defaultScenery),
        listQuery: {
          page: 1,
          size: 50,
          level: 1 // 1园区
        },
        loading: false,
        visibleSavebox: false,
        visibleSaveScenerybox: false,
        searchQuery: {
          name: ''
        },
        activeName: '',// 默认选中tab
        createdTimes: 0,
        productName: '',
        refreshLoading: false,
        rules: {
          parkName: [
            {required: true, message: '请输入园区名称', trigger: 'blur'},
            {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          ],
          sceneryName: [
            {required: true, message: '请输入景区名称', trigger: 'blur'},
            {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          ],
          park: [
            {required: true, message: '请选择园区', trigger: 'change'}
          ],

        }
      }
    },
    mounted(){
      this.getALLParks()
    },
    methods: {
      handleClose() {
        this.visibleSavebox = false // 关闭dialog
        this.visibleSaveScenerybox = false // 关闭dialog
      },
        //获取所有园区
      getALLParks(){
        parkList(this.listQuery).then(response => {
          let obj = {label:'', key:'', pId: 0}
          let objs = response.data.data.content
          this.parksOptions = objs
          let options = []
          for(let i=0; i<objs.length; i++){
              let obj = {label:'', key:'', pId: 0}
              obj.label =objs[i].name
              obj.key = objs[i].id + ''
              options.push(obj)
          }
          this.tabMapOptions = options
          // 默认选中第一个tab
          this.activeName = this.tabMapOptions[0].key
          this.loading = false
          this.listLoading = false
        })
      },
      showSavePark(){
          this.visibleSavebox = true
      },
      showSaveScenery(){
        this.visibleSaveScenerybox = true
      },
      // 添加景区
      addScenery(){
        this.$refs.sceneryContent.validate(valid => {
          if (valid) {
            this.loading = true
            this.submitScenery()
          } else {
            console.log('err!')
            return false
          }
        })
      },

      submitScenery(){
          debugger
        saveSight(this.sceneryContent).then(response => {
          this.$notify({
            title: '提示',
            message: '添加景区成功',
            type: 'success',
            duration: 2000
          })
          this.visibleSaveScenerybox = false
          this.getALLParks()
        })
      },
      // 添加园区
      addParks(){
        this.$refs.content.validate(valid => {
          if (valid) {
            this.loading = true
            this.submitPark()
          } else {
            console.log('err!')
            return false
          }
        })
      },
      submitPark(){
        savePark({parkName: this.content.parkName}).then(response => {
          this.$notify({
            title: '提示',
            message: '添加园区成功',
            type: 'success',
            duration: 2000
          })
          this.visibleSavebox = false
          this.getALLParks()
        })
      },
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      showRefresLoading(msg) {
        console.log('stop: ' + msg)
        this.refreshLoading = msg
      },
      reloads() {
        this.refreshLoading =true
        console.log( this.$refs.childPane[0])
        this.$refs.childPane[0].getList();
      },
      search() {
        this.activeName = this.tabMapOptions[0].key
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
