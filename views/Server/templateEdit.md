{% extends "Server/partial/main.html" %} {% block left %} {% include "Server/partial/left.html" %} {% endblock %} {% block main %}
<div class="title">
    <h1>
        {{ title }}
    </h1>
</div>
<div class="toolbar">
    <div class="toolbar-list">
        <button id="btnSave" class="btn btn-default btn-sm">保存</button>
        <input type="hidden" id="id" value="{{ id }}" />
    </div>
</div>
<div class="panel panel-default mainModal">
    <div class="panel-body">
        <div class="row">
            <div class="col-md-24">
                <div class="form-group">
                    <label for="name" class="control-label">名称:</label>
                    <input type="text" maxlength="30" class="form-control" name="name" id="name">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-24">
                <div class="form-group foodlist">
                    <label for="name" class="control-label">食材:</label>
                    <div class="form-inline food">
                        <div class="form-group">
                            <input type="text" class="form-control" name="foodName" placeholder="请输入食材名称">
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="foodWeight" placeholder="请输入分量">
                        </div>
                        <button class="btn btn-default btnDelete">-删除</button>
                        <button class="btn btn-default btnFood">+添加食材</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="steplist">
            <div class="row step">
                <div class="col-md-24">
                    <div class="form-group">
                        <label for="#name#Content" class="control-label description">方法步驟1:</label>
                        <div class="wpeditor" name="#name#Content" id="#name#Content" contentEditable="true"></div>
                    </div>
                </div>
                <div class="col-md-24 ">
                    <div class="imglist"></div>
                    <input type="file" class="pic" name="pic" multiple="multiple" accept="image/png,image.jpg" /><button name="btnDelete" class="btn btn-default btn-sm btnDelete">-删除步驟</button><button name="btnStep" class="btn btn-default btn-sm btnStep">+添加新步驟</button>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %} {% block modal %}
<!-- Modal -->
<div class="modal fade bs-example-modal-sm" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="confirmModalLabel">确认</h4>
            </div>
            <div class="modal-body">
                出错了?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" id="btnConfirmSave" class="btn btn-primary">确定</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="/default/assets/js/Server/#name#.edit.js?v=1.000"></script>
<script type="text/javascript" src="/default/assets/js/WPEditor.js"></script>
{% endblock %}