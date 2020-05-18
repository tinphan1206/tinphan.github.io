Vue.component('edit-mode', {
    template: `
        <section :class="{view : check}">
            <element-wrapper
                :elements="elements"
                :check="check"
                :id="id"
            ></element-wrapper>
            
            <link-wrapper
                :links="links"
                :check="check"
            ></link-wrapper>
            
            <div class="modal" role="dialog" v-if="edit" id="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title"><h5>Edit element</h5></div>
                            <div class="close" @click="closeEdit">&times;</div>
                        </div>
                        
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="element-name">Caption</label>
                                    <input type="text" id="element-name" class="form-control" v-model="element.caption">
                                </div>
                                
                                <editor :element="element"></editor>
                                
                                <div class="form-row">
                                     <template v-for="node in element.nodes">
                                        <ul class="col-md-6" v-if="node.link">
                                            <li class="form-group">
                                                <label :for="node.name">{{node.name}}</label>
                                                <input type="text" :id="node.name" class="form-control" v-model="node.caption">
                                            </li>
                                        </ul>
                                     </template>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <transition name="fade" v-if="clone">
                <div class="clone"
                    :style="position"
                >
                    <span>{{clone.node.id}}</span>
                </div>
            </transition>
        </section>    
    `,
    props:{
        links: Array,
        elements: Array,
        check: {
            typeof: Boolean,
            default: false
        },
        id: String
    },
    data(){
        return{
            clone: null,
            element: null,
            edit: false
        }
    },
    methods:{
        cloneStart(ev, element, node){
            EventBus.$emit('message', 'Make clone success', 'success');
            let {pageX, pageY} = ev;
            let pos = {
                x: pageX - 15,
                y: pageY - 15
            };

            this.clone = {element, node, pos};

            console.log(this.clone)

            draggable(ev, this.clone);

            document.addEventListener('mouseup', this.cloneEnd);
        },

        cloneEnd(){
            this.clone = null;
            document.removeEventListener('mouseup', this.cloneEnd);
        },

        saveClone(element, node){
            if (!this.clone)
                return;

            if (node.link){
                EventBus.$emit('message', 'node is ready link', 'error');
                return;
            }

            delete this.clone.pos;
            EventBus.$emit('make.link', {
                from: this.clone,
                to: {element, node}
            });
        },

        editElement(element){
            this.element = element;
            this.edit = true;
            document.addEventListener('mousedown', this.listenClose);
        },

        closeEdit(){
            this.edit = false;
            document.removeEventListener('mousedown', this.listenClose);
        },

        listenClose(ev){
            let modal = document.getElementById('modal');
            if (ev.target == modal)
                this.closeEdit();
        }
    },
    computed:{
        position(){
            let {pos} = this.clone;
            let {x, y} = pos;
            return `left: ${x}px; top: ${y}px`;
        }
    },
    created(){
        EventBus.$on('make.clone', this.cloneStart);
        EventBus.$on('save.clone', this.saveClone);

        EventBus.$on('edit.element', this.editElement);
    }
});