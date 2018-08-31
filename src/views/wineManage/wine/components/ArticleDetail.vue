<template>
  <div class="createPost-container">
    <div class="filter-container">
      <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
    </div>
    <el-form class="form-container" :model="sceneryContent" :rules="rules" ref="postForm" label-width="110px">
      <div class="createPost-main-container">

        <el-row>
          <el-col :span="12">
            <el-form-item  label="种酒类别" prop="liquorCategory">
              <el-select size="small" v-model="sceneryContent.liquorCategory" filterable placeholder="选择种酒类别">
                <el-option
                  v-for="item in wineCategoryOptions"
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
            <el-form-item label="种酒名称" prop="name">
              <el-input v-model="sceneryContent.name"></el-input>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item  label="单笔酒量(kg)" prop="standard">
              <el-input-number v-model="sceneryContent.standard" controls-position="right"  :precision="2" :step="0.1" :min="0" :max="1000000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="赠送分红积分" prop="largessIntegral">
              <el-input-number v-model="sceneryContent.largessIntegral" controls-position="right"  :precision="2" :step="0.1" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="单笔窖酒价格" prop="money">
              <el-input-number v-model="sceneryContent.money" controls-position="right"  :precision="2" :step="0.1" :min="0" :max="10000000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="酒品须知" prop="context">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入须知"
              v-model="sceneryContent.context">
            </el-input>
            </el-form-item>
          </el-col>
        </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item  label="种酒主图" prop="img">
          <!--上传图片多图-->
          <div style="margin-bottom: 6px;">
            <Upload v-model="sceneryContent.img" :file-lists="sceneryImgArr2" ></Upload>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span style="color: red; font-size: 14px">（最多9张图片，建议图片宽高比例为  5：3  如： 1500 * 900 ，单张图片不超过2M）</span>
        </el-col>
      </el-row>

        <el-row>
        <el-form-item label="种酒详情" prop="imgDesc">
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="sceneryContent.imgDesc"></tinymce>
        </div>
        </el-form-item>
        </el-row>

      <!--  <el-row>
        <el-form-item :label="sceneryContent.inOut==0?'景点介绍2':'众筹介绍2'" prop="spotDetails">
        <div class="editor-container">

          <UE :defaultMsg="sceneryContent.spotDetails" :config="config" :id="ue1" ref="ue"></UE>
          {{sceneryContent.spotDetails}}
        </div>

        </el-form-item>
        </el-row>-->
        <el-row style=" float: right">
          <el-button type="warning" @click="goBack">返回</el-button>
          <el-button type="primary" v-if="!newId" :loading="false" @click="saveNews">确认发布</el-button>
          <el-button type="primary" v-if="newId" :loading="false" @click="saveNews">确认修改</el-button>
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
    import {wineClassifyList, saveWine, wineDetail, deleteWineClassify} from '@/api/wine'
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
            {min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur'}
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
        wineDetail({id:this.$route.query.id}).then(response => {
          this.sceneryContent = response.data.data
          // 编辑修改
          this.sceneryImgArr=this.sceneryContent.img.split(',')
          for(let i=0; i<this.sceneryImgArr.length;i++){
            let obj={name:'tupian.png', url:this.sceneryImgArr[i]}
            this.sceneryImgArr2.push(obj)
          }
        })
      },
      showPopover(index) {

      },
      handleSelectionChange() {

      },
      handleCheckedCategoryChange() {

      },
      goBack(){
        this.$router.push({path: '/wine-manage/wine/wine-list'})
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
