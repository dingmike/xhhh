<template>
  <div class="upload-container">
    <uploadImg class="image-uploader"
               :data="dataObj"
               ref="upload"
               accept="image/png,image/jpg,image/jpeg"
               action="http://huahai.tunnel.qydev.com/huahai/admin/upload"
               :multiple="true"
               :show-file-list='true'
               :limit="9"
               :on-change="changeFile"
               :file-list="picFiles"
               :before-upload="beforeUpload"
               :auto-upload="false"
               :on-success="handleImageScucess"
               list-type="picture-card"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               @click.native="showCorpMain">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">点+添加图片(最多9张)</div>
    </uploadImg>
    <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitImgs">开始上传</el-button>-->

    <!--new add-->
    <el-dialog width="50%" v-el-drag-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog width="50%" v-el-drag-dialog :visible.sync="model">
      <img width="100%" :src="modelSrc" alt="">
    </el-dialog>


    <el-dialog width="60%" v-el-drag-dialog :visible.sync="dialogCorpperBox">
      <div class="test test1">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :canScale="option.canScale"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :centerBox="option.centerBox"
          :high="option.high"
          :infoTrue="option.infoTrue"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
        ></vueCropper>
      </div>
      <div class="test-button">
        <!--<button @click="changeImg" class="btn">changeImg</button>-->
        <!--<label class="btn" for="uploads">选择一张图片</label>-->
