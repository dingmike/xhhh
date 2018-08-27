<template>
  <div class="createPost-container">
    <div class="filter-container">
      <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
    </div>
    <el-form class="form-container" :model="newContent" :rules="rules" ref="postForm" label-width="80px">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告类别" prop="type">
              <!--<el-input v-model="newContent.title"></el-input>-->
              <el-select size="small" v-model="newContent.type" filterable allow-create placeholder="选择类别"
                         @change="renderAddSpec">
                <el-option
                  v-for="item in adCategoryOptions"
                  :key="item.code"
                  :value-key="item.code"
                  :label="item.message"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告内容" prop="pId">
              <!--<el-input v-model="newContent.title"></el-input>-->
              <el-select size="small" v-model="newContent.pId" filterable allow-create placeholder="选择对应内容"
                         @change="chooseContent">
                <el-option
                  v-for="item in adContentOptions"
                  :key="item.id"
                  :value-key="item.title!=null?item.title:item.name"
                  :label="item.title!=null?item.title:item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
    <!--    <el-form-item label="新闻内容" prop="content">
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="newContent.content"></tinymce>
        </div>
        </el-form-item>-->
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item  label="封面图" prop="imgUrl">
              <!--上传图片多图-->
              <div style="margin-bottom: 6px;">
                <Upload v-model="newContent.imgUrl" :crop-width="500"  :crop-height="200" ></Upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <span style="color: red; font-size: 14px">*建议图片宽高尺寸为5：2  如：1380 * 600，大小不超过1M</span>
          </el-col>
        </el-row>

        <el-row style=" float: right">
          <el-button type="warning" @click="goBack">返回</el-button>
          <el-button type="primary" :loading="false" @click="saveNews">确认发布</el-button>
          <!--<el-button type="primary" v-if="newId" :loading="false" @click="saveNews">确认修改</el-button>-->
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
//  import Upload from '@/components/Upload/mutilImage'
//  import UploadSingle from '@/components/Upload/oneImage'
  import MDinput from '@/components/MDinput'
  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {validateURL} from '@/utils/validate'
    import {saveAndUpdateNews,getNewsById} from '@/api/news'
  import {fetchGoodDetail} from '@/api/goods'
  import {userSearch} from '@/api/remoteSearch'
  import {fetchGoodsList, searchGoods, downUpGoods, getSpecifications, getSpecValue} from '@/api/goods'
  import {adCategoryList, categoryLevel, saveAd} from '@/api/ad'
  import Upload from '@/components/ImgCropper/oneCropimage'

  const defaultNews={
    "id": '',
    "pId": "",
    "imgUrl": "",
    "type": "" //
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
    components: {Tinymce, MDinput, Multiselect, Sticky, Upload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    mounted() {

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
        adCategoryOptions:[],
        adContentOptions:[],
        rules: {
          type: [
            {required: true, message: '请选择分类', trigger: 'blur'},
          ],
          pId: [
            {required: true, message: '请选择内容', trigger: 'blur'},
          ],
          imgUrl: [
            {required: true, message: '请上传封面图', trigger: 'blur'},
          ]
        }
      }
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
        this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
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
        this.getAdCategoryList()
        this.newContent = Object.assign({}, defaultNews)

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

//
    },
    methods: {
      submitNews(){
        saveAd(this.newContent).then(response => {
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
        getNewsById({id:this.$route.query.id}).then(response => {
          this.newContent = response.data.data
        })
      },
      renderAddSpec(code){
        this.getCategoryLevel(code)
      },
      chooseContent(){

      },
      // 分类列表
      getAdCategoryList(){
        adCategoryList().then(response => {
          this.adCategoryOptions = response.data.data
        })
      },
      // 分类下的内容
      getCategoryLevel(code){
        categoryLevel({type: code}).then(response => {
          this.adContentOptions = response.data.data
        })
      },
      submitForm() {
        this.postForm.display_time = parseInt(this.display_time / 1000)
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      },
      showPopover(index) {

      },
      handleSelectionChange() {

      },
      handleCheckedCategoryChange() {

      },
      goBack(){
        this.$router.push({path: '/ad-place/ad-list'})
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
