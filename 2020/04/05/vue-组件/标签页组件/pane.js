Vue.component('pane',{
    name:'pane',
    template:`
        <div class="pane" v-show="show">
            <slot></slot>
        </div>
    `,
    props:{
        name:{
            type:String
        },
        label:{
            type:String,
            default:''
        }
    },
    data:()=>{
        return {
            show:true
        }
    },
    watch:{
        label(){
            this.updateNav()
        }
    },
    mounted(){
        console.log('pane mounted')
        this.updateNav()
    },
    methods:{
        updateNav(){
            this.$parent.updateNav()
        }
    },
})