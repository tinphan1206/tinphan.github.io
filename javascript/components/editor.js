Vue.component('editor', {
  template: `
    <div ref="editor"></div>
  `,
  props:{
      element: Array
  },
  mounted(){
      let editor = CKEDITOR.replace(this.$refs.editor);
      editor.setData(this.element.html);
      editor.on('change', _ => {
          this.element.html = editor.getData();
      })
  },
});