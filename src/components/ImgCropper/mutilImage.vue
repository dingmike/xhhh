<template>
  <div class="upload-container">
 <!--    <el-upload class="image-uploader"
       :data="dataObj"
       action="https://httpbin.org/post"
       :multiple="true"
       :limit="10"
       :file-list="picFiles"
       :on-success="handleImageScucess"
       list-type="picture-card"
       :on-preview="handlePictureCardPreview"
       :on-remove="handleRemove">
       <i class="el-icon-plus"></i>
       <div slot="tip" class="el-upload__tip">添加图片(0/10)</div>
     </el-upload>
     <el-dialog :visible.sync="dialogVisible">
       <img width="100%" :src="dialogImageUrl" alt="">
     </el-dialog>
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>-->


    <UploadList
    :disabled="imgList.uploadDisabled"
    :listType="imgList.listType"
    :files="imgList.uploadFiles"
    :on-remove="handleRemove"
    :handlePreview="handlePictureCardPreview">
    </UploadList>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="model">
      <img width="100%" :src="modelSrc" alt="">
    </el-dialog>

    <div class="test test1">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
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
        @realTime="realTime"
        @imgLoad="imgLoad"
      ></vueCropper>
    </div>
    <div class="test-button">
      <button @click="changeImg" class="btn">changeImg</button>
      <label class="btn" for="uploads">upload</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      <button @click="startCrop" v-if="!crap" class="btn">start</button>
      <button @click="stopCrop" v-else class="btn">stop</button>
      <button @click="clearCrop" class="btn">clear</button>
      <button @click="refreshCrop" class="btn">refresh</button>
      <button @click="changeScale(1)" class="btn">+</button>
      <button @click="changeScale(-1)" class="btn">-</button>
      <button @click="rotateLeft" class="btn">rotateLeft</button>
      <button @click="rotateRight" class="btn">rotateRight</button>
      <button @click="finish('base64')" class="btn">preview(base64)</button>
      <button @click="finish('blob')" class="btn">preview(blob)</button>
      <a @click="down('base64')" class="btn">download(base64)</a>
      <a @click="down('blob')" class="btn">download(blob)</a>
    </div>
    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>
</template>

<script>
  import UploadList from './upload-list';
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import VueCropper from 'vue-cropper'
  import { getToken } from '@/api/qiniu'
  import ElProgress from 'element-ui/packages/progress'
  import Migrating from 'element-ui/src/mixins/migrating'

  export default {
    name: 'mutilImageUpload',
    directives: { elDragDialog},
    components :{VueCropper, UploadList,   ElProgress,},
    props: {
      fileLists: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    computed: {
      imageUrl() {
        return this.value
      }
    },
    data() {
      return {
        showCorpper: true,
        dialogImageUrl: '',
        dialogVisible: false,
        tempUrl: '',
        picFiles: this.fileLists,
        dataObj: { token: '', key: '' },
        imgList:{
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
          fixedBox: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 500,
          autoCropHeight: 300,
          centerBox: false,
          high: true
        },
        dialogImageUrl: '',
        dialogVisible: false,

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
      console.log('picFiles:')
      console.log(this.picFiles)
      this.changeImg()
      // hljs.configure({useBR: true})
      var list = [].slice.call(document.querySelectorAll('pre code'))
      list.forEach((val, index) => {
        hljs.highlightBlock(val)
      })
      // console.log(this.$refs.cropper)
    },
    methods: {
      rmImage() {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageScucess(file) {
        this.emitInput(file.files.file)
      },
      beforeUpload() {
        const _self = this
        return new Promise((resolve, reject) => {
          getToken().then(response => {
            const key = response.data.qiniu_key
            const token = response.data.qiniu_token
            _self._data.dataObj.token = token
            _self._data.dataObj.key = key
            this.tempUrl = response.data.qiniu_url
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadImg (e, num) {
          debugger
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
      changeImg () {
        this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
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
      handleRemove(file, raw) {
        let doRemove = () => {
          let fileList = this.imgList.uploadFiles;
          fileList.splice(fileList.indexOf(file), 1);
        };
        doRemove();
      },
      finish (type) {
          debugger
        // 输出
        // var test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
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
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },
      imgLoad (msg) {
        console.log(msg)
      },
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
    /* .image-preview {
       width: 100px;
       height: 100px;
       position: relative;
       border: 1px dashed #d9d9d9;
       float: left;
       margin-left: 50px;
       .image-preview-wrapper {
         position: relative;
         width: 100%;
         height: 100%;
         img {
           width: 100%;
           height: 100%;
         }
       }
       .image-preview-action {
         position: absolute;
         width: 100%;
         height: 100%;
         left: 0;
         top: 0;
         cursor: default;
         text-align: center;
         color: #fff;
         opacity: 0;
         font-size: 20px;
         background-color: rgba(0, 0, 0, .5);
         transition: opacity .3s;
         cursor: pointer;
         text-align: center;
         line-height: 200px;
         .el-icon-delete {
           font-size: 36px;
         }
       }
       &:hover {
         .image-preview-action {
           opacity: 1;
         }
       }
     }

     .image-app-preview {
       width: 320px;
       height: 180px;
       position: relative;
       border: 1px dashed #d9d9d9;
       float: left;
       margin-left: 50px;
       .app-fake-conver {
         height: 44px;
         position: absolute;
         width: 100%; // background: rgba(0, 0, 0, .1);
         text-align: center;
         line-height: 64px;
         color: #fff;
       }
     }*/

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
      margin:20px 10px 0px 0px;
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
      background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
    }

  }
</style>
