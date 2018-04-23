<template>
  <div class="box">
    <!--设备故障一览-->
    <div class="box-header">
      <form class="form-inline" style="margin-top: 15px">
        <div class="margin">
          <div class="form-group form-group-sm">
            <label class="control-label">学校名称：</label>
            <input type="text" class="form-control">
          </div>
    
          <div class="form-group form-group-sm">
            <label class="control-label">设备类型：</label>
            <select name="" class="form-control">
              <option value="0" selected>--请选择设备类型--</option>
              <option value="1">人脸识别设备1</option>
              <option value="2">人脸识别设备2</option>
              <option value="3">人脸识别设备3</option>
            </select>
          </div>
    
          <div class="form-group form-group-sm">
            <label class="control-label">故障状态：</label>
            <select name="" class="form-control">
              <option value="0" selected>--请选择故障状态--</option>
              <option value="1">未处理</option>
              <option value="2">处理中</option>
              <option value="3">已解决</option>
            </select>
          </div>
        </div>
        
        <div class="margin">
          <div class="form-group">
            <label class="control-label">故障发生时间：</label>
            <div class="input-group input-append date form-datetime">
              <div class="input-group-addon">
                <i class="fa fa-calendar"></i>
              </div>
              <input type="text" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label">到</label>
            <div class="input-group input-append date form-datetime">
              <div class="input-group-addon">
                <i class="fa fa-calendar"></i>
              </div>
              <input type="text" class="form-control">
            </div>
          </div>
        </div>
        
        <div class="margin">
          <div class="form-group">
            <label class="control-label">故障排除时间：</label>
            <div class="input-group input-append date form-datetime">
              <div class="input-group-addon">
                <i class="fa fa-calendar"></i>
              </div>
              <input type="text" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label">到</label>
            <div class="input-group input-append date form-datetime">
              <div class="input-group-addon">
                <i class="fa fa-calendar"></i>
              </div>
              <input type="text" class="form-control">
            </div>
          </div>
  
          <button class="btn btn-primary">
            <i class="fa fa-search"></i> 检索
          </button>
        </div>
      </form>
    </div>
    <!--搜索数据-->
    <div class="box-body">
      <table class="table table-bordered table-hover table-condensed">
        <thead>
        <tr class="warning">
          <th>序号</th>
          <th>学校名称</th>
          <th>设备类型</th>
          <th>故障发生时间</th>
          <th>故障描述</th>
          <th>故障状态</th>
          <th>故障原因</th>
          <th>故障处理者</th>
          <th>排除方法</th>
          <th>排除时间</th>
          <th>说明</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>xxx</td>
          <td>人脸识别设备1</td>
          <td>2016-03-16</td>
          <td>ssssss</td>
          <td>
            <div class="errorState animated"></div>
            <div class="errorState animated"></div>
            <div class="errorState animated"></div>
          </td>
          <td>xxxx</td>
          <td>xxxx</td>
          <td>xxxx</td>
          <td>2016-03-16</td>
          <td>xxx</td>
          <td><router-link to="/device/errorEdit/1" class="btn btn-primary btn-sm">编辑</router-link></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="box-footer">
      <div class="bg-danger">※红色指示代表“未处理”状态</div>
      <div class="bg-danger">※黄色指示代表“处理中”状态</div>
      <div class="bg-danger">※绿色指示代表“已解决”状态</div>
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
        minuteStep: 2
      });
    }
  }
</script>

<style>
  /*@import "../../../assets/bootstrap/dist/css/bootstrap-datetimepicker.min.css";*/
  .errorState{
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
    background-color: #f00;
    -webkit-animation: twinkling 1s infinite ease-in-out
  }
  .animated{
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
  }
  @-webkit-keyframes twinkling{
    0%{
      opacity: 0.1;
    }
    25%{
      opacity: 0.5;
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity: 0.5;
    }
  }
  @keyframes twinkling{
    0%{
      opacity: 0.1;
    }
    25%{
      opacity: 0.5;
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity: 0.5;
    }
  }
</style>
