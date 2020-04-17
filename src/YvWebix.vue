<script>
function data_handler(value) {
    const view = $$(this.webixId);

    if (typeof value === "object") {
        if (this.copyData) {
            value = webix.copy(value);
        }

        if (view.setValues) {
            view.setValues(value);
        } else if (view.parse) {
            view.clearAll();
            view.parse(value);
        }
    } else if (view.setValue) {
        view.setValue(value);
    }

    YvanUI.webix.ui.each(
        view,
        sub => {
            if (sub.hasEvent && sub.hasEvent("onValue")) {
                sub.callEvent("onValue", [value]);
            }
        },
        this,
        true
    );
}

export default {
    install(vue) {
        vue.component("webix-ui", this);
    },
    props: ["config"],
    data() {
        return {
            webixId: undefined
        };
    },

    template: "<div style='width:100%;height:100%;'></div>",

    mounted: function() {
        var config = YvanUI.webix.copy(this.config);
        config.$scope = this;

        this.webixId = YvanUI.webix.ui(config, this.$el);
    },
    destroyed: function() {
        YvanUI.webix.$$(this.webixId).destructor();
    }
};
</script>
