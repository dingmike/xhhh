<template>
  <div class="upload-container">

<!--:before-upload="beforeUpload"-->
    <el-upload
      class="avatar-uploader"
      action="https://httpbin.org/post"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleImageScucess">
      <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
<!--https://jsonplaceholder.typicode.com/posts/-->

  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { getToken } from '@/api/qiniu'

export default {
  name: 'oneImageUpload',
  directives: { elDragDialog },
  props: {
      value: String
  },
  computed: {
//    imageUrl() {
//      console.log('oldPIc: ' + this.value)
//      return this.value
//    }
    imageUrl: {
      get: function () {
        return this.value
      },
      // setter
      set: function (newValue) {
        this.imageUrl2 = newValue
//        this.value = newValue
        console.log(this.imageUrl2)
//        console.log( this.value)
      }
    }

  },
  data() {
    return {
      single: false,
      dialogImageUrl: '',
      imageUrl2: '',
      dialogVisible: false,
      picFiles: this.fileList,
      dataObj: { token: '', key: '' }
    }
  },
  mounted() {
      console.log('picFiles:')
      console.log(this.picFiles)
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(res, file) {
//      this.emitInput(file.files.file)
      this.imageUrl = URL.createObjectURL(file.raw);
      this.value =  URL.createObjectURL(file.raw);
      this.fileList =  URL.createObjectURL(file.raw);
    },
    beforeUpload(file) {
      const _self = this

      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
      /*return new Promise((resolve, reject) => {
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
      })*/
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.upload-container{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    border: 1px dotted #ccc;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    border: 1px dotted #ccc;
    display: block;
  }
}

</style>
