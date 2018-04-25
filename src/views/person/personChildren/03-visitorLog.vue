<template>
  <div class="box">
    <div class="box-header">
    </div>
    <!-- /.box-header -->
    <div class="box-body">
      <form class="form-inline" style="margin-bottom: 10px">
        <div class="form-group form-group-sm">
          <label class="control-label">学校名称</label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group form-group-sm">
          <label class="control-label">访客姓名</label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group form-group-sm">
          <label class="control-label">故障排除时间：</label>
          <div class="input-group input-append date form-datetime">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="form-group form-group-sm">
          <label class="control-label">到</label>
          <div class="input-group input-append date form-datetime">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="form-group form-group-sm">
          <a href="#" class="btn btn-primary btn-sm" style="float: right">检索</a>
        </div>
      </form>
      <table class="table table-bordered table-hover">
        <tbody><tr class="success">
          <th>序号</th>
          <th>访客姓名</th>
          <th>访问学校</th>
          <th>访问对象</th>
          <th>访问对象电话</th>
          <th>来访事由</th>
          <th>来访时间</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>1</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
        </tr>
        <tr>
          <td>2</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxxxxx</td>
          <td>xxxxxx</td>
        </tr>
        </tbody></table>
    </div>
    <!-- /.box-body -->
  </div>
</template>
<script>
//  import '../../../assets/bootstrap/dist/js/bootstrap-datetimepicker.min'
  export default{
    mounted () {
      $('.form-datetime').datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        minuteStep: 2
      });
    }
  }
</script>
<style>
  /*@import "../../../assets/bootstrap/dist/css/bootstrap-datetimepicker.min.css";*/
</style>
