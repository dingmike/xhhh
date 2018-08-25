<template>
  <div class="createPost-container">
    <div class="filter-container">
      <el-button class="filter-item" type="warning" @click="goBack">返回</el-button>
    </div>
    <el-form class="form-container" :model="sceneryContent" :rules="rules" ref="postForm" label-width="120px">
      <div class="createPost-main-container">
  <!--      <el-row>
          <el-col :span="12">
            <el-form-item  label="是否众筹" prop="inOut">
              &lt;!&ndash; <el-switch
                 v-model="sceneryContent.inOut"
                 active-text="是众筹项目"
                 inactive-text="不是众筹项目"
                 active-value="1"
                 inactive-value="0">
               </el-switch>&ndash;&gt;

              <el-radio-group @change="changeZong" v-model="sceneryContent.inOut" size="mini">
                <el-radio :label="1" border>是众筹项目</el-radio>
                <el-radio :label="0" border>不是众筹项目</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目景点名称" prop="name">
              <el-input v-model="sceneryContent.name"></el-input>
            </el-form-item>

          </el-col>
        </el-row>
       <!-- <el-row>
          <el-col :span="12">
          <el-form-item label="开放时间" prop="openTime">
            <el-input v-model="sceneryContent.openTime"></el-input>
          </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item  label="选择园区" prop="pId">
              <el-select size="small" @change="changeSights" v-model="sceneryContent.pId" filterable placeholder="选择园区">
                <el-option
                  v-for="item in parksOptions"
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
            <el-form-item  label="选择项目景区" prop="sightCategory">
              <el-select size="small" :clearable="true" v-model="sceneryContent.sightCategory" ref="clearSelect" filterable placeholder="选择项目景区">
                <el-option
                  v-for="item in sightOptions"
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
            <el-form-item label="众筹须知" prop="notes">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入须知"
              v-model="sceneryContent.notes">
            </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item  label="众筹资金" prop="money">
              <el-input-number v-model="sceneryContent.money" controls-position="right"  :precision="2" :step="0.1" :max="1000000000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item  label="营业状态" prop="status">
              <el-select v-model="sceneryContent.status" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <span style="color: red;">*状态为已营业的项目所在用户会享受分红。</span>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item  label="项目景点主图" prop="masterImg">
          <!--上传图片多图-->
          <div style="margin-bottom: 6px;">
            <Upload v-model="sceneryContent.masterImg" :file-lists="sceneryImgArr2" ></Upload>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span style="color: red; font-size: 14px">（最多9张图片，建议图片宽高比例为  5：3  如： 1500 * 900 ，单张图片不超过2M）</span>
        </el-col>
      </el-row>

        <el-row>
        <el-form-item label="众筹介绍" prop="spotDetails">
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="sceneryContent.spotDetails"></tinymce>

          <!--<quillor  v-model="sceneryContent.spotDetails"></quillor>-->

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
        <el-row style="float: right">
          <el-button type="warning" @click="goBack">返回</el-button>
          <el-button type="primary" v-if="!newId" :loading="false" @click="saveNews">确认发布</el-button>
          <el-button type="primary" v-if="newId" :loading="false" @click="saveNews">确认修改</el-button>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>




import quillor from '@/components/QuillEditor'
//import { quillEditor } from 'vue-quill-editor' //调用编辑器


  import Tinymce from '@/components/Tinymce'
//  import QuillEditor from '@/components/QuillEditor'
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
  import {userSearch} from '@/api/remoteSearch'
  import {
    parkList,
    saveSightSpot,
    getSpotDetail,
    selectParkScenery
  } from '@/api/scenery'
  import { fundingProductDetail, saveFund} from '@/api/fund'

  import UE from '@/components/Ue/ue.vue';


  const defaultNews={
    "id": '',
    "title": "",
    "content": "",
    "type": 1 // 咨询
  }
  const sceneryContent={
    spotId: "",
    name: "",
    openTime:"",
    sightCategory: "",
    spotDetails: "",
    masterImg: "",
    inOut: 0,
    money: "",
    status: "",
    pId: "",
    notes: "",
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
    components: {Tinymce, MDinput, Multiselect,Upload, Sticky, VueCropper, UE, quillor},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
      this.getALLParks()

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
        onEditorReady(editor) {
        },
        editorOption: {
         /* modules: {
            toolbar: '#toolbar'
          }*/
        },
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
        parksOptions: [],
        sightOptions: [],
        statusOptions:[
          {id:0,name:"众筹中"},
          {id:1,name:"已众筹"},
          {id:2,name:"在建"},
          {id:3,name:"已建"},
          {id:4,name:"已营业"}
        ],
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
          name: [
            {required: true, message: '请输入项目景点名称', trigger: 'blur'},
            {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'}
          ],
          openTime: [
            {required: true, message: '请输入开放时间', trigger: 'change'},
            {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '请填写金额', trigger: 'change'},
          ],
          sightCategory: [
            {required: true, message: '请选择项目所属景区', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择营业状态', trigger: 'change'}
          ],
          masterImg: [
            {required: true, message: '请上传项目景点主图', trigger: 'change'}
          ],
          spotDetails: [
            {required: true, message: '请输入介绍', trigger: 'blur'},
            {min: 3, max: 5000, message: '长度在 3 到 5000 个字符', trigger: 'blur'}
          ],
          notes: [
            {required: true, message: '请输入须知', trigger: 'blur'},
            {min: 3, max: 2000, message: '长度在 3 到 2000 个字符', trigger: 'blur'}
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
     /* changeZong(){
        this.sceneryContent.status=this.statusOptions[0].id
        this.sceneryContent.spotDetails=''
        this.sceneryContent.notes=''
        if(this.sceneryContent.inOut!=1){
          this.sceneryContent.status=''
          this.sceneryContent.money=0
        }
      },*/
      //获取所有园区
      getALLParks(){
        parkList(this.listQuery).then(response => {
          this.parksOptions = response.data.data.content
          this.loading = false
          this.listLoading = false
        })
      },
      // 获取景区下的景点
      getSightByPark(pId) {
        this.loading = true
        this.listQuery2.pId = pId
        selectParkScenery(this.listQuery2).then(response => {
          this.sightOptions = response.data.data
          debugger
          this.loading = false
          this.listLoading = false
        })
      },
      changeSights(pId){
          debugger
        this.getSightByPark(pId)
//        this.sceneryContent.sightCategory =  this.sightOptions[0].id
      },
      submitNews(){
        debugger

      /*  if(this.sceneryImgArr){
          let newImgsArrStr = this.sceneryImgArr.join(',')
        this.sceneryContent.masterImg +=newImgsArrStr
        }*/
//        let newImgsArrStr = this.sceneryImgArr.join(',')
//        this.sceneryContent.masterImg +=newImgsArrStr
        saveFund(this.sceneryContent).then(response => {
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
          debugger
        fundingProductDetail({spotId:this.$route.query.id}).then(response => {
          this.sceneryContent = response.data.data
          this.getSightByPark(response.data.data.pId)
          // 编辑修改
          debugger
          this.sceneryImgArr=this.sceneryContent.masterImg.split(',')
          debugger
          for(let i=0; i<this.sceneryImgArr.length;i++){
            let obj={name:'tupian.png', url:this.sceneryImgArr[i]}
            this.sceneryImgArr2.push(obj)
          }
         /* if(this.sceneryImgArr2.length!=1){
            this.sceneryImgArr2.pop()
          }*/
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
              message: '发布成功',
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
        this.$router.push({path: '/fund-product/fund-scenery/fund-list'})
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
