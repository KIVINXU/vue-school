<template>
  <div class="col-sm-10">
    <div class="box">
      <div class="box-header">
        <div class="inline" style="float: right">
          <router-link to="/permission/addMenu" class="btn btn-default">添加菜单</router-link>
        </div>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <div class="col-sm-12">
          <table class="table table-bordered table-hover">
            <tbody class="text-center">
            <tr class="success">
              <th class="text-center">序号</th>
              <th class="text-center">一级菜单</th>
              <th class="text-center">二级菜单</th>
              <th class="text-center">页面链接</th>
              <th class="text-center">是否显示</th>
              <th class="text-center">说明</th>
              <th class="text-center">操作</th>
            </tr>
            <tr>
              <td>1</td>
              <td>后台菜单管理</td>
              <td></td>
              <td>#</td>
              <td>显示</td>
              <td>xxx</td>
              <td>
                <router-link to="/permission/addMenu" class="btn btn-info btn-sm">添加二级菜单</router-link>
                <router-link to="/permission/changeMenu/1" class="btn btn-warning btn-sm">修改</router-link>
                <a href="#" class="btn btn-danger btn-sm">删除</a>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td></td>
              <td>|__后台菜单一览</td>
              <td>#</td>
              <td>显示</td>
              <td>xxx</td>
              <td>
                <router-link to="/permission/changeMenu/2" class="btn btn-warning btn-sm">修改</router-link>
                <a href="#" class="btn btn-danger btn-sm">删除</a>
              </td>
            </tr>
            </tbody></table>
        </div>
      </div>
    </div>
  </div>
</template>
