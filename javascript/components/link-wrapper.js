Vue.component('link-wrapper', {
    template: `
        <svg class="link-wrapper">
            <defs>
                <marker markerWidth="3" markerHeight="3" refX="1.5" refY="1.5" id="circle">
                    <circle r="1.5" cx="1.5" cy="1.5" fill="blue"></circle>
                </marker>
            </defs>
        
            <template v-for="link in links">
                <app-link
                    :key="link.id"
                    :link="link"
                    :check="check"
                ></app-link>
            </template>
        </svg>
    `,
    props:{
        links: Array,
        check: Boolean
    },
})