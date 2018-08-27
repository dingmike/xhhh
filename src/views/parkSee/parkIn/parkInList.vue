<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-row>
        <el-col :span="2">
          <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="filter-item" type="primary" :loading="refreshLoading" @click="reloads">刷新</el-button>
        </el-col>
      </el-row>

      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">{{$t('table.export')}}
      </el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">
        {{$t('table.reviewer')}}
      </el-checkbox>-->
    </div>

    <!--列表-->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="套餐标题" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="套餐介绍">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showIntro(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="封面图">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showPic(scope.row)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="success" @click="showSureDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--查看弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="查看介绍"
               :visible.sync="dialogVisible4"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">{{oneObj.intro}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--查看弹窗 end-->

    <!--查看弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="查看封面图片"
               :visible.sync="dialogVisible3"
               width="50%"
               center
               :before-close="handleClose">
      <el-row>
        <!--<el-col :span="24">-->
          <el-col :span="4"  v-for="(item, index) in oneObj.img" :key="index">
            <img style="width: 100%" :src="item" alt="">
          </el-col>
        <!--</el-col>-->
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--查看弹窗 end-->
    <!--删除弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="删除数据"
               :visible.sync="visibleDelete"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">确定删除数据吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleDelete = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteNews">确定</el-button>
      </span>
    </el-dialog>
    <!--删除弹窗 end-->

  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {fetchList, fetchPv, createArticle, updateArticle} from '@/api/article'
  import {deleteNews, getNewsList} from '@/api/news'
  import { getSightSpotList, deleteSpot} from '@/api/scenery'
  import {partInFundPersonList, deleteFund} from '@/api/fund'
  import {deletParkin, parkinList} from '@/api/parkin'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'

  const calendarTypeOptions = [
    {key: 'CN', display_name: 'China'},
    {key: 'US', display_name: 'USA'},
    {key: 'JP', display_name: 'Japan'},
    {key: 'EU', display_name: 'Eurozone'}
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'complexTable',
    directives: {
      waves,
      elDragDialog
    },
    data() {
      return {
        refreshLoading: false,
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          size: 10,
        },
        visibleDelete: false,
        dataObj:{},
        oneObj:{},
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        dialogVisible3: false,
        dialogVisible4: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      showIntro(row){

        this.oneObj = row
        if(!row.intro){
          this.$message({
            message: '没有介绍',
            type: 'warning'
          })
        }else{
          this.dialogVisible4 = true
        }
      },
      showPic(row){
          this.oneObj = row
        if(!row.img){
          this.$message({
            message: '没有图片',
            type: 'warning'
          })
        }else{
          if( !(this.oneObj.img instanceof Array)){
            this.oneObj.img=this.oneObj.img.split(',')
          }

          this.dialogVisible3 = true
        }

      },
      takePartPerson(row){
        this.$router.push({path: '/fund-product/fund-scenery/add-fund',query: {id: row.fundingNumber}})
      },
      handleClose() {
        this.dialogFormVisible = false // 关闭dialog
        this.dialogPvVisible = false // 关闭dialog
        this.dialogVisible3 = false
        this.dialogVisible4 = false
      },
      reloads(){
        this.refreshLoading = true
        this.getList()
      },
      getList() {
        this.listLoading = true
        parkinList(this.listQuery).then(response => {
            if(response.data.data){
              this.list = response.data.data.content
              this.total = response.data.data.totalElements
              this.listLoading = false
              this.refreshLoading = false
              this.$emit('refreshLoading', false)
            }else{
              this.listLoading = false
              this.$message({
                message: '暂无数据',
                type: 'warning'
              })
            }

        })
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      // 新增内容
      handleCreate() {
        this.$router.push({path: '/fund-product/fund-scenery/add-fund'})
//        this.$router.push({path: '/news/addNews', query: {id: row.id}})
      },
      showSureDelete(row){
        this.dataObj = row
        this.visibleDelete= true
      },
      handleDeleteNews(row){
        deletParkin({id: this.dataObj.id}).then(response => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.visibleDelete = false
          this.getList()
        })
      },
      // 去修改内容
      handleUpdate(row) {
          debugger
        console.log("修改内容ID:" + row.spotId)
        this.$router.push({path: '/park-see/park-in/edit-parkin', query: {id: row.id}})
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      goBack(){
        this.$router.push({path: '/fund-product/fund-scenery/fund-list'})
      },
      // 历史分红记录
      historyRecord(){

      }
    }
  }
</script>
