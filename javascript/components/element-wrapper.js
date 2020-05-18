Vue.component('element-wrapper', {
    template: `
        <div class="element-wrapper">
            <template v-for="element in elements">
                <app-element
                    :element="element"
                    :check="check"
                    :id="id"
                ></app-element>
            </template>
        </div>
    `,
    props:{
        elements: Array,
        check: Boolean,
        id: String
    }
})