Vue.component('app-header', {
    template: `
        <header class="fixed-top app-header">
            <div class="navbar navbar-light navbar-expand-lg">
                <a href="#" class="navbar-brand">Knowledge explorer</a>
                
                <div class=" navbar-collapse collapse justify-content-end">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <button class="btn btn-sm btn-primary" v-if="!view" @click="viewMode">View mode</button>
                            </a>
                        </li>
                        
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <button class="btn btn-sm btn-primary" v-if="view" @click="exitView">Exit view mode</button>
                            </a>
                        </li>
                        
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <button class="btn btn-sm btn-danger" v-if="!view" @click="reset">Reset</button>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    `,
    data(){
        return{
            view: false,
        }
    },
    methods:{
        reset(){
            EventBus.$emit('reset');
            EventBus.$emit('message', 'Reset success', 'success');
        },

        viewMode(){
            EventBus.$emit('deselect.link');
            EventBus.$emit('message', 'View mode', 'primary');
            this.view = true;
            document.documentElement.requestFullscreen();
            EventBus.$emit('view.mode');
        },

        exitView(){
            this.view = false;
            document.exitFullscreen();
            EventBus.$emit('exit.view');
        }
    }
})