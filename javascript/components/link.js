Vue.component('app-link', {
    template: `
        <path
            class="link"
            :d="setData"
            :class="name"
            ref="link"
            marker-start="url(#circle)"
            marker-end="url(#circle)"
            :stroke-dashoffset="size"
            :stroke-dasharray="size"
            @click="select"
        ></path>    
    `,
    props: {
        link: Array,
        check: Boolean
    },
    data(){
      return{
          size: 0
      }
    },
    methods:{
        select(){
            if (this.check)
                return;
            if (this.link.selected){
                this.link.selected = false;
                this.link.name = ''
            }
            else {
                this.link.selected = true;
                this.link.name = 'selected';
                EventBus.$emit('delete.link');
            }
        }
    },
    computed:{
        setData(){
            let {from, to} = this.link;
            let x1 = from.element.pos.x + from.node.pos.x;
            let y1 = from.element.pos.y + from.node.pos.y;
            let x2 = to.element.pos.x + to.node.pos.x;
            let y2 = to.element.pos.y + to.node.pos.y;
            let diff = (y2 - y1) / 4;

            return `M${x1} ${y1} C${x1} ${y1 + diff} ${x2} ${y2 - diff} ${x2} ${y2}`;
        },

        name(){
            let {name} = this.link, className = '';
            if (name)
                className = name;
            return className;
        }
    },
    watch:{
      link:{
          deep: true,
          handler(){
              this.size = this.$refs.link.getTotalLength();
          }
      }
    },
    mounted(){
        this.size = this.$refs.link.getTotalLength();
    }
})