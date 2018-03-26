<template>
  <div class="box">
    <div class="box-header">
    </div>
    <!-- /.box-header -->
    <div class="box-body">
      <form class="form-inline" style="margin-bottom: 10px">
        <div class="form-group form-group-sm">
          <label class="control-label">访客姓名</label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary btn-sm" style="float: right">检索</a>
        </div>
      </form>
      <table class="table table-bordered table-hover">
        <tbody><tr class="warning">
          <th>序号</th>
          <th>访客姓名</th>
          <th>性别</th>
          <th>身份证号码</th>
          <th>联系电话</th>
          <th>联系地址</th>
          <th>说明</th>
          <th>操作</th>
        </tr>
        <tr>
          <td>1</td>
          <td>xxx</td>
          <td>男</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>
            <router-link to="/person/visitorLog/1" class="btn btn-warning btn-sm">查看记录</router-link>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>xxx</td>
          <td>女</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>
            <router-link to="/person/visitorLog/2" class="btn btn-warning btn-sm">查看记录</router-link>
          </td>
        </tr>
        </tbody></table>
    </div>
    <!-- /.box-body -->
    <div class="box-footer">
      <div class="bg-warning">
        <p>※由于数据量很大，建议优先选择检索条件后查询。默认不直接显示数据。</p>
      </div>
    </div>
  </div>
</template>
