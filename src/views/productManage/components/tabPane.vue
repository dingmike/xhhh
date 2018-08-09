<template>
  <div class="app-container calendar-list-container">
    <el-table :data="list" border fit
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
      <el-table-column align="center" label="商品图" width="80px" v-loading="loading"
                       element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <div class="good-pic-head">
            <img :src="scope.row.primary_pic_url" @click="showBigImg(scope.row)">
          </div>
        </template>
      </el-table-column>

      <el-table-column width="240" align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="价格（元）">
        <template slot-scope="scope">
          <!--<span>{{scope.row.title}}</span>-->
          <el-tag>{{scope.row.retail_price}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.is_on_sale === 1?'在架状态' : '下架状态'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="HOT产品">
        <template slot-scope="scope">
          <!--<span>{{scope.row.is_hot === 1?'是的' : '不是'}}</span>-->
          <i v-show="scope.row.is_hot == 1" class="el-icon-success" style="color: red; font-size: 22px"  @click="updateHotGood(scope.row)"></i>
          <i v-show="scope.row.is_hot == 0" class="el-icon-success" style="color: #cccccc; font-size: 22px"  @click="updateHotGood(scope.row)"></i>

        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="库存">
        <template slot-scope="scope">
          <span>{{scope.row.goods_number}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="销量">
        <template slot-scope="scope">
          <span>{{scope.row.sell_volume}}</span>
          <!--<svg-icon v-for="n in +scope.row.importance" icon-class="star" :key="n"></svg-icon>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="300px">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
          <i class="el-icon-edit edit-good-icon" @click="handleEdit(scope.row)"></i>
         <!-- <el-button size="mini" :type="scope.row.is_on_sale === 1 ? 'warning' : 'success'" @click="showDialog(scope.row)">{{scope.row.is_on_sale === 1?'下架':'上架'}}
          </el-button>-->
          <el-button v-show="scope.row.is_on_sale === 1" size="mini" type='warning' @click="showDialog(scope.row)">下架
          </el-button>
          <el-button type="success" v-show="scope.row.is_on_sale === 0" size="mini" @click="handleUpProduct(scope.row)">
            上架
          </el-button>
          <el-button type="danger" size="mini"  @click="showDeletDialog(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </div>

    <el-dialog v-el-drag-dialog
      title="商品下架确认"
      :visible.sync="dialogVisible2"
      width="40%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">商品下架后，买家将无法在店铺中找到该商品。确定下架以下商品？</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="good-pic-head">
          <img :src="goodsObj.primary_pic_url">
        </el-col>
        <el-col :span="20">
          <span class="goods-name">{{goodsObj.name}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="handleDownUpProduct(goodsObj)">确认下架</el-button>
  </span>
    </el-dialog>


    <el-dialog v-el-drag-dialog
      title="商品删除确认"
      :visible.sync="dialogVisible3"
      width="40%"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <span class="down-box">商品删除后不可恢复，买家将无法在店铺中找到该商品。确定删除以下商品？</span>
        </el-col>
      </el-row>
      <el-row style="background: #ffe6e6;border: 1px solid #ffbebe">
        <el-col :span="4" class="good-pic-head">
          <img :src="goodsObj.primary_pic_url">
        </el-col>
        <el-col :span="20">
          <span class="goods-name">{{goodsObj.name}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="danger" @click="handleDeleteGoods(goodsObj)">确认删除</el-button>
  </span>
    </el-dialog>


<!--更新商品hot状态-->
    <el-dialog v-el-drag-dialog title="修改商品HOT状态" :visible.sync="dialogVisible4" width="40%">

      <el-form>
        <el-form-item :label-width="formLabelWidth">
          <el-row>
            <el-col :span="4" class="good-pic-head">
              <img :src="goodsObj.primary_pic_url">
            </el-col>
            <el-col :span="20">
              <span class="goods-name">{{goodsObj.name}}</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品目前状态：" :label-width="formLabelWidth">
          <i v-show="goodsObj.is_hot == 1" class="el-icon-success" style="color: red; font-size: 22px"></i>
          <i v-show="goodsObj.is_hot == 0" class="el-icon-success" style="color: #cccccc; font-size: 22px"></i>
        </el-form-item>
        <el-form-item label="修改HOT状态：" :label-width="formLabelWidth">
          <!--<el-radio-group v-model="goodsObj.is_hot" size="mini">-->
            <el-radio v-model="goodsObj.is_hot" label="1" border>HOT</el-radio>
            <el-radio v-model="goodsObj.is_hot" label="0" border>NOT HOT</el-radio>
          <!--</el-radio-group>-->
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="updateHotState(goodsObj)">确 定</el-button>
      </div>
    </el-dialog>

    <!--放大图片-->
     <el-dialog width="40%" :visible.sync="dialogVisible" v-el-drag-dialog>
             <div style="width: 100%; height:100%">
               <img width="100%" :src="goodsObj.primary_pic_url">
             </div>
     </el-dialog>
  </div>


</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import {fetchGoodsList, searchGoods, downUpGoods, deleteGoods, updateHotStateGoods} from '@/api/goods'

  export default {
    directives: { elDragDialog },
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
          isOnSale: this.type  // 全部:''，在架：1，下架：0
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
      getList() {
        debugger
        this.loading = true
//        this.$emit('create') // for test
//        this.$emit('refreshLoading', true)
        fetchGoodsList(this.listQuery).then(response => {
          debugger
          this.list = response.data.data.data
          this.total = response.data.data.count
          this.loading = false
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
        this.multipleSelection = val;
      },
      showBigImg(row) {
        this.goodsObj = row
        this.dialogVisible = true
      },
      handleEdit(row) {
debugger
        // 编辑商品跳转
        this.$router.push({path: '/editProduct/index',query:{id: row.id}})
        // this.$route.query.row.xxx 获取参数


      },
      // 上架产品
      handleDownUpProduct(row) {
        debugger
        console.log('goods info: ' + row)
        if(row.is_on_sale === 1){
          row.is_on_sale = 0
        }else{
          row.is_on_sale = 1
        }
        console.log('is on sale : ' + row.is_on_sale)
        let params = {id: row.id, isOnSale: row.is_on_sale}
        debugger
        this.loading = true
        downUpGoods(params).then(response => {
          debugger
          if(response.data.errno === 0 && response.data.data === 1){
            this.getList()
//          this.list = response.data.data.data
//          this.total = response.data.data.count
            this.loading = false
            this.listLoading = false
            this.dialogVisible2 = false // 关闭dialog
            this.$message({
              message: '下架成功！',
              type: 'success'
            });
          }else{
            this.$message({
              message: '下架失败！',
              type: 'warning'
            });
          }

        })

      },
      // 下架产品
      handleUpProduct(row) {
        let params = {id: row.id, isOnSale: 1}
        downUpGoods(params).then(response => {
          debugger

          if(response.data.errno === 0 && response.data.data === 1){
            this.getList()
//          this.list = response.data.data.data
//          this.total = response.data.data.count
            this.loading = false
            this.listLoading = false
            this.dialogVisible2 = false // 关闭dialog
            this.$message({
              message: '上架成功！',
              type: 'success'
            });
          }else{
            this.$message({
              message: '上架失败！',
              type: 'warning'
            });
          }

        })
      },
      showDeletDialog(row) {
        this.goodsObj = row
        this.dialogVisible3 = true
      },
      handleDeleteGoods(row) {
        let params = {id: row.id, isOnSale: 1}
        deleteGoods(params).then(response => {
          debugger
          this.getList()
//          this.list = response.data.data.data
//          this.total = response.data.data.count
          this.loading = false
          this.listLoading = false
          this.dialogVisible3 = false // 关闭dialog
        })
      },
      updateHotGood(row) {
        this.goodsObj = row
        console.log('this goods: ' + this.goodsObj.is_hot)
        this.dialogVisible4 = true;
      },
      updateHotState(row) {
debugger
        let params = {id: row.id, isHot: row.is_hot}
        updateHotStateGoods(params).then(response => {
            debugger
          if(response.data.errno === 0 && response.data.data === 1){
            this.getList()
            this.loading = false
            this.listLoading = false
            this.dialogVisible4 = false // 关闭dialog
            this.$message({
              message: '更新成功！',
              type: 'success'
            });
          }else{
            this.$message({
              message: '更新失败！',
              type: 'warning'
            });
          }

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
      handleClose() {
        this.dialogVisible = false // 关闭dialog
        this.dialogVisible2 = false // 关闭dialog
        this.dialogVisible3 = false // 关闭dialog
        this.dialogVisible4 = false // 关闭dialog
      },
      showDialog(row) {
        this.dialogVisible2 = true
        this.goodsObj = row
      }
    }
  }
</script>

<style scoped>
  .good-pic-head{
    width: 60px;
    height:60px;
    text-align: center;
    border: 1px solid #cccccc;
    cursor: pointer;
  }
  .good-pic-head img{
    width: 100%;
    text-align: center;
  }
  .visible-pic-box{
    height: 100%;
  }
  .down-box{
    height: 40px;
    line-height: 40px;
  }
  .goods-name{
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
  }
  .edit-good-icon{
    font-size: 22px;
    cursor: pointer;
    color: #000;
    vertical-align: middle;
    padding: 0 10px;
   }
</style>
