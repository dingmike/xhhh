<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row>
        <!--<el-col :span="2">
          <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                     icon="el-icon-edit">新增
          </el-button>
        </el-col>-->
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
      <el-table-column align="center" label="订单号" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.orderId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员账号" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.orderStatusName}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="取货方式" width="120">
        <template slot-scope="scope">
          <span>{{scope.row |statusFilter}}</span>
        </template>
      </el-table-column>-->

      <el-table-column width="120" align="center" label="支付现金余额">
        <template slot-scope="scope">
          <span>{{scope.row.payMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="种酒名称" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.liquorProductName}}</span>
        </template>
      </el-table-column>
      <!--    <el-table-column width="200px" align="center" label="售价">
            <template slot-scope="scope">
              <span>{{scope.row.money}}</span>
            </template>
          </el-table-column>-->
      <el-table-column width="100px" align="center" label="数量">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="来源订单">
        <template slot-scope="scope">
          <span>{{scope.row.pOrderId!=null?scope.row.pOrderId:'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="下单时间">
        <template slot-scope="scope">
          <!--<span>{{scope.row.creatTime}}</span>-->
          <span>{{scope.row.creatTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="500" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.pOrderId==null" type="primary" size="small" @click="goSeeAddress(scope.row)">查看证书寄送地址</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">查看详情</el-button>
          <el-button size="small" type="success" @click="changeStatus(scope.row)">修改状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


<!--待窖藏状态 start-->
    <el-dialog title="修改窖藏状态" :visible.sync="dialogFormVisible1">
      <el-form :rules="rules" ref="dataForm" :model="waitContent" label-position="left" label-width="90px"
               style='width: 800px; margin-left:10px;'>
        <el-form-item label="修改状态" prop="type">
          <el-select class="filter-item" v-model="waitContent.type" placeholder="选择状态">
            <el-option v-for="item in waitOptions" :key="item.id" :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="waitContent.type==1" label="窖藏编号" prop="cellarNumber">
          <el-input v-model="waitContent.cellarNumber"></el-input>
        </el-form-item>

        <el-form-item  v-if="waitContent.type==1" label="窖藏详情" prop="context">
          <div class="editor-container">
            <tinymce :height=300 ref="editor" v-model="waitContent.context"></tinymce>
          </div>
        </el-form-item>

        <!--选择已失效-->
        <el-form-item v-if="waitContent.type==4" label="失效原因" prop="remarks">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入失效原因"
            v-model="waitContent.remarks">
          </el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="sureWaitStatus">确 定</el-button>
        <!--<el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>-->
      </div>
    </el-dialog>
    <!--待窖藏状态 end-->






    <!--已窖藏修改为已失效状态 start-->
    <el-dialog title="修改窖藏状态" :visible.sync="dialogFormVisible3">
      <el-form :rules="rules" ref="dataForm" :model="waitContent" label-position="left" label-width="90px"
               style='width: 800px; margin-left:10px;'>
        <el-form-item label="修改状态" prop="type">
          <el-select class="filter-item" v-model="waitContent.type" placeholder="选择状态">
            <el-option v-for="item in applyOptions" :key="item.id" :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--选择已失效-->
        <el-form-item v-if="waitContent.type==4" label="失效原因" prop="remarks">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入失效原因"
            v-model="waitContent.remarks">
          </el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="sureWaitStatus">确 定</el-button>
        <!--<el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>-->
      </div>
    </el-dialog>
    <!--已窖藏修改为已失效状态 end-->



    <!--已失效窖藏状态 start-->
    <el-dialog title="修改窖藏状态" :visible.sync="dialogFormVisible2">
      <el-form :rules="rules" ref="dataForm" :model="readyContent" label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="修改状态" prop="type">
          <el-select class="filter-item" v-model="readyContent.type" placeholder="选择状态">
            <el-option v-for="item in readyOptions" :key="item.id" :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
 <!--       <el-form-item label="窖藏" prop="title">
          <el-input v-model="readyContent.cellarNumber"></el-input>
        </el-form-item>-->
        <el-form-item v-if="oneObj.mailType==2&&readyContent.type==3" label="快递编号" prop="expressNumber">
          <el-input v-model="readyContent.expressNumber"></el-input>
        </el-form-item>
        <!--选择已失效-->
        <el-form-item v-if="readyContent.type==4" label="失效原因" prop="remarks">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入失效原因"
            v-model="readyContent.remarks">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sureReadyStatus">确 定</el-button>
        <!--<el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>-->
      </div>
    </el-dialog>
    <!--已失效窖藏状态 end-->



    <!--寄送证书 地址 start-->
    <el-dialog title="寄送证书地址" :visible.sync="dialogAddressVisible">
      <el-form class="form-container" :model="addressDetail" label-width="120px">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收件人：" prop="userName">
                <span>{{addressDetail.userName}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="phone">
                <span>{{addressDetail.phone}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="证书寄送地址：" prop="province">
                <span>{{addressDetail.province}}, {{addressDetail.city}},  {{addressDetail.dist}}, {{addressDetail.detailedAddress}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-dialog>
    <!--寄送证书 地址  end-->



    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"></el-table-column>
        <el-table-column prop="pv" label="Pv"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>



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
  import {wineOrderList, deleteWine, wineAlreadyInvalid,wineAlreadyOpen,wineCollected,wineOrderAddress} from '@/api/wine'
  import { getSightSpotList, deleteSpot} from '@/api/scenery'
  import waves from '@/directive/waves' // 水波纹指令
  import {parseTime} from '@/utils'
  import Tinymce from '@/components/Tinymce'

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
    components: {Tinymce},
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
        dialogAddressVisible: false,
        dataObj:{},
        addressDetail:{
          "id": '',
          "userId": '',
          "userName": "",
          "phone": "",
          "province": "",
          "city": "",
          "dist": "",
          "detailedAddress": "",
          "isDefault": ''
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        waitOptions:[
          {id: 1, name:'已窖藏'},
          {id: 4, name:'已失效'},
//          {id: 0, name:  '待窖藏'}
        ],
        readyOptions:[
          {id: 3, name:'已启坛'},
          {id: 4, name:'已失效'}
        ],
        applyOptions:[
          {id: 4, name:'已失效'}
        ],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        oneObj:{},
        waitContent:{
          orderId:'',
          cellarNumber: '',
          context: ''
        },
        readyContent:{
          orderId:'',
          remarks:''
        },
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
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
      statusFilter(row) {
        return row
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
        goSeeAddress(row){
//droitAddressId
          debugger
          this.dialogAddressVisible=true
          wineOrderAddress({droitAddressId: row.droitAddressId}).then(response => {
            this.addressDetail = response.data.data

          })
        },
      changeStatus(row){
        this.oneObj=row
        //0-代窖藏, 1-已窖藏。2-申请启坛，3-已启坛，4-已失效
        switch (row.orderStatus){
         case 0:
           this.dialogFormVisible1 = true
           break
         case 1:
             this.dialogFormVisible3 = true
               break
         case 2:
             this.dialogFormVisible2 = true
               break
          case 4:
            this.$message({
              message: '不能修改已失效状态',
              type: 'warning'
            })
                break
          case 3:
            this.$message({
              message: '不能修改已启坛状态',
              type: 'warning'
            })
                break
         default:
             break
       }

      },
        //待窖藏修改成两种状态（已窖藏，以失效）
      sureWaitStatus(){
          this.waitContent.orderId=this.oneObj.orderId
        // 失效状态
        if(this.waitContent.remarks){
          this.wineAlreadyInvalidStatus(this.waitContent)
        }else{
          this.wineCollectedStatus(this.waitContent)
        }

      },

      // 申请启坛 两种状态（已启坛，已失效）
      sureReadyStatus(){
        this.readyContent.orderId=this.oneObj.orderId

        //失效状态
        if(this.readyContent.remarks){
          this.wineAlreadyInvalidStatus(this.readyContent)
        }else{
          this.readyContent.type=this.oneObj.mailType
          this.wineAlreadyOpenStatus(this.readyContent)
        }
      },

      // 修改成已窖藏状态
      wineCollectedStatus(content){
        wineCollected(content).then(response => {
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1500
          })
          this.oneObj={}
          this.waitContent={}
          this.dialogFormVisible1= false
          this.dialogFormVisible2= false
          this.getList()
        })
      },

      // 修改成已启坛状态
      wineAlreadyOpenStatus(content){
        wineAlreadyOpen(content).then(response => {
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1500
          })
          this.dialogFormVisible1= false
          this.dialogFormVisible2= false
          this.oneObj={}
          this.getList()
        })
      },
      // 修改成已失效状态
      wineAlreadyInvalidStatus(content){
        wineAlreadyInvalid(content).then(response => {
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1500
          })
          this.oneObj={}
          this.readyContent={}
          this.dialogFormVisible1= false
          this.dialogFormVisible2= false
          this.dialogFormVisible3 = false
          this.getList()
        })
      },
      handleClose() {
        this.oneObj={};
        this.waitContent={};
        this.readyContent={};
        this.dialogFormVisible1 = false // 关闭dialog
        this.dialogPvVisible = false // 关闭dialog
        this.dialogFormVisible2= false
        this.dialogFormVisible3= false

      },
      reloads(){
        this.refreshLoading = true
        this.getList()
      },
      getList() {
        this.listLoading = true
        wineOrderList(this.listQuery).then(response => {
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
        this.$router.push({path: '/scenery-manage/scenery/add-scenery'})
//        this.$router.push({path: '/news/addNews', query: {id: row.id}})
      },
      showSureDelete(row){
        this.dataObj = row
        this.visibleDelete= true
      },
      handleDeleteNews(row){
        deleteWine({id: this.dataObj.id}).then(response => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.visibleDelete= true
          this.getList()
        })
      },
      // 去修改内容
      handleUpdate(row) {
          debugger
        console.log("详情内容ID:" + row.orderId)
        this.$router.push({path: '/wine-manage/wine-order/wine-order-detail', query: {id: row.orderId}})
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

    }
  }
</script>
