<template>
  <div>
    <script :id=id type="text/plain"></script>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
  </div>
</template>
<script>
  import editorImage from './components/editorImage'
  export default {
    name: 'UE',
    components: { editorImage },
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE


      this.editor.addListener("ready", function () {
          debugger
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
      console.log("上传这堆错误不用理会，上传接口需自行开发配置");
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      imageSuccessCBK(arr) {
          debugger
        const _this = this
        arr.forEach(v => {
          _this.editor.setContent(`<p class="otitle"><img src="${v.url}"/></p>`, true)
//          UE.getEditor(this.id, this.config).insertContent(`<img class="wscnph" src="${v.url}" >`)
        })
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
