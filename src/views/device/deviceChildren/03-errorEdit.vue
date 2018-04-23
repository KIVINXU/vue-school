<template>
  <!--故障编辑-->
  <div class="box">
    <div class="box-header">
    </div>
    <div class="box-body">
      <!-- form start -->
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-xs-2 control-label">学校名称：</label>
          <div class="col-xs-9">
            <input type="text" class="form-control" value="xxxxx" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="col-xs-2 control-label">设备类型：</label>
          <div class="col-xs-9">
            <input type="text" class="form-control" value="人脸识别设备1" disabled>
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">故障发生时间：</label>
          <div class="col-xs-9">
            <input type="text" class="form-control" value="2017-12-20 08:20" disabled>
          </div>
        </div>
  
        <div class="form-group">
          <label class="col-xs-2 control-label">故障描述：</label>
          <div class="col-xs-9">
            <input type="text" class="form-control" value="xxxx" disabled>
          </div>
        </div>
  
        <div class="form-group">
          <label class="col-xs-2 control-label">故障状态：</label>
          <div class="col-xs-9">
            <select name="" class="form-control">
              <option value="0" selected>--请选择故障状态--</option>
              <option value="1">未处理</option>
              <option value="2">处理中</option>
              <option value="3">已解决</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">故障处理者：</label>
          <div class="col-xs-9">
            <input type="text" class="form-control">
          </div>
        </div>
  
        <div class="form-group">
          <label class="col-xs-2 control-label">故障原因：</label>
          <div class="col-xs-9">
            <textarea class="form-control" rows="2"></textarea>
          </div>
        </div>
        
        <div class="form-group form-group">
          <label class="col-xs-2 control-label">排除时间：</label>
          <div class="col-xs-9">
            <div class="input-group input-append date form-datetime">
              <input type="text" class="form-control">
              <div class="input-group-addon">
                <i class="fa fa-calendar"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">排除方法：</label>
          <div class="col-xs-9">
            <textarea class="form-control" rows="4"></textarea>
          </div>
        </div>
        
        <div class="form-group">
          <label class="col-xs-2 control-label">说明：</label>
          <div class="col-xs-9">
            <textarea class="form-control" rows="4"></textarea>
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
//  import '../../../assets/bootstrap/dist/js/bootstrap-datetimepicker.min'
  export default{
    mounted () {
      $('.form-datetime').datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        pickerPosition: 'bottom-left',
        minuteStep: 2
      });
    }
  }
</script>
<style>
  /*@import "../../../assets/bootstrap/dist/css/bootstrap-datetimepicker.min.css";*/
</style>
