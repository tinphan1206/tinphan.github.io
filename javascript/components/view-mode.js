Vue.component('view-mode', {
    template: `
        <div class="view-mode" v-if="view">
            <transition :name="name" mode="out-in">
                <div class="view-content" :key="page">
                    <div class="view-header">{{element.caption}}</div>
                    <div class="view-body" v-html="element.html"></div>
                </div>
            </transition>
            
            <edit-mode
                :links="links"
                :elements="elements"
                :check="true"
                :id="element.id"
            ></edit-mode>
            
            <transition name="control" mode="out-in">
                <div class="control-item" :key="page">
                    <template v-for="node in element.nodes">
                            <div class="control-link" v-if="node.link" :key="node.id">
                                 <button  class="btn btn-sm btn-primary"
                                    @click="nextPage(node.id)"
                                 >{{node.id}}. {{node.caption}}</button>
                            </div>
                    </template>
                </div>
            </transition>
        </div>
    `,
    props:{
        links: Array,
        elements: Array
    },
    data(){
        return{
            element: null,
            view: false,
            page: null,
            name: null
        }
    },
    methods:{
        nextPage(id){
            let node = this.element.nodes[id - 1];
            if (!node.link)
                return;
            this.name = node.name;
            this.element = this.elements.find(x => x.id === node.link);
            this.page = this.element.id;
        },

        viewMode(){
            this.element = this.elements[0];
            this.view = true;
            this.page = this.element.id;
            document.addEventListener('keydown', this.listenNextPage);
        },

        exitView(){
            this.view = false;
            document.removeEventListener('keydown', this.listenNextPage);
        },

        listenNextPage(ev){
            let {key} = ev;

            if (key >=1 && key <= 4){
                this.nextPage(parseInt(key));
                return
            }

            if (key === 'ArrowUp')
                this.nextPage(1);

            if (key === 'ArrowRight')
                this.nextPage(2);

            if (key === 'ArrowDown')
                this.nextPage(3);

            if (key === 'ArrowLeft')
                this.nextPage(4);
        }
    },
    created(){
        EventBus.$on('view.mode', this.viewMode);
        EventBus.$on('exit.view', this.exitView);
    }
});