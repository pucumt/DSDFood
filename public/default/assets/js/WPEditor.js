//WPEditor
(function() {
    function WPEditor($editor) {
        this.$editor = $editor;
        this.$editor.attr("contentEditable", true);
        this.$editor.addClass("wpeditor");
        var toolbar = $("<div class='editor-tool'><button class='btn btn-default' id='bold'>B</button><button class='btn btn-default' id='italic'>I</button></div>");
        this.btnBold = toolbar.find("#bold");
        this.btnItalic = toolbar.find("#italic");
        this.$editor.before(toolbar);

        this.btnBold.on("click", function() {
            this.exec("bold");
        }.bind(this));
        this.btnItalic.on("click", function() {
            this.exec("italic");
        }.bind(this));
    };

    WPEditor.prototype.exec = function(bold) {
        // document.designMode = "on";
        var result = window.document.execCommand("bold", false, null);
        console.log(result);
        //italic
        // document.designMode = "off";
    };

    WPEditor.prototype.value = function() {
        return this.$editor.html();
    };

    window.WPEditor = WPEditor;
})();