<template>
  <div class="createPost-container">
    <div class="filter-container">
      <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
    </div>
    <el-form class="form-container" :model="sceneryContent" :rules="rules" ref="postForm" label-width="120px">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编号：" prop="name">
              <span>{{sceneryContent.orderId}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="会员账号：" prop="name">
              <span>{{sceneryContent.phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="订单状态：" prop="name">
              <span>{{sceneryContent.orderStatusName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="数量：" prop="name">
              <span>{{sceneryContent.number}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="种酒名称：" prop="name">
              <span>{{sceneryContent.liquorProductName}}</span>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="种酒类别：" prop="name">
              <span>{{sceneryContent.liquorCategoryName}}</span>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="支付现金余额：" prop="name">
              <span>{{sceneryContent.payMoney}} 元</span>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="总酒量：" prop="name">
              <span>{{sceneryContent.specs}}（kg）</span>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="下单时间：" prop="name">
              <span>{{sceneryContent.creatTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="启坛时间：" prop="name">
              <span>{{sceneryContent.openTime==null?'无': sceneryContent.openTime| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="窖藏编号：" prop="name">
              <span>{{sceneryContent.cellarNumber==null?'无':sceneryContent.cellarNumber}}</span>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="提货方式：" prop="name">
              <span>{{sceneryContent.mailType==1?'自提':'快递'}}</span>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="快递编号：" prop="name">
              <span>{{sceneryContent.expressNumber==null?'无':sceneryContent.expressNumber}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="失效原因：" prop="name">
              <span>{{sceneryContent.remarks==null?'无':sceneryContent.remarks}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import VueCropper from 'vue-cropper'
//  import Upload from '@/components/ImgCropper/mutilImage'
  import Upload from '@/components/ImgCropper/mutilCropimage'
//  import UploadSingle from '@/components/Upload/oneImage'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {validateURL} from '@/utils/validate'
    import {saveAndUpdateNews,getNewsById} from '@/api/news'
    import {wineClassifyList, saveWine, wineDetail, deleteWineClassify, wineOrderDetail} from '@/api/wine'
  import {fetchGoodDetail} from '@/api/goods'
  import {userSearch} from '@/api/remoteSearch'
  import {
    parkList,
    saveSightSpot,
    getSpotDetail,
    selectParkScenery
  } from '@/api/scenery'
  import {fetchGoodsList, searchGoods, downUpGoods, getSpecifications, getSpecValue} from '@/api/goods'

  import UE from '@/components/Ue/ue.vue';

  const defaultNews={
    "id": '',
    "title": "",
    "content": "",
    "type": 1 // 咨询
  }
  const sceneryContent={
    id: "",
    name: "",
    standard:"",
    money: "",
    largessIntegral: "",
    img: "",
    imgDesc: "",
    context: "",
//    type: "",
    liquorCategory: ""
//    cellarNumber: "",
  }
  const defaultForm = {
    status: 'draft',
    goods_brief: '', // 商品卖点介绍
    name: '', // 商品标题
    goods_desc: '', // 商品详情
    content_short: '', // 文章摘要
    source_uri: '', // 文章外链
    newContent:{},
    gallery: [{
      "name": "",
      "url": "http://yanxuan.nosdn.127.net/355efbcc32981aa3b7869ca07ee47dac.jpg"
    },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/43e283df216881037b70d8b34f8846d3.jpg"
      },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/12e41d7e5dabaf9150a8bb45c41cf422.jpg"
      },
      {
        "name": "",
        "url": "http://yanxuan.nosdn.127.net/5c1d28e86ccb89980e6054a49571cdec.jpg"
      }],
    source_name: '', // 文章外部作者
    display_time: undefined, // 前台展示时间
    id: undefined,
    product_specs_prices: [], // 价格
    platforms: ['a-platform'],
    comment_disabled: false
  }

  export default {
    name: 'articleDetail',
    components: {Tinymce, MDinput, Multiselect,Upload, Sticky, VueCropper, UE},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.getWineCategory()
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        ue1: "ue1", // 不同编辑器必须不同的id
        listQuery: {
          page: 1,
          size: 50,
          level: 1 // 1园区
        },
        listQuery2: {
          page: 1,
          size: 50,
          pId:''
        },
        sceneryImgArr:[],
        sceneryImgArr2:[],
        wineCategoryOptions: [],
        sceneryContent: Object.assign({}, sceneryContent),
        newContent: Object.assign({}, defaultNews),
        newId: '',
        postForm: Object.assign({}, defaultForm),
        fetchSuccess: true,
        loading: false,
        visible2: false,
        setAttributeImg: false,
        isShow: false,
        isShowValue: false,
        disableValue: false,
        rules: {
          liquorCategory: [
            {required: true, message: '请选择种酒分类', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入种酒名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请输入价格', trigger: 'change'}
          ],
          largessIntegral: [
            {required: true, message: '请输入积分', trigger: 'change'}
          ],
          standard: [
            {required: true, message: '请输入单笔酒量', trigger: 'change'}
          ],

          img: [
            {required: true, message: '请上传景点主图', trigger: 'change'}
          ],
          imgDesc: [
            {required: true, message: '请输入详情介绍', trigger: 'blur'},
            {min: 3, max: 5000, message: '长度在 3 到 5000 个字符', trigger: 'blur'}
          ],
          context: [
            {required: true, message: '请输入须知', trigger: 'blur'},
            {min: 3, max: 2000, message: '长度在 3 到 1000 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      // 表格数据
      tableData() {

        let arr = this.specPrices
        let tableData = {data: arr}
        return tableData
      },
      // 规格表头数据
      tableThead() {
        let specs = this.postForm.specificationList
        let arr = []
        for (let i = 0; i < specs.length; i++) {
          arr.push(specs[i].name)
        }
        return specs
      }
    },
    created() {
      if (this.isEdit) {
debugger
        this.newId = this.$route.query.id
        this.fetchNewsContent()
      } else {
        this.sceneryContent = Object.assign({}, sceneryContent)
      }
      this.specs = []
      this.specPrices = []

      if (this.specs.length == 0) {
        // 初始化规格数据
        let obj = {}
        obj.type = "";
        obj.children = []
        this.specs.push(obj)


        let _obj = [{}]
        _obj[0].goods_specification_ids = ''
        _obj[0].prices = {
          goods_number: 0,
          retail_price: 0,
          pic_url: ''
        }

        this.specPrices = _obj
      }
    },
    methods: {
      getWineCategory(){
        wineClassifyList(this.listQuery).then(response => {
          this.wineCategoryOptions = response.data.data.content
          this.loading = false
          this.listLoading = false
        })
      },
      submitNews(){
        saveWine(this.sceneryContent).then(response => {
          this.$notify({
            title: '提示',
            message: '数据提交成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        })
      },
      saveNews() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.submitNews()
          } else {
            console.log('err!')
            return false
          }
        })
      },
      fetchNewsContent(){
        wineOrderDetail({orderId:this.$route.query.id}).then(response => {
          this.sceneryContent = response.data.data
          // 编辑修改
         /* this.sceneryImgArr=this.sceneryContent.img.split(',')
          for(let i=0; i<this.sceneryImgArr.length;i++){
            let obj={name:'tupian.png', url:this.sceneryImgArr[i]}
            this.sceneryImgArr2.push(obj)
          }*/
        })
      },
      showPopover(index) {

      },
      handleSelectionChange() {

      },
      handleCheckedCategoryChange() {

      },
      goBack(){
        this.$router.push({path: '/wine-manage/wine-order/wine-order-list'})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .title-prompt {
    position: absolute;
    right: 0;
    font-size: 12px;
    top: 10px;
    color: #ff4949;
  }

  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
      .form_divider {
        border-top: 1px solid #c5c5c5;
        margin: 15px 0;
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0;
    }
  }

  .delete-spec {
    position: relative;
    top: -64px;
    cursor: pointer;
  }

  .delete-spec-box {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }
  .filter-container {
    padding: 24px 0 0 24px;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }
  }

</style>
