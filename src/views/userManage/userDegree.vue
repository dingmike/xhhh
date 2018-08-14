<template>
  <div class="app-container calendar-list-container">
    <el-table :data="userDegreeList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="等级ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="等级名称">
        <template slot-scope="scope">
          <span>{{scope.row.rankName}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="分红积分">
        <template slot-scope="scope">
          <!--<span>{{scope.row.rankName}}</span>-->
      <!--    <template v-if="scope.row.canEdit">
            <el-input class="edit-input" size="small" v-model="degree.score"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="sureChangeScore(scope.row)">确定</el-button>
          </template>-->
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type='primary' @click="setPrIntegral(scope.row)">设置等级积分
          </el-button>
        </template>
      </el-table-column>
    </el-table>



    <!--设置等级积分 start-->
    <el-dialog v-el-drag-dialog
               title="会员等级积分"
               :visible.sync="dialogVisible3"
               width="40%"
               :before-close="handleClose">
      <el-row>
        <el-col :span="6">
          设置 <el-tag>{{degree.rankName}}</el-tag> 的等级积分:
        </el-col>
        <el-col :span="6" style="padding: 0 5px">
          <el-input-number v-model="degree.score" size="small" controls-position="right" :min="1" :max="1000000"></el-input-number>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="danger" @click="sureChangeScore">确定</el-button>
  </span>
    </el-dialog>
    <!--设置等级积分 end-->
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {
    mgList, // 获取会员等级列表
    setUsermg, //设置会员等级
    setUpmg //设置用户分红积分
  } from '@/api/users'
  export default {
    name: 'createForm',
    directives: {elDragDialog},
//    components: { },
    data() {
      return {
        listLoading: false,
        canEdit: false,
        dialogVisible3:false,
        userDegreeList: [],
        degree:{},
        activeName: 'null',
        createdTimes: 0,
        productName: '',
        refreshLoading: false
      }
    },
    mounted() {
       // alert(this.$route.query.id)
      this.getUserDegrees()
    },
    methods: {
      getUserDegrees(){
        mgList().then(response => {
          debugger
          this.userDegreeList = response.data.data
          for(let i=0; i<this.userDegreeList.length;i++){
              this.userDegreeList[i]['canEdit']=false;
          }

        })
      },

      setPrIntegral(row){
          debugger
          this.degree = row
          this.dialogVisible3 = true
      },
      // 设置会员分红积分
      sureChangeScore(){
        setUpmg({id: this.degree.id, score: this.degree.score}).then(response => {
          console.log('设置等级积分为:' + this.degree.score)
          this.$message({
            message: '设置等级积分成功!',
            type: 'success',
            showClose: true,
            duration: 1000
          })
          this.dialogVisible3 = false
          this.getUserDegrees()
        })
      },
      handleClose(){
       this.dialogVisible3 = false
      }
    }
  }
</script>

