<template>
  <div class="app-container calendar-list-container">
    <el-table :data="list" border fit
              highlight-current-row
              show-header
              size="middle"
              tooltip-effect="dark"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
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
      <el-table-column width="80" align="center" label="会员ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="会员账号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="会员等级">
        <template slot-scope="scope">
          <!--<span>{{scope.row.rank === 1?'在架状态' : '下架状态'}}</span>-->
          <span>{{scope.row.rankString}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.type == 1 ? "禁用" : "启用"}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="激活状态">
        <template slot-scope="scope">
          <span>{{scope.row.status == 1 ? "激活" : "冻结"}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="现金余额(元)">
        <template slot-scope="scope">
          <span>{{scope.row.cashBalance}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="分红积分">
        <template slot-scope="scope">
          <span>{{scope.row.prIntegral}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="消费积分">
        <template slot-scope="scope">
          <span>{{scope.row.cpIntegral}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="团队业绩（元）">
        <template slot-scope="scope">
          <span>{{scope.row.teamMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="总消费额（元）">
        <template slot-scope="scope">
          <span>{{scope.row.consumptionMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUserCharge(scope.row)">充值</el-button>
          <!--<i class="el-icon-edit edit-good-icon" @click="handleEdit(scope.row)"></i>-->
          <!-- <el-button size="mini" type='primary' @click="showSetRank(scope.row)">设置等级
           </el-button>-->
          <!--  <el-button size="mini" :type="scope.row.is_on_sale === 1 ? 'warning' : 'success'" @click="showDialog(scope.row)">{{scope.row.is_on_sale === 1?'下架':'上架'}}
           </el-button>-->

          <el-button size="mini" :type="scope.row.type == 1 ? 'warning' : 'danger'" @click="showIceUser(scope.row)">
            {{scope.row.type === 1 ? '启用账户' : '禁用账户'}}
          </el-button>
          <el-button size="mini" :type="scope.row.status == 1 ? 'warning' : 'danger'" @click="showActiveUser(scope.row)">
            {{scope.row.status === 1 ? '冻结账户' : '激活账户'}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--冻结账户弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="账户冻结操作"
               :visible.sync="dialogVisible2"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">真的需要{{iceUserObj.type == 1 ? "启用账户 " : "禁用账户 "}}&nbsp;<el-tag>{{iceUserObj.phone}}</el-tag>&nbsp;吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleIceUser">确定</el-button>
      </span>
    </el-dialog>
    <!--冻结账户 end-->
    <!--激活账户弹窗 start-->
    <el-dialog v-el-drag-dialog
               title="账户激活操作"
               :visible.sync="dialogVisible4"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">真的需要{{iceUserObj.status == 1 ? "冻结账户 " : "激活账户 "}}&nbsp;<el-tag>{{iceUserObj.phone}}</el-tag>&nbsp;吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="handleActiveUser">确定</el-button>
      </span>
    </el-dialog>
    <!--激活账户 end-->

    <!--用户充值 start-->
    <el-dialog v-el-drag-dialog
               title="用户充值"
               :visible.sync="dialogVisible3"
               width="30%"
               center
               :before-close="handleClose">
      <el-row>
        <el-col :span="6">
          充值账号:
        </el-col>
        <el-col :span="6">
          <el-tag>{{iceUserObj.phone}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin:20px 0">
        <el-col :span="6">
          充值类型:
        </el-col>
        <el-col :span="6">
          <el-select size="small" v-model="chargeObj.rechargeType" filterable placeholder="充值类型">
            <el-option
              v-for="item in rechargeTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          充值金额:
        </el-col>
        <el-col :span="6">
          <el-input-number v-model="chargeObj.money" size="small" controls-position="right" :min="1"
                           :max="1000000"></el-input-number>
        </el-col>
      </el-row>
      <el-row style="margin:20px 0">
        <el-col :span="6">
          登录密码:
        </el-col>
        <el-col :span="6">
          <el-input size="small" type="password" v-model="chargeObj.password" auto-complete="off"
                    :maxlength="10"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="danger" @click="rechargeUser">确认</el-button>
      </span>
    </el-dialog>
    <!--用户充值 end-->
  </div>


</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {
    recharge, // 会员充值
    enableUser,
    disableUser,
    mgList, // 获取会员等级列表
    setUsermg, //设置会员等级
    setUpmg, //设置用户分红积分
    isActivationUser,
    notActivationUser,
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
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        iceUserObj: {},
        chargeObj: {
          id: '',
          rechargeType: '',
          money: '',
          password: ''
        },
        userDegreeList: [],
        rechargeTypes: [
          {id: 1, name: "现金余额"},
          {id: 2, name: "分红积分"},
          {id: 3, name: "消费积分"},
        ],
        goodsObj: {
          name: '',
          id: '',
          is_hot: '',
          is_limited: '',
          is_on_sale: '',
          primary_pic_url: '',
          retail_price: '',
          sell_volume: '',
          sort_order: '',
        },
        multipleSelection: [],
        listQuery: {
          page: 1,
          size: 10,
//          isOnSale: this.type  // 全部:''，在架：1，下架：0
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
//      this.getUserDegrees()
    },
    created() {
//      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
//        this.$emit('create') // for test
//        this.$emit('refreshLoading', true)
        fetchUsersList(this.listQuery).then(response => {
          debugger
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
//          this.loading = false
          this.listLoading = false
          this.$emit('refreshLoading', false)
        })
      },
      handlesearchGoods(query) {
        debugger
        this.loading = true
        searchGoods(query).then(response => {
          debugger
          this.list = response.data.data.data
          this.total = response.data.data.count
          this.loading = false
          this.listLoading = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      showBigImg(row) {
        this.goodsObj = row
        this.dialogVisible = true
      },
      handleEdit(row) {
        // 编辑商品跳转
        this.$router.push({path: '/editProduct/index', query: {id: row.id}})
        // this.$route.query.row.xxx 获取参数

      },
      showUserCharge(row) {
        this.chargeObj ={
          id: '',
          rechargeType: '',
          money: '',
          password: ''
        }
        this.iceUserObj = row
        this.dialogVisible3 = true
      },
      handleClose() {
        this.dialogVisible = false // 关闭dialog
        this.dialogVisible2 = false // 关闭dialog
        this.dialogVisible3 = false // 关闭dialog
        this.dialogVisible4 = false // 关闭dialog
      },
      showDialog(row) {
        this.dialogVisible2 = true
        this.goodsObj = row
      },
      showIceUser(row){
        debugger
        this.dialogVisible2 = true
        this.iceUserObj = row
      },
      showActiveUser(row){
        this.dialogVisible4 = true
        this.iceUserObj = row
      },
      handleActiveUser() {
          debugger
        // 激活和不激活用户
        if (this.iceUserObj.status == 0) {
          isActivationUser({id: this.iceUserObj.id}).then(response => {
            console.log('激活')
            this.dialogVisible4 = false;
            this.$notify({
              title: '成功',
              message: '激活成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {// 冻结
          notActivationUser({id: this.iceUserObj.id}).then(response => {
            console.log('冻结')
            this.dialogVisible4 = false;
            this.$notify({
              title: '成功',
              message: '冻结成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      },
      handleIceUser() {
        // 解冻和冻结用户
        // 解冻
        if (this.iceUserObj.type == 1) {
          enableUser({id: this.iceUserObj.id}).then(response => {
            console.log('启用')
            this.dialogVisible2 = false;
            this.$notify({
              title: '成功',
              message: '启用成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {// 冻结
          disableUser({id: this.iceUserObj.id}).then(response => {
            console.log('禁用')
            this.dialogVisible2 = false;
            this.$notify({
              title: '成功',
              message: '禁用成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      },
      // 设置会员等级
      setRank(){
        setUsermg({id: this.iceUserObj.id, rank: this.iceUserObj.rank}).then(response => {
          console.log('设置会员等级为:' + this.iceUserObj.rank)
          this.$message({
            message: '设置会员等级成功!',
            type: 'success',
            showClose: true,
            duration: 1000
          });
//          this.getList()
        })
      },
      // 用户充值
      rechargeUser(){
        this.chargeObj.id = this.iceUserObj.id
        console.log("给用户充值 :" + this.chargeObj)
        recharge(this.chargeObj).then(response => {
          this.$message({
            message: '充值成功!',
            type: 'success',
            showClose: true,
            duration: 1000
          });
          this.dialogVisible3 = false;
          this.getList()
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
