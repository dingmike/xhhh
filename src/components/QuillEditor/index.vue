<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <!--<textarea class="tinymce-textarea" :id="tinymceId"></textarea>-->


   <!-- <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>-->

    <quill-editor
      style="height: 400px"
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  import editorImage from './components/editorImage'


//  import plugins from './plugins'
//  import toolbar from './toolbar'

  export default {
    name: 'quillor',
    components: { editorImage ,quillEditor},
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        default: 'file edit insert view format table'
      },
      height: {
        type: Number,
        required: false,
        default: 360
      }
    },
    data() {
      return {
        editorOption: {
          /* modules: {
           toolbar: '#toolbar'
           }*/
          modules: {
            /*toolbar: [
              [{ 'size': ['small', false, 'large'] }],
              ['bold', 'italic'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image']
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },*/
            /*imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            }*/
          }
        },
        content: this.value,
        hasChange: false,
        hasInit: false,
        fullscreen: false
      }
    },
    watch: {
    },
    mounted() {
//      this.initTinymce()
    },
    activated() {
//      this.initTinymce()
    },
    deactivated() {
    },
    methods: {
      onEditorBlur(){//失去焦点事件
      },
      onEditorFocus(){//获得焦点事件
      },
      onEditorChange(){//内容改变事件
      },
      imageSuccessCBK(arr) {
        const _this = this
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        })
      }
    }
  }
</script>

<style scoped>
  /*.tinymce-container {
    position: relative;
  }
  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    !*z-index: 2005;*!
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }*/
</style>
