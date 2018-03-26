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
      <form class="form-inline" style="margin-bottom: 10px;">
        <div class="form-group form-group-sm">
          <label>查询对象</label>
          <select name="" class="form-control">
            <option value="0">--请选择查询对象--</option>
            <option value="1">所属学校</option>
            <option value="2">教师编号</option>
            <option value="3">教师姓名</option>
          </select>
        </div>
        <div class="form-group form-group-sm">
          <input type="text" class="form-control" placeholder="--输入查询内容--">
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>岗位</label>
          <select name="" class="form-control">
            <option value="0">--请选择岗位--</option>
          </select>
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>职位</label>
          <select name="" class="form-control">
            <option value="0">--请选择职位--</option>
          </select>
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>状态</label>
          <select name="" class="form-control">
            <option value="0">--请选择状态--</option>
            <option value="1">正常</option>
            <option value="2">培训学习</option>
            <option value="3">外派</option>
            <option value="4">离职</option>
            <option value="5">病休假</option>
            <option value="6">其他</option>
          </select>
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary btn-sm" style="float: right">检索</a>
        </div>
      </form>
      <div style="margin-bottom: 10px">
        <router-link to="/school/addTeacher" class="btn btn-success">
          <span class="fa fa-plus"></span> 添加教师</router-link>
        <router-link
          v-if="currentRowIndex !== -1"
          :to="'/school/changeTeacher/'+(currentRowIndex+1)"
          class="btn btn-warning">
          <span class="fa fa-edit"></span> 修改教师
        </router-link>
        <button class="btn btn-warning" v-else disabled>
          <span class="fa fa-edit"></span> 修改教师
        </button>
        <a href="#" class="btn btn-danger"
           @click="deleteRow(currentRowIndex, teacherInfo)"
           :disabled="currentRowIndex === -1">
          <span class="fa fa-remove"></span> 删除教师
        </a>
      </div>
      <el-table :data="teacherInfo"
                border stripe
                style="width: 100%"
                highlightCurrentRow
                @current-change="handleCurrentChange">
        <el-table-column
          prop="ID"
          :show-overflow-tooltip="true"
          label="班级编号">
        </el-table-column>
        <el-table-column
          prop="classID"
          :show-overflow-tooltip="true"
          label="班级代号">
        </el-table-column>
        <el-table-column
          prop="className"
          :show-overflow-tooltip="true"
          label="班级名称">
        </el-table-column>
        <el-table-column
          prop="gradeID"
          :show-overflow-tooltip="true"
          label="年级">
        </el-table-column>
        <el-table-column
          prop="gradeName"
          :show-overflow-tooltip="true"
          label="年级名称">
        </el-table-column>
        <el-table-column
          prop="schoolID"
          :show-overflow-tooltip="true"
          label="学校ID">
        </el-table-column>
        <el-table-column
          prop="head"
          :show-overflow-tooltip="true"
          label="班主任">
        </el-table-column>
        <el-table-column
          prop="head2"
          :show-overflow-tooltip="true"
          label="班主任2">
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
          <!--<th>所属学校</th>-->
          <!--<th>教师姓名</th>-->
          <!--<th>教师编号</th>-->
          <!--<th>教师性别</th>-->
          <!--<th>身份证号码</th>-->
          <!--<th>联系电话</th>-->
          <!--<th>联系地址</th>-->
          <!--<th>岗位</th>-->
          <!--<th>职位</th>-->
          <!--<th>是否班主任</th>-->
          <!--<th>状态</th>-->
          <!--<th>说明</th>-->
          <!--<th>操作</th>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>1</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>男</td>-->
          <!--<td>xxxxxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxxxxx</td>-->
          <!--<td>xxxxxx</td>-->
          <!--<td>是</td>-->
          <!--<td>正常</td>-->
          <!--<td>xxxx</td>-->
          <!--<td>-->
            <!--<router-link to="/person/changeTeacher/1" class="btn btn-warning btn-sm">修改</router-link>-->
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
        teacherInfo: [{
          ID: '',
          name: '',
          sex: '',
          ID_type: '',
          ID_number: '',
          contact: '',
          contact2: '',
          address: '',
          schoolID: '',
          flag: '',
          descr: ''
        }],
        currentRowIndex: -1
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRowIndex = this.teacherInfo.indexOf(val);
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
