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
            <option value="2">学生学号</option>
            <option value="3">学生姓名</option>
          </select>
        </div>
        <div class="form-group form-group-sm">
          <input type="text" class="form-control" placeholder="--输入查询内容--">
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>就读年级</label>
          <select name="" class="form-control">
            <option value="0">--请选择年级--</option>
            <option value="1">1年</option>
            <option value="2">3年</option>
            <option value="3">6年</option>
          </select>
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>就读班级</label>
          <select name="" class="form-control">
            <option value="0">--请选择班级--</option>
            <option value="1">3班</option>
            <option value="2">1班</option>
            <option value="3">5班</option>
          </select>
        </div>
        <div class="form-group form-group-sm" style="margin-left: 10px">
          <label>就读状态</label>
          <select name="" class="form-control">
            <option value="0">--请选择状态--</option>
            <option value="1">在读</option>
            <option value="2">休学</option>
            <option value="3">转学</option>
            <option value="4">毕业</option>
          </select>
        </div>
        <div class="form-group">
          <a href="#" class="btn btn-primary btn-sm" style="float: right">检索</a>
        </div>
      </form>
      <div style="margin-bottom: 10px;">
        <router-link to="/school/addStudent" class="btn btn-success">
          <span class="fa fa-plus"></span> 添加学生</router-link>
        <router-link
          v-if="currentRowIndex !== -1"
          :to="'/school/changeStudent/'+(currentRowIndex+1)"
          class="btn btn-warning">
          <span class="fa fa-edit"></span> 修改学生
        </router-link>
        <button class="btn btn-warning" v-else disabled>
          <span class="fa fa-edit"></span> 修改学生
        </button>
        <a href="#" class="btn btn-danger"
           @click="deleteRow(currentRowIndex, studentInfo)"
           :disabled="currentRowIndex === -1">
          <span class="fa fa-remove"></span> 删除学生
        </a>
      </div>
      <el-table :data="studentInfo"
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
          label="学生姓名">
        </el-table-column>
        <el-table-column
          prop="D_of_B"
          :show-overflow-tooltip="true"
          label="出生日期">
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
          prop="father"
          :show-overflow-tooltip="true"
          label="学生父亲">
        </el-table-column>
        <el-table-column
          prop="fa_ID_type"
          width="105"
          :show-overflow-tooltip="true"
          label="父亲证件类型">
        </el-table-column>
        <el-table-column
          prop="fa_ID_number"
          width="105"
          :show-overflow-tooltip="true"
          label="父亲证件号码">
        </el-table-column>
        <el-table-column
          prop="fa_contact"
          width="105"
          :show-overflow-tooltip="true"
          label="父亲联系方式">
        </el-table-column>
        <el-table-column
          prop="fa_company"
          width="105"
          :show-overflow-tooltip="true"
          label="父亲工作单位">
        </el-table-column>
        <el-table-column
          prop="mother"
          :show-overflow-tooltip="true"
          label="学生母亲">
        </el-table-column>
        <el-table-column
          prop="mo_ID_type"
          width="105"
          :show-overflow-tooltip="true"
          label="母亲证件类型">
        </el-table-column>
        <el-table-column
          prop="mo_ID_number"
          width="105"
          :show-overflow-tooltip="true"
          label="母亲证件号码">
        </el-table-column>
        <el-table-column
          prop="mo_contact"
          width="105"
          :show-overflow-tooltip="true"
          label="母亲联系方式">
        </el-table-column>
        <el-table-column
          prop="mo_company"
          width="105"
          :show-overflow-tooltip="true"
          label="母亲工作单位">
        </el-table-column>
        <el-table-column
          prop="responsible"
          width="95"
          :show-overflow-tooltip="true"
          label="责任人编号">
        </el-table-column>
        <el-table-column
          prop="descr"
          :show-overflow-tooltip="true"
          label="说明">
        </el-table-column>
        <el-table-column
          prop="code"
          :show-overflow-tooltip="true"
          label="学生学号">
        </el-table-column>
        <el-table-column
          prop="school"
          :show-overflow-tooltip="true"
          label="学校">
        </el-table-column>
        <el-table-column
          prop="gradeID"
          :show-overflow-tooltip="true"
          label="年级">
        </el-table-column>
        <el-table-column
          prop="classID"
          :show-overflow-tooltip="true"
          label="班级">
        </el-table-column>
        <el-table-column
          prop="status"
          :show-overflow-tooltip="true"
          label="就读状态">
        </el-table-column>
      </el-table>
      <!--<table class="table table-bordered table-hover">-->
        <!--<tbody><tr class="warning">-->
          <!--<th>序号</th>-->
          <!--<th>学校名称</th>-->
          <!--<th>学号</th>-->
          <!--<th>学生性别</th>-->
          <!--<th>所属学校</th>-->
          <!--<th>就读班级</th>-->
          <!--<th>就读状态</th>-->
          <!--<th>说明</th>-->
          <!--<th>操作</th>-->
        <!--</tr>-->
        <!--<tr>-->
          <!--<td>1</td>-->
          <!--<td>xxx</td>-->
          <!--<td>xxx</td>-->
          <!--<td>男</td>-->
          <!--<td>xxx</td>-->
          <!--<td>1年3班</td>-->
          <!--<td>在读</td>-->
          <!--<td>xxx</td>-->
          <!--<td>-->
            <!--<a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#parents">查看家长</a>-->
            <!--<router-link to="/person/changeStudent/1" class="btn btn-warning btn-sm">修改</router-link>-->
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
    <!--modal-查看家长-->
    <!--<div class="modal fade" id="parents" tabindex="-1" role="dialog" aria-labelledby="parentsList">-->
      <!--<div class="modal-dialog" role="document">-->
        <!--<div class="modal-content">-->
          <!--<div class="modal-header">-->
            <!--<button class="close" data-dismiss="modal"><span>&times;</span></button>-->
            <!--<h4 class="modal-title" id="searchGuardian">查看家长</h4>-->
          <!--</div>-->
          <!--<div class="modal-body">-->
            <!--<p>学校名称：<span>xxxxxx</span></p>-->
            <!--<p>学生姓名：<span>xxxxxx</span></p>-->
            <!--<p>学生学号：<span>xxxxxx</span></p>-->
            <!--<table class="table table-bordered">-->
              <!--<tbody><tr class="warning">-->
                <!--<th style="width: 12%;">序号</th>-->
                <!--<th>家长ID</th>-->
                <!--<th>家长姓名</th>-->
                <!--<th>性别</th>-->
                <!--<th>家长身份</th>-->
                <!--<th>关系</th>-->
                <!--<th>联系电话</th>-->
              <!--</tr>-->
              <!--<tr>-->
                <!--<td>1</td>-->
                <!--<td>xxx</td>-->
                <!--<td>xxx</td>-->
                <!--<td>男</td>-->
                <!--<td>责任人</td>-->
                <!--<td>父亲</td>-->
                <!--<td>xxxxxxx</td>-->
              <!--</tr>-->
              <!--<tr>-->
                <!--<td>2</td>-->
                <!--<td>xxx</td>-->
                <!--<td>xxx</td>-->
                <!--<td>女</td>-->
                <!--<td>监护人</td>-->
                <!--<td>奶奶</td>-->
                <!--<td>xxxxxxx</td>-->
              <!--</tr>-->
              <!--<tr>-->
                <!--<td>3</td>-->
                <!--<td>xxx</td>-->
                <!--<td>xxx</td>-->
                <!--<td>女</td>-->
                <!--<td>监护人</td>-->
                <!--<td>保姆</td>-->
                <!--<td>xxxxxxx</td>-->
              <!--</tr>-->
              <!--</tbody></table>-->
          <!--</div>-->
          <!--<div class="modal-footer">-->
            <!--<a href="#" class="btn btn-default" data-dismiss="modal">关闭</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    data () {
      return {
        studentInfo: [{
          ID: '',
          name: '',
          D_of_B: '',
          sex: '',
          address: '',
          ID_type: '',
          father: '',
          fa_ID_type: '',
          fa_ID_number: '',
          fa_contact: '',
          fa_company: '',
          mother: '',
          mo_ID_type: '',
          mo_ID_number: '',
          mo_contact: '',
          mo_company: '',
          responsible: '',
          descr: '',
          code: '',
          school: '',
          gradeID: '',
          classID: '',
          status: ''
        }],
        currentRowIndex: -1
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRowIndex = this.studentInfo.indexOf(val);
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
