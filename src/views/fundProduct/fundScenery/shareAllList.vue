<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row>
       <!-- <el-col :span="2">
          <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                     icon="el-icon-edit">新增
          </el-button>
        </el-col>-->
        <el-col :span="2">
          <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="filter-item" type="primary" :loading="refreshLoading" @click="reloads">刷新</el-button>
        </el-col>


      <!--  <el-button class="filter-item" style="margin-left: 10px;" @click="" type="primary"
                   icon="el-icon-date">历史分红
        </el-button>

        <el-button class="filter-item" style="margin-left: 10px;" @click="shareAllFund" type="primary"
                   icon="el-icon-date">分红
        </el-button>-->
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
      <el-table-column align="center" label="分红编号" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.fundingNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="分红金额">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="分红时间">
        <template slot-scope="scope">
          <span>{{scope.row.creatTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>


    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"></el-table-column>
        <el-table-column prop="pv" label="Pv"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {fetchList, fetchPv, createArticle, updateArticle} from '@/api/article'
  import {deleteNews, getNewsList} from '@/api/news'
  import { getSightSpotList, deleteSpot,parkList} from '@/api/scenery'
  import { fundProductList, fundingProductDetail, deleteFund, overallBonus, singleBonus, adminRecord} from '@/api/fund'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'

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
        shareAllFundContent:{},
        shareOneFundContent:{},
        listQuery: {
          page: 1,
          size: 10,
        },
        listQuery2: {
          page: 1,
          size: 50,
          level: 1 // 1园区
        },
        visibleDelete: false,
        dataObj:{},
        importanceOptions: [1, 2, 3],
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
        parksOptions:[],
        dialogFormVisible: false,
        dialogVisible3: false,
        dialogVisible4: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
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

    },
    created() {
      this.getList()
    },
    methods: {
      takePartPerson(row){
        this.$router.push({path: '/fund-product/fund-scenery/fund-user-list',query: {id: row.fundingNumber}})
      },
      handleClose() {
        this.dialogFormVisible = false // 关闭dialog
        this.dialogPvVisible = false // 关闭dialog
        this.dialogVisible3 = false // 关闭dialog
        this.dialogVisible4 = false // 关闭dialog
      },
      reloads(){
        this.refreshLoading = true
        this.getList()
      },
      getList() {
        this.listLoading = true
        adminRecord(this.listQuery).then(response => {
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
          this.listLoading = false
          this.refreshLoading = false
          this.$emit('refreshLoading', false)
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
        deleteFund({id: this.dataObj.spotId}).then(response => {
          this.$notify({
            title: '提示',
            message: '停业成功',
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
        this.$router.push({path: '/fund-product/fund-scenery/edit-fund', query: {id: row.spotId}})
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
      }
    }
  }
</script>