<!--        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
               accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">-->
        <!--<button @click="startCrop" v-if="!crap" class="btn">start</button>-->
        <!--<button @click="stopCrop" v-else class="btn">stop</button>-->
        <!--<button @click="clearCrop" class="btn">clear</button>-->
        <!--<button @click="refreshCrop" class="btn">refresh</button>-->
        <!--<button @click="changeScale(1)" class="btn">放大</button>-->
        <!--<button @click="changeScale(-1)" class="btn">缩小</button>-->
        <!--<button @click="rotateLeft" class="btn">左旋转</button>-->
        <!--<button @click="rotateRight" class="btn">右旋转</button>-->
        <!--<button @click="finish('base64')" class="btn">预览</button>-->
        <!--<button @click="finish('blob')" class="btn">preview(blob)</button>-->
        <a @click="down('base64')" class="btn">下载</a>
        <!--<a @click="down('blob')" class="btn">download(blob)</a>-->
        <el-row style="margin-top: 20px">
          <el-col>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="startInitImg('base64')">裁剪图片</el-button>
            <el-button style="margin-left: 10px;" size="small" type="warning" v-if="showUploadBtn" @click="sureUpload">确定上传</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import uploadImg from "./compontants/index"
  import UploadList from './upload-list';
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import VueCropper from 'vue-cropper'
  import {getToken} from '@/api/qiniu'
  import ElProgress from 'element-ui/packages/progress'
  import Migrating from 'element-ui/src/mixins/migrating'

  export default {
    name: 'mutilImageUpload',
    directives: {elDragDialog},
    components: {VueCropper, UploadList, ElProgress, uploadImg},
    props: {
      fileLists: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    computed: {
      imageUrl() {
        return this.value
      }
    },
    watch: {
      fileLists(val){
          this.picFiles = val
      }
    },
    data() {
      return {
        showUploadBtn: false,
        flag: true,
        showCorpper: true,
        dialogImageUrl: '',
        dialogVisible: false,
        dialogCorpperBox: false,

        tempUrl: '',
        picFiles: this.fileLists,
        dataObj: {token: '', key: ''},
        imgList: {
          uploadDisabled: false,
          listType: 'picture-card',
          uploadFiles: [{
            url: 'http://ofyaji162.bkt.clouddn.com/touxiang.jpg'
          },
            {
              url: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
            },
            {
              url: 'http://ofyaji162.bkt.clouddn.com/bg2.jpg',
            },
            {
              url: 'http://ofyaji162.bkt.clouddn.com/can.jpg'
            },
            {
              url: 'http://ofyaji162.bkt.clouddn.com/nightcat.jpg'
            }]
        },
        model: false,
        modelSrc: '',
        crap: false,
        previews: {},
        imgUrlList:'',
        imgsArr:[],
        lists: [
          {
            img: 'http://ofyaji162.bkt.clouddn.com/touxiang.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/bg2.jpg',
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/can.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/nightcat.jpg'
          }
        ],
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 500,
          autoCropHeight: 300,
          centerBox: true,
          high: true,
          fixed: true,
          fixedNumber: [5,3]
        },

        example2: {
          img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 300,
          autoCropHeight: 250,
          fixed: true,
          // 真实的输出宽高
          infoTrue: true,
          fixedNumber: [4, 3]
        },
      }
    },
    mounted() {
      var list = [].slice.call(document.querySelectorAll('pre code'))
      list.forEach((val, index) => {
        hljs.highlightBlock(val)
      })
    },
    methods: {
        sureUpload(){
          this.submitImgs()
          this.dialogCorpperBox=false
        },
      rmImage() {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageScucess(file, data,raw) {
        if(file.code==200){
          this.flag = false
        }
        if(data.uid==raw[raw.length-1].uid){
          let uid = data.uid
           for(let i=0;i<raw.length;i++){
           if(uid!=raw[i].uid){
           this.imgsArr.push(raw[i].url)
           }else{
           this.imgsArr.push(raw[i].response.data)
           //this.imgUrlList+=raw[i].response.data+','
           }
           }
           console.log(this.imgsArr.join(','))
          this.emitInput(this.imgsArr.join(','))

        }
      },
      showCorpMain(){
          this.flag = true
        this.showUploadBtn = false
      },
      changeFile(file, fileList){
          debugger
          var num = 1
          file = file.raw
          var reader = new FileReader()
          reader.onload = (e) => {
            let data
            if (typeof e.target.result === 'object') {
              // 把Array Buffer转化为blob 如果是base64不需要
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            if (num === 1) {
              this.option.img = data
              if(this.flag){
                this.dialogCorpperBox = true
              }
            } else if (num === 2) {
              this.example2.img = data
            }
          }
          // 转化为base64
          reader.readAsDataURL(file)
          // 转化为blob
//        reader.readAsArrayBuffer(file)

      },
      beforeUpload(file) {
          debugger
        const _self = this
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        return isLt2M;
      },
     /* handleRemove(file, fileList) {
        console.log(file, fileList);
      },*/
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadImg (e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blob
//        reader.readAsArrayBuffer(file)
      },
      startCrop () {
        // start
        this.crap = true
        this.$refs.cropper.startCrop()
      },
      stopCrop () {
        //  stop
        this.crap = false
        this.$refs.cropper.stopCrop()
      },
      clearCrop () {
        // clear
        this.$refs.cropper.clearCrop()
      },
      refreshCrop () {
        // clear
        this.$refs.cropper.refresh()
      },
      changeScale (num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      rotateLeft () {
        this.$refs.cropper.rotateLeft()
      },
      rotateRight () {
        this.$refs.cropper.rotateRight()
      },
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      doRemove(file){
//        let fileList = this.fileLists;
        this.fileLists.splice(this.fileLists.indexOf(file), 1);
      },
      handleRemove(file, raw) {
        let imgsArr = []
        for(let i=0;i<raw.length;i++){

            if(raw[i].response){
              imgsArr.push(raw[i].response.data)
            }else{
              imgsArr.push(raw[i].url)
            }

        }
        this.emitInput(imgsArr.join(','))

      },
      startInitImg () {
        // 输出
        this.$refs.cropper.getCropData((data) => {
          let newPic = this.dataURLtoFile(data, "tupian.png")
//          this.$refs.upload.submit(newPic);
          // 开始上传
          this.option.img=''
          this.showUploadBtn = true
          this.$refs.upload.handleStart(newPic)
        })

      },
      submitImgs(){
        this.$refs.upload.submit();
      },
      finish (type) {
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            var img = window.URL.createObjectURL(data)
            this.model = true
            this.modelSrc = img
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true
            this.modelSrc = data
          })
        }
      },
      // 实时预览函数
      realTime (data) {
        this.previews = data
      },
      down (type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'demo'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            let newPic = this.dataURLtoFile(data, "tupian.png")
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },
      dataURLtoFile(dataurl, filename) {//将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
      },
      imgLoad (msg) {
        console.log(msg)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .upload-container {
    /*width: 100%;*/
    position: relative;
    @include clearfix;
    .image-uploader {
      /*width: 10%;*/
      float: left;
    }

    .test {
      height: 500px;
    }
    .btn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c0ccda;
      color: #1f2d3d;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 20px 10px 0px 0px;
      padding: 9px 15px;
      font-size: 14px;
      border-radius: 4px;
      color: #fff;
      background-color: #50bfff;
      border-color: #50bfff;
      transition: all .2s ease;
      text-decoration: none;
      user-select: none;
    }

    .test-button {
      display: flex;
      flex-wrap: wrap;
    }
    .model {
      position: fixed;
      z-index: 10;
      width: 100vw;
      height: 100vh;
      overflow: auto;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.8);
    }

    .model-show {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
    }

    .model img {
      display: block;
      margin: auto;
      max-width: 80%;
      user-select: none;
      background-position: 0px 0px, 10px 10px;
      background-size: 20px 20px;
      background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
    }

  }
</style>
