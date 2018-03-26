<template>
  <div class="box">
    <div class="box-header">
      <div class="inline" style="float: right">
        <router-link to="/permission/addUser" class="btn btn-default">添加用户</router-link>
      </div>
    </div>
    <!-- /.box-header -->
    <div class="box-body">
      <table class="table table-bordered table-hover">
        <tbody><tr class="success">
          <th>序号</th>
          <th>权限名称</th>
          <th>用户名</th>
          <th>密码</th>
          <th>连接数</th>
          <th>空闲期</th>
          <th>生存期</th>
          <th>状态</th>
          <th>方式</th>
          <th>说明</th>
          <th>操作</th>
        </tr>
        <tr>
          <td>1</td>
          <td>班主任</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>正常</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>
            <router-link to="/permission/changeUser/1" class="btn btn-warning btn-sm">修改</router-link>
            <a href="#" class="btn btn-danger btn-sm">删除</a>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>班主任</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>正常</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
          <td>
            <router-link to="/permission/changeUser/2" class="btn btn-warning btn-sm">修改</router-link>
            <a href="#" class="btn btn-danger btn-sm">删除</a>
          </td>
        </tr>
        </tbody></table>
    </div>
    <!-- /.box-body -->
  </div>
</template>
