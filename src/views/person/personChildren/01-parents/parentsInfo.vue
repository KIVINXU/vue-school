<template>
  <div class="box">
    <div class="box-header">
      <div class="inline" style="float: right">
        <a href="#" class="btn btn-default" style="margin-left: 10px">下载模板</a>
        <a href="#" class="btn btn-default" style="margin-left: 10px">导入Excel</a>
        <a href="#" class="btn btn-default" style="margin-left: 10px">导出Excel</a>
      </div>
    </div>
    <!-- /.box-header -->
    <div class="box-body">
      <router-link to="/person/addParents" class="btn btn-success">
        <span class="fa fa-plus"></span> 添加家长</router-link>
      <router-link
        v-if="currentRowIndex !== -1"
        :to="'/person/changeParents/'+(currentRowIndex+1)"
        class="btn btn-warning">
        <span class="fa fa-edit"></span> 修改家长
      </router-link>
      <button class="btn btn-warning" v-else disabled>
        <span class="fa fa-edit"></span> 修改家长
      </button>
      <a href="#" class="btn btn-danger"
         @click="deleteRow(currentRowIndex, parentsInfo)"
         :disabled="currentRowIndex === -1">
        <span class="fa fa-remove"></span> 删除家长
      </a>
      <form class="form-inline" style="margin-bottom: 10px;float: right;">
        <div class="form-group form-group-sm">
          <label>查询对象</label>
          <select name="" class="form-control">
            <option value="0">--请选择查询对象--</option>
            <option value="1">家长姓名</option>
            <option value="2">学生姓名</option>
            <option value="3">学生学号</option>
          </select>
        </div>
        <div class="form-group form-group-sm">
          <input type="text" class="form-control" placeholder="--输入查询内容--">
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>家长身份</label>
          <select name="" class="form-control">
            <option value="0">--请选择家长身份--</option>
            <option value="1">责任人</option>
            <option value="2">监护人</option>
          </select>
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary btn-sm" style="float: right">检索</a>
        </div>
      </form>
      <el-table :data="parentsInfo"
                border stripe
                style="width: 100%"
                highlightCurrentRow
                @current-change="handleCurrentChange">
        <el-table-column
          prop="ID"
          :show-overflow-tooltip="true"
          label="证件编号">
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          :show-overflow-tooltip="true"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="address"
          :show-overflow-tooltip="true"
          label="住址">
        </el-table-column>
        <el-table-column
          prop="ID_type"
          :show-overflow-tooltip="true"
          label="证件类型">
        </el-table-column>
        <el-table-column
          prop="contact"
          :show-overflow-tooltip="true"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="relation"
          :show-overflow-tooltip="true"
          label="人员关系">
        </el-table-column>
        <el-table-column
          prop="types"
          :show-overflow-tooltip="true"
          label="人员分类">
        </el-table-column>
        <el-table-column
          prop="relNum"
          :show-overflow-tooltip="true"
          label="关联数">
        </el-table-column>
        <el-table-column
          prop="face_key"
          :show-overflow-tooltip="true"
          label="人脸值">
        </el-table-column>
        <el-table-column
          prop="size"
          :show-overflow-tooltip="true"
          label="图片大小">
        </el-table-column>
        <el-table-column
          prop="ctime"
          :show-overflow-tooltip="true"
          label="图片时间">
        </el-table-column>
        <el-table-column
          prop="identity"
          width="95"
          :show-overflow-tooltip="true"
          label="证件人脸值">
        </el-table-column>
        <el-table-column
          prop="relNum"
          :show-overflow-tooltip="true"
          label="关联数">
        </el-table-column>
        <el-table-column
          prop="flag"
          :show-overflow-tooltip="true"
          label="标志">
        </el-table-column>
        <el-table-column
          prop="descr"
          :show-overflow-tooltip="true"
          label="说明">
        </el-table-column>
      </el-table>
      <!--<table class="table table-bordered table-hover">-->
        <!--<tbody><tr class="warning">-->
          <!--<th>序号</th>-->
          <!--<th>家长姓名</th>-->
          <!--<th>性别</th>-->
          <!--<th>学生姓名</th>-->
          <!--<th>所属学校</th>-->
          <!--<th>家长身份</th>-->
          <!--<th>关系</th>-->
          <!--<th>身份证号码</th>-->
          <!--<th>联系电话</th>-->
          <!--<th>联系地址</th>-->
          <!--<th>说明</th>-->
          <!--<th>操作</th>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>1</td>-->
          <!--<td>xxx</td>-->
          <!--<td>男</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>责任人</td>-->
          <!--<td>父亲</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxxxxx</td>-->
          <!--<td>xxxx</td>-->
          <!--<td>xxxx</td>-->
          <!--<td>-->
            <!--<router-link to="/person/changeParents/1" class="btn btn-warning btn-sm">修改</router-link>-->
            <!--<a href="#" class="btn btn-danger btn-sm">删除</a>-->
          <!--</td>-->
        <!--</tr>-->
        <!--</tbody></table>-->
    </div>
    <!-- /.box-body -->
    <div class="box-footer">
      <div class="bg-warning">
        <p>※由于数据量很大，建议优先选择检索条件后查询。默认不直接显示数据。</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        parentsInfo: [{
          ID: '',
          name: '',
          sex: '',
          address: '',
          ID_type: '',
          contact: '',
          relation: '',
          types: '',
          relNum: '',
          face_key: '',
          size: '',
          ctime: '',
          identity: '',
          flag: '',
          descr: ''
        }],
        currentRowIndex: -1
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRowIndex = this.parentsInfo.indexOf(val);
      },
      deleteRow(index, row) {
        if(index !== -1) {
          row.splice(index, 1);
        }
      }
    }
  }
</script>
<style>
  .el-table thead {
    color: #333;
  }
</style>
