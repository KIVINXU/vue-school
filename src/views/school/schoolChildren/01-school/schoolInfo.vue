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
        @click="handleCreate">添加学校</el-button>
      <el-button
        :disabled="currentRowIndex === -1"
        type="warning"
        icon="el-icon-edit-outline"
        @click="handleUpdate">修改学校</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete(currentRowIndex, schoolInfo)"
        :disabled="currentRowIndex === -1">删除学校</el-button>
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
      <el-table :data="schoolInfo"
                border
                ref="schoolTable"
                v-loading="listLoading"
                element-loading-text="加载中，请稍后"
                style="width: 100%"
                highlightCurrentRow
                @current-change="handleCurrentChange">
        <el-table-column
          prop="ID"
          :show-overflow-tooltip="true"
          label="学校代码">
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="学校名称">
        </el-table-column>
        <el-table-column
          prop="types"
          :show-overflow-tooltip="true"
          label="学校类型">
        </el-table-column>
        <el-table-column
          prop="address"
          :show-overflow-tooltip="true"
          label="学校地址">
        </el-table-column>
        <el-table-column
          prop="masterId"
          :show-overflow-tooltip="true"
          label="负责人">
        </el-table-column>
        <el-table-column
          prop="director"
          :show-overflow-tooltip="true"
          label="主管部门">
        </el-table-column>
        <el-table-column
          prop="status"
          :show-overflow-tooltip="true"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="eqpId"
          :show-overflow-tooltip="true"
          label="设备ID">
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
    
    <!--添加/修改学校信息-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px">
        <el-form-item label="学校代码" prop="ID">
          <el-input v-model="temp.ID"></el-input>
        </el-form-item>
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="学校类型" prop="IP">
          <el-select v-model="temp.types"
                     placeholder="请选择学校类型">
            <el-option
              v-for="item in typesOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校地址" prop="port">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="username">
          <el-input v-model="temp.masterId"></el-input>
        </el-form-item>
        <el-form-item label="主管部门" prop="passwd">
          <el-input v-model="temp.director"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="model">
          <el-select v-model="temp.status"
                     placeholder="请选择状态">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备ID" prop="types">
          <el-input v-model="temp.eqpId"></el-input>
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
      return {
        //搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: null,
        searchOption: [
          {key: '1', label: '学校代号'},
          {key: '2', label: '学校名称'},
          {key: '3', label: '学校类型'}
        ],
        //加载图标
        listLoading: true,
        schoolInfo: [],
        currentRowIndex: -1,
        //对话框内容
        temp: {
          ID: '',
          name: '',
          types: '',
          address: '',
          masterId: '',
          director: '',
          status: '',
          eqpId: '',
          descr: ''
        },
        //学校类型选项
        typesOption: [{
          value: '0',
          label: '幼儿园'
        },{
          value: '1',
          label: '小学'
        },{
          value: '2',
          label: '初中'
        },{
          value: '3',
          label: '其他'
        }],
        //学校状态选项
        statusOption: [{
          value: '-1',
          label: '注销'
        },{
          value: '0',
          label: '正常'
        },{
          value: '1',
          label: '停办'
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
          create: '添加学校',
          update: '修改学校'
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
        fetchList('/schoolInfo', this.listQuery).then( response => {
          this.schoolInfo = response.data.schoolInfo;
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
        this.currentRowIndex = this.schoolInfo.indexOf(val);
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
      //改变当前页
      handleCurrentChange (val) {
        this.listQuery.page = val;
        this.getList();
      },
      resetTemp () {
        this.temp = {
          ID: '',
          name: '',
          types: '',
          address: '',
          masterId: '',
          director: '',
          status: '',
          eqpId: '',
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
      },
    }
  }
</script>
<style>
  .el-table thead {
    color: #333;
  }
</style>
