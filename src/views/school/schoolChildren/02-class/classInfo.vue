<template>
  <el-row>
    <el-col :span="24">
      <div style="float: right">
        <el-button type="primary" icon="el-icon-upload">导入</el-button>
        <el-button type="primary" icon="el-icon-download">导出</el-button>
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate">添加班级</el-button>
      <el-button
        :disabled="currentRowIndex === -1"
        type="warning"
        icon="el-icon-edit-outline"
        @click="handleUpdate">修改班级</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete(currentRowIndex, classInfo)"
        :disabled="currentRowIndex === -1">删除班级</el-button>
      <el-form :inline="true" :model="listQuery" style="display: inline;margin-left: 20px">
        <el-form-item>
          <el-select clearable v-model="listQuery.option" placeholder="选择查询对象">
            <el-option
              v-for="item in searchOption"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入查询内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            icon="el-icon-search">检索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- /header -->
    <el-col :span="24">
      <el-table :data="classInfo"
                border
                ref="classTable"
                v-loading="listLoading"
                element-loading-text="加载中，请稍后"
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
          label="学校代号">
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
      <!--分页条-->
      <el-pagination
        style="margin-top: 10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,40,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-col>
    <!-- /.表格结束 -->
    
    <!--添加/修改班级信息-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px">
        <el-form-item label="班级编号" prop="ID">
          <el-input v-model="temp.ID"></el-input>
        </el-form-item>
        <el-form-item label="班级代号" prop="classID">
          <el-input v-model="temp.classID"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="temp.className"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="gradeID">
          <el-input v-model="temp.gradeID"></el-input>
        </el-form-item>
        <el-form-item label="年级名称" prop="gradeName">
          <el-input v-model="temp.gradeName"></el-input>
        </el-form-item>
        <el-form-item label="学校ID" prop="schoolID">
          <el-select v-model="temp.schoolID"
                     placeholder="请选择学校ID">
            <el-option
              v-for="item in schoolIDOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班主任" prop="head">
          <el-select v-model="temp.head"
                     placeholder="请选择班主任">
            <el-option
              v-for="item in headOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班主任2" prop="head2">
          <el-input v-model="temp.masterId"></el-input>
        </el-form-item>
        <el-form-item label="标志" prop="flag">
          <el-select v-model="temp.flag"
                     placeholder="请选择标志">
            <el-option
              v-for="item in flagOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="descr">
          <el-input
            type="textarea"
            :maxlength="128"
            v-model.trim="temp.descr"
            :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="el-dialog__footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import { fetchList } from '@/api/table'
  import ElFormItem from "../../../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElDialog from "../../../../../node_modules/element-ui/packages/dialog/src/component.vue";
  export default {
    components: {
      ElDialog,
      ElFormItem},
    data () {
      return {//搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: null,
        searchOption: [
          {key: '1', label: '班级编号'},
          {key: '2', label: '班级代号'},
          {key: '3', label: '班级名称'}
        ],
        //加载图标
        listLoading: true,
        classInfo: [],
        currentRowIndex: -1,
        //对话框内容
        temp: {
          ID: '',
          classID: '',
          className: '',
          gradeID: '',
          gradeName: '',
          shcoolID: '',
          head: '',
          head2: '',
          flag: '',
          descr: ''
        },
        //学校ID选项
        schoolIDOption: [{
          value: '0',
          label: 'ID1'
        },{
          value: '1',
          label: 'ID2'
        },{
          value: '2',
          label: 'ID3'
        },{
          value: '3',
          label: 'ID4'
        }],
        //
        headOption: [{
          value: '0',
          label: '班主任1'
        },{
          value: '1',
          label: '班主任2'
        },{
          value: '2',
          label: '班主任3'
        },{
          value: '3',
          label: '班主任4'
        }],
        //标志选项
        flagOption: [{
          value: '0',
          label: '0'
        },{
          value: '1',
          label: '1'
        },{
          value: '2',
          label: '2'
        }],
        //内容验证规则
        rules: {
          ID: [{ required: true, message: '学校代码不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '学校名称不能为空', trigger: 'blur' }],
          types: [{ required: true, message: '请选择学校类型', trigger: 'change' }],
          address: [{ required: true, message: '学校地址不能为空', trigger: 'blur' }],
          masterId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
          director: [{ required: true, message: '主管部门不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '请选择学校状态', trigger: 'change' }],
          eqpId: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
        },
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加班级',
          update: '修改班级'
        },
      }
    },
    created () {
      this.getList();
    },
    methods: {
      //获取列表
      getList () {
        this.listLoading = true;
        fetchList('/classInfo', this.listQuery).then( response => {
          this.classInfo = response.data.classInfo;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      //搜索内容
      handleSearch () {
        console.log('搜索')
      },
      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.classInfo.indexOf(val);
      },
      //删除列
      deleteRow(index, row) {
        if(index !== -1) {
          row.splice(index, 1);
        }
      },
      //改变显示条目
      handleSizeChange (val) {
        this.listQuery.limit = val;
        this.getList();
      },
      resetTemp () {
        this.temp = {
          ID: '',
          classID: '',
          className: '',
          gradeID: '',
          gradeName: '',
          shcoolID: '',
          head: '',
          head2: '',
          flag: '',
          descr: ''
        }
      },
      //添加对话框
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //添加完毕上传
      createData () {
        console.log('添加完毕上传');
      },
      //修改对话框
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData () {
        console.log('修改完毕上传');
      },
      //descr剩余长度计算
      leftLength () {
        return 128 - this.temp.descr.length
      }
    }
  }
</script>
<style>
  .el-table thead {
    color: #333;
  }
</style>
