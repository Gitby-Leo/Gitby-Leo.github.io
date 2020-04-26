Vue.component('tabs', {
    template: `
        <div class="tabs">
            <div class="tabs-bar">
                <div v-for="(item,index) in navList":class="tabCls(item)" @click="handleChange(index)">
                    {{item.label}}
                </div>
            </div>
            <div class="tabs-content">
                <slot></slot>
            </div>
        </div>
    `,
    props: {
        // 获取v-modal的值
        value: {
            type: [String, Number]
        },
    },
    data: () => {
        return {
            currentValue: this.value,
            tabsList: [],
            navList: []
        }
    },
    watch: {
        value: function (val) {
            this.currentValue = val;
        },
        currentValue: function () {
            this.updateStatus();
        }
    },
    mounted() {
        console.log('tabs mounted')
    },
    methods: {
        // 改变class
        tabCls(item) {
            return [
                'tabs-tab',
                {
                    'tabs-tab-active': item.name == this.currentValue
                }
            ]
        },
        // 获取标签列表
        getTabs() {
            if (this.tabsList.length != 0) {
                return this.tabsList
            }
            let _tabsList;
            _tabsList = this.$children.filter((item) => {
                // $options用于判断组件中的name属性
                return item.$options.name == 'pane';
            })
            // 缓存标签列表
            this.tabsList = _tabsList;
            return _tabsList
        },
        // 更新列表
        updateNav() {
            this.navList = [];
            // 获取slot中的所有pane组件
            this.getTabs().forEach((pane, index) => {
                if (!pane.name) {
                    pane.name = index;
                }
                // 获取pane组件中的定义的prop属性
                this.navList.push({
                    label: pane.label,
                    name: pane.name
                });

                // 默认显示第一项
                if (index == 0) {
                    if (!this.currentValue) {
                        this.currentValue = pane.name;
                    }
                }
            });
            console.log('pane - init navList', this.navList)
            this.updateStatus();
        },
        // 更新内容模块的show状态，切换隐藏显示
        updateStatus() {
            this.getTabs().forEach((tab) => {
                return tab.show = tab.name == this.currentValue
            })
        },
        // 切换并抛出事件
        handleChange(index) {
            var nav = this.navList[index];
            var name = nav.name;
            this.currentValue = name;
            this.$emit('input', name);
            this.$emit('on-click', name);
        }
    }
})