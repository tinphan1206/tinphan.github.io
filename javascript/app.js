let EventBus = new Vue();

new Vue({
    el: '#app',
    data(){
        return{
            elements:[
                this.makeElement({
                    id: 'root',
                    pos:{
                        x: window.innerWidth/2 - 50,
                        y: window.innerHeight/2 - 50
                    },
                    caption: 'Root caption'
                })
            ],

            links: [],

            message: {
                text: null,
                status: null,
                timer: null
            }
        }
    },
    methods:{
        makeElement(option = {}){
            return {
                id: option.id || uuid(),
                caption: option.caption || 'Default caption',
                pos: option.pos,
                html: `<img src="image/sample.png">`,
                selected: false,
                name: null,
                nodes: this.makeNodes()
            }
        },

        makeNodes(){
            return[
                {
                    id: 1,
                    pos: {x: 50, y: 0},
                    posNext: {x: 0, y: -200},
                    nodeNext: 3,
                    link: null,
                    name: 'Top',
                    caption: 'Top caption'
                },
                {
                    id: 2,
                    pos: {x: 100, y: 50},
                    posNext: {x: 200, y: 0},
                    nodeNext: 4,
                    link: null,
                    name: 'Right',
                    caption: 'Right caption'
                },
                {
                    id: 3,
                    pos: {x: 50, y: 100},
                    posNext: {x: 0, y: 200},
                    nodeNext: 1,
                    link: null,
                    name: 'Bottom',
                    caption: 'Bottom caption'
                },
                {
                    id: 4,
                    pos: {x: 0, y: 50},
                    posNext: {x: -200, y: 0},
                    nodeNext: 2,
                    link: null,
                    name: 'Left',
                    caption: 'Left caption'
                },
            ]
        },

        createElement(option){
            let element = this.makeElement(option);
            this.elements.push(element);
            return element;
        },

        makeLink(option = {}){
            return{
                id: uuid(),
                from: option.from,
                to: option.to,
                name: null,
                selected: false
            }
        },

        createLink(option){
            let link = this.makeLink(option);
            this.links.push(link);
            return link;
        },

        makeRelation(element, node){
            if (node.link)
                return;

            EventBus.$emit('message', 'Create element success', 'success');

            let {pos, id} = element;
            let {posNext} = node;

            let _element = this.createElement({
                pos:{
                    x: pos.x + posNext.x,
                    y: pos.y + posNext.y,
                }
            });

            node.link = _element.id;

            _element.nodes[node.nodeNext - 1].link = id;

            this.createLink({
                from: {element, node},
                to: {
                    element: _element,
                    node: _element.nodes[node.nodeNext - 1]
                }
            })
        },

        deleteElement(element){
            let {id} = element;

            if (id === 'root'){
                EventBus.$emit('message', 'Can not delete root element', 'error');
                return;
            }

            element.name = 'remove';

            EventBus.$emit('message', 'Delete element success', 'success');

            this.links.forEach(link => {
                let {from, to} = link;
                if (from.element.id === id || to.element.id === id){
                    from.node.link = null;
                    to.node.link = null;
                    link.name = 'remove';
                }

            });

            setTimeout(_ => {
                this.elements.splice(this.elements.findIndex(x => x.id === id), 1);
                this.links = this.links.filter(link => {
                    let {from, to} = link;
                    return from.element.id !== id && to.element.id !== id;
                })
            }, 400);
        },

        deleteLink(){
            EventBus.$emit('message', 'Delete link success', 'success');

            this.links.forEach(link => {
                if (link.selected){
                    let {from, to} = link;
                    link.name = 'remove';
                    from.node.link = null;
                    to.node.link = null
                }
            });

            setTimeout(_ => {
                this.links = this.links.filter(link => {
                    return !link.selected;
                })
            }, 400);

            document.removeEventListener('keydown', this.listenDelete);
        },

        listenDelete(ev){

            ev.stopPropagation();
            let {key} = ev;
            if(key === 'Delete' || key === 'Backspace')
                this.deleteLink();
        },

        saveClone(option){
            EventBus.$emit('message', 'Create link success', 'success');

            let {from, to} = option;
            from.node.link = to.element.id;
            to.node.link = from.element.id;

            this.createLink(option);
        },

        deSelectLink(){
            this.links.forEach(link => {
                link.selected = false;
                link.name = null
            })
        },

        reset(){
            this.elements = [
                this.makeElement({
                    id: 'root',
                    pos:{
                        x: window.innerWidth/2 - 50,
                        y: window.innerHeight/2 - 50
                    },
                    caption: 'Root caption'
                })
            ];

            this.links = []
        },

        restore(){
            let elements = localStorage.getItem('xx_elements');
            let links = localStorage.getItem('xx_links');

            if (elements)
                this.elements = JSON.parse(elements);

            if (links){
                let links_temp = JSON.parse(links);
                this.links = links_temp.map(link => {
                    let {from, to} = link;
                    let eFrom = this.elements.find(x => x.id === from.element.id);
                    let eTo = this.elements.find(x => x.id === to.element.id);

                    return Object.assign({}, link , {
                        from: {
                            element: eFrom,
                            node: eFrom.nodes[from.node.id - 1]
                        },
                        to: {
                            element: eTo,
                            node: eTo.nodes[to.node.id - 1]
                        },
                        selected: false,
                        name: null
                    })
                })
            }
        },

        setMessage(_text, _status){
            this.message.text = _text;
            this.message.status = _status;
            clearTimeout(this.message.timer);
            this.message.timer = setTimeout(_ => {
                this.message.text = null;
                this.message.status = null;
            }, 3000)
        }
    },
    watch:{
        elements:{
            deep: true,
            handler(){
                localStorage.setItem('xx_elements', JSON.stringify(this.elements));
            }
        },

        links:{
            deep: true,
            handler(){
                localStorage.setItem('xx_links', JSON.stringify(this.links));
            }
        }
    },
    created(){
        this.restore();

        setTimeout(_ => {
            this.setMessage('Welcome to Knowledge explorer', 'primary');
        }, 1);

        EventBus.$on('reset', this.reset);
        EventBus.$on('make.relation', this.makeRelation);
        EventBus.$on('delete.element', this.deleteElement);
        EventBus.$on('make.link', this.saveClone);
        EventBus.$on('deselect.link', this.deSelectLink);
        EventBus.$on('message', this.setMessage);
        EventBus.$on('delete.link', _ => {
            EventBus.$emit('message', 'Selected link success', 'success');
            document.addEventListener('keydown', this.listenDelete);
        })
    }
});