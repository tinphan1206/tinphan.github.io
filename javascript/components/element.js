Vue.component('app-element', {
    template: `
        <div class="element"
            :style="position"
            :class="name"
            @mousemove="select"
            @mouseleave="deselect"
            @mousedown.stop="drag">
            <transition-group name="fade" class="nodes" tag="div" ref="nodes" :class="{red : check && id === element.id}">
                <template v-for="node in element.nodes">
                    <div 
                        class="node"
                        :key="node.id"
                        :data-id="node.id"
                        v-if="isSelected && !check"
                        @click="createElement(node)"
                        @mousedown="makeClone($event, node)"
                        @mouseup="saveClone(node)"
                        >
                        <span>{{node.id}}</span>
                    </div>
                </template>
            </transition-group>
        
            <transition name="fade">
                <button class="btn btn-sm btn-primary" v-if="isSelected && !check" @click="edit">Edit</button>
            </transition>
            
            <transition name="fade">
                <button class="btn btn-sm btn-danger" v-if="isSelected && !check" @click="deleteElement">Delete</button>
            </transition>
        </div>
    `,
    props:{
        element: Array,
        check: Boolean,
        id: String
    },
    data(){
      return{
          isSelected: false,
          move: 0
      }
    },
    methods:{
        select(){
            this.isSelected = true;
        },

        deselect(){
            this.isSelected = false;
        },

        drag(ev){
            this.move = 0;
            draggable(ev, this.element);

            document.addEventListener('mousemove', this.dragMove);
            document.addEventListener('mouseup', this.dragEnd);
        },

        dragMove(){
          this.move ++;
        },

        dragEnd(){
          document.removeEventListener('mousemove', this.dragMove);
          document.removeEventListener('mouseup', this.dragEnd);
        },

        createElement(node){
            if (this.move > 0)
                return;
            if (node.link)
                EventBus.$emit('message', 'node is ready link', 'error');

            EventBus.$emit('make.relation', this.element, node);
        },

        deleteElement() {
            EventBus.$emit('delete.element', this.element);
        },

        makeClone(ev, node){
            if (ev.shiftKey){
                ev.stopPropagation();
                if (node.link) {
                    EventBus.$emit('message', 'node is ready link', 'error');
                    return;
                }
                EventBus.$emit('make.clone', ev, this.element, node);
            }
        },

        saveClone(node){
            EventBus.$emit('save.clone', this.element, node);
        },

        edit(){
            EventBus.$emit('message', 'Edit element', 'primary');
            EventBus.$emit('edit.element', this.element);
            EventBus.$emit('deselect.link');
        }
    },
    computed:{
        position(){
            let {pos} = this.element;
            return `left: ${pos.x}px; top: ${pos.y}px`;
        },

        name(){
            let {name} = this.element, className = '';
            if (name)
                className = name;
            return className;
        }
    },
})