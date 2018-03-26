<template>
  <div class="col-sm-8">
    <div class="box">
      <div class="box-header">
        <div style="float: right">
          <el-button type="primary" icon="el-icon-upload">导入</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
      <!-- /.box-header -->
      <div class="box-body">
        <form class="form-inline" style="margin-bottom: 10px">
          <div class="form-group form-group-sm">
            <label>识别结果</label>
            <select name="" class="form-control">
              <option value="0">--请选择识别结果--</option>
              <option value="1">教师</option>
              <option value="2">员工</option>
              <option value="3">家长</option>
              <option value="4">访客</option>
              <option value="5">其他</option>
            </select>
          </div>
          <div class="form-group">
            <a href="#" class="btn btn-primary" style="float: right">检索</a>
          </div>
        </form>
        <table class="table table-bordered table-hover">
          <tbody><tr class="warning">
            <th>序号</th>
            <th>识别结果</th>
            <th>反馈信息</th>
            <th>说明</th>
            <th>操作</th>
          </tr>
          <tr>
            <td>1</td>
            <td>成功</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>
              <router-link to="/device/changeCallbackMsg/1" class="btn btn-warning btn-sm">修改</router-link>
              <a href="#" class="btn btn-danger btn-sm">删除</a>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>成功</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>
              <router-link to="/device/changeCallbackMsg/2" class="btn btn-warning btn-sm">修改</router-link>
              <a href="#" class="btn btn-danger btn-sm">删除</a>
            </td>
          </tr>
          </tbody></table>
      </div>
      <!-- /.box-body -->
    </div>
  </div>
</template>
