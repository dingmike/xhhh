<template>
  <div class="app-container calendar-list-container">
    <el-row v-if="!total">
      <el-col :span="4">
        <span class="down-box">该园区下没有景点</span>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" size="middle" @click="deleteParks">删除园区</el-button>
      </el-col>
    </el-row>
    <el-table v-if="total" :data="list" border fit
              highlight-current-row
              show-header
              size="middle"
              tooltip-effect="dark"
              v-loading="listLoading"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="30px">
      </el-table-column>
      <!--<el-table-column align="center" label="会员ID" width="80px" v-loading="loading"
                       element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <div class="good-pic-head">
            <img :src="scope.row.id" @click="showBigImg(scope.row)">
          </div>
        </template>
      </el-table-column>-->
      <el-table-column width="80" align="center" label="景区ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="景区名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="400px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDeleteBox(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

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


    <!--删除弹窗2 start-->
    <el-dialog v-el-drag-dialog
               title="删除数据"
               :visible.sync="visibleDelete2"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">确定删除园区数据吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleDelete2 = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteParks">确定</el-button>
      </span>
    </el-dialog>
    <!--删除弹窗2 end-->


  </div>


</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {selectParkScenery, deletePark} from '@/api/scenery'
  import {
    recharge, // 会员充值
    enableUser,
    disableUser,
    mgList, // 获取会员等级列表
    setUsermg, //设置会员等级
    setUpmg, //设置用户分红积分
    fetchUsersList,
    searchGoods,
    downUpGoods,
    deleteGoods,
    updateHotStateGoods
  } from '@/api/users'

  export default {
    directives: {elDragDialog},
    props: {
      type: {
        type: String,
        default: ''
      },
      reload: {
        type: Boolean,
        default: false
      },

    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        dialogImageUrl: '',
        formLabelWidth: '120px',
        visibleDelete: false,
        visibleDelete2: false,
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,

        iceUserObj: {},
        dataObj: {
            id:''
        },
        userDegreeList: [],
        multipleSelection: [],
        listQuery: {
          page: 1,
          size: 10,
          pId:this.type
        },
        loading: false
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
      }
    },
    mounted() {
      this.getList()
    },
    created() {
//      this.getList()
    },
    methods: {
      deleteParks(){
            this.visibleDelete2 =true
        },
      handleDeleteParks(){
          console.log("删除园区：" +this.type)
        deletePark({id: this.type}).then(response => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.visibleDelete2 =false
          this.getList()
          this.$emit('refreshLoading', true)
        })
      },
      getList() {
        this.loading = true
//        this.$emit('create') // for test
//        this.$emit('refreshLoading', true)
        selectParkScenery(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.data.length
          this.loading = false
          this.listLoading = false
          this.$emit('refreshLoading', false)
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleClose() {
        this.visibleDelete = false
        this.dialogVisible = false // 关闭dialog
        this.dialogVisible2 = false // 关闭dialog
        this.dialogVisible3 = false // 关闭dialog
        this.dialogVisible4 = false // 关闭dialog
        this.visibleDelete2 = false // 关闭dialog
      },
      showDialog(row) {
        this.dialogVisible2 = true
        this.goodsObj = row
      },
      showDeleteBox(row){
        this.dataObj = row
        this.visibleDelete = true
      },
      // 删除景区
      handleDeleteNews(){
        deletePark({id: this.dataObj.id}).then(response => {
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
    }
  }
</script>

<style scoped>
  .good-pic-head {
    width: 60px;
    height: 60px;
    text-align: center;
    border: 1px solid #cccccc;
    cursor: pointer;
  }

  .good-pic-head img {
    width: 100%;
    text-align: center;
  }

  .visible-pic-box {
    height: 100%;
  }

  .down-box {
    height: 40px;
    line-height: 40px;
  }

  .goods-name {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
  }

  .edit-good-icon {
    font-size: 22px;
    cursor: pointer;
    color: #000;
    vertical-align: middle;
    padding: 0 10px;
  }
</style>
