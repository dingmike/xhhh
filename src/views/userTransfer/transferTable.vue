<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-select clearable style="width: 200px" class="filter-item" v-model="listQuery.type"
                 placeholder="交易类型">
        <el-option v-for="item in dealTypeOptions" :key="item.id" :label="item.type" :value="item.id">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
               placeholder="交易对象手机号" v-model="listQuery.phone">
     </el-input>
      <!--<el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type"
                 :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"
                   :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>

      <el-button class="filter-item" type="primary" v-waves :loading="refreshLoading" @click="reloads">刷新</el-button>

      <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                  icon="el-icon-edit">{{$t('table.add')}}
       </el-button>-->
      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">{{$t('table.export')}}
      </el-button>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">
        {{$t('table.reviewer')}}
      </el-checkbox>-->
    </div>


    <!--提现明细-->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="用户ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="订单号">
        <template slot-scope="scope">
          <!--<span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
          <span>{{scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="交易对象">
        <template slot-scope="scope">
          <!--<span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
          <span>{{scope.row.transPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" label="交易类型">
        <template slot-scope="scope">
          <!--<el-tag>{{scope.row.type | typeFilter}}</el-tag>-->
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="收入/支出">
        <template slot-scope="scope">
          <span>{{scope.row.inOut| inOutState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="转账/转换金额">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="余额">
        <template slot-scope="scope">
          <span>{{scope.row.cashBalance}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column width="110px" align="center" label="明细">
        <template slot-scope="scope">
          <span>{{scope.row.detail}}</span>
        </template>
      </el-table-column>-->

      <!--<el-table-column align="center" :label="$t('table.actions')" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="middle" @click="handleStatus(scope.row)">修改状态</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!--激活账户弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="操作"
               :visible.sync="dialogVisible4"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">提现通过吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="handleActiveUser">确定</el-button>
      </span>
    </el-dialog>
    <!--激活账户 end-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                   :max='3'></el-rate>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input"
                    v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
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
  import {getWithDrawList, idPassed, getTransferList} from '@/api/users'
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
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        dealTypeOptions:[{
            id:1,
          type: '现金余额转账'
        },
          {
            id:2,
            type: '分红积分转账'
          },
          {
            id:3,
            type: '现金余额转换分红积分'
          }],
        listQuery: {
          page: 1,
          size: 10,
          type: '', // 1:余额转账记录，2：积分转账记录，3：余额转积分记录
          phone: '',
        },
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
        oneObj: {},
        dialogFormVisible: false,
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
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {

        switch (type) {
          case 1:
            return '现金余额'
          case 2:
            return '分红积分'
          case 3:
            return "现金余额转换分红积分"
          default:
            break
        }
      },
      inOutState(type){
          if(type==1){
            return '收入'
          }else{
            return '支出'
          }
      },
      statusFilter(status){
        switch (status) {
          case 0:
            return '待审核'
          case 1:
            return '审核通过'
          case 2:
            return '未通过审核'
          case 3:
            return "异常"
          default:
            break
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getTransferList(this.listQuery).then(response => {
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
      handleStatus(row){
        this.oneObj = row
        this.dialogVisible4 = true
      },
      handleActiveUser(){
        idPassed({id: this.oneObj.id}).then(response => {
          this.dialogVisible4 = false
          this.$notify({
            title: '成功',
            message: '激活成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
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
          const tHeader = ['姓名', '电话号码', '提现方式(1：支付宝；2：微信；3：银行卡)', '提现账户', '实际提现金额', '提现金额', '累计提现金额', '状态(0：已申请，待审核；1：已通过审核  2：未通过审核，退款   3：异常)', '备注',]
          const filterVal = ['realName', 'phone', 'type', 'targetAccount', 'actualMoney', 'money', 'totalMoney', 'status', 'remarks']
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
      handleClose(){

      },
      reloads() {
        this.refreshLoading =true
        this.listQuery={
          page: 1,
            size: 10,
            type: '', // 1:余额转账记录，2：积分转账记录，3：余额转积分记录
            phone: '',
        }
        this.getList()
      },
    }
  }
</script>
