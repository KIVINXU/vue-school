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
            <select name="" class="form-control" v-model="selected">
              <option value="0">--请选择菜单级别--</option>
              <option value="1">一级菜单</option>
              <option value="2">二级菜单</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-xs-2 control-label">选择上级菜单：</label>
          <div class="col-xs-8">
            <select name="" class="form-control" :disabled="selected === '1'">
              <option value="0">--请选择上级菜单--</option>
              <option value="1">终端设备</option>
              <option value="2">人员信息</option>
              <option value="3">照片管理</option>
              <option value="4">系统设置</option>
            </select>
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
  
  </div>
</template>
<script>
  export default {
    data () {
      return {
        selected: '0'
      }
    }
  }
</script>
