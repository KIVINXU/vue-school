<template>
  <!--添加菜单-->
  <div class="box">
    <div class="box-header">
    </div>
    <div class="box-body">
      <!-- form start -->
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-xs-2 control-label">选择菜单级别：</label>
          <div class="col-xs-8">
            <input type="text" class="form-control" value="一级菜单／二级菜单" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="col-xs-2 control-label">选择上级菜单：</label>
          <div class="col-xs-8">
            <input type="text" class="form-control" value="后台菜单管理" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="col-xs-2 control-label">菜单名称：</label>
          <div class="col-xs-8">
            <input type="text" class="form-control">
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">页面链接：</label>
          <div class="col-xs-8">
            <input type="text" class="form-control">
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">是否显示：</label>
          <div class="col-xs-8">
            <label class="radio-inline">
              <input type="radio" name="display" value="1"> 显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="display" value="0"> 不显示
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">说明：</label>
          <div class="col-xs-8">
            <textarea class="form-control" rows="3"></textarea>
          </div>
        </div>
        <!-- /.box-body -->
      </form>
    </div>
    <div class="box-footer text-center">
      <a href="#" class="btn btn-primary" style="margin-right: 30px">保存</a>
      <a href="#" class="btn btn-default" @click="$router.go(-1)">返回</a>
    </div>
    <!--modal-关联家长选择-->
    <div class="modal fade" id="guardian" tabindex="-1" role="dialog" aria-labelledby="searchGuardian">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal"><span>&times;</span></button>
            <h4 class="modal-title" id="searchGuardian">家长选择</h4>
          </div>
          <div class="modal-body">
            <p>学校名称：<span>xxxxxx</span></p>
            <p>学生姓名：<span>xxxxxx</span></p>
            <table class="table table-bordered">
              <tbody><tr class="warning">
                <th style="width: 12%;">
                  <label>
                    <input type="checkbox" value="all"> 全选
                  </label>
                </th>
                <th>家长ID</th>
                <th>家长姓名</th>
                <th>家长身份</th>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" value="1">
                </td>
                <td>xxx</td>
                <td>xxx</td>
                <td>责任人</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" value="2">
                </td>
                <td>xxx</td>
                <td>xxx</td>
                <td>监护人</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" value="3">
                </td>
                <td>xxx</td>
                <td>xxx</td>
                <td>监护人</td>
              </tr>
              </tbody></table>
          </div>
          <div class="modal-footer">
            <a href="#" class="btn btn-default" data-dismiss="modal">确认</a>
            <a href="#" class="btn btn-default" data-dismiss="modal" style="margin-left: 20px">关闭</a>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</template>
