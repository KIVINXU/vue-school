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
        @click="handleCreate">添加人脸图片</el-button>
      <el-button
        :disabled="currentRowIndex === -1"
        type="warning"
        icon="el-icon-edit-outline"
        @click="handleUpdate">修改人脸图片</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete(currentRowIndex, facePics)"
        :disabled="currentRowIndex === -1">删除人脸图片</el-button>
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
    <el-col :span="24">
      <el-table :data="facePics"
                border stripe
                style="width: 100%"
                ref="facePicsTable"
                v-loading="listLoading"
                element-loading-text="加载中，请稍后"
                highlightCurrentRow
                @current-change="handleCurrentChange">
        <el-table-column
          prop="ID"
          :show-overflow-tooltip="true"
          label="图片标示码">
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="图片名称">
        </el-table-column>
        <el-table-column
          prop="size"
          :show-overflow-tooltip="true"
          label="图片大小">
        </el-table-column>
        <el-table-column
          prop="fdID"
          :show-overflow-tooltip="true"
          label="库标示码">
        </el-table-column>
        <el-table-column
          prop="eqpID"
          :show-overflow-tooltip="true"
          label="设备编号">
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
    <!--添加/修改人脸图片-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px">
        <el-form-item label="图片标示码" prop="ID">
          <el-input v-model="temp.ID"></el-input>
        </el-form-item>
        <el-form-item label="图片名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="图片大小" prop="size">
          <el-input v-model="temp.size"></el-input>
        </el-form-item>
        <el-form-item label="库标示码" prop="fdID">
          <el-input v-model="temp.fdID"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="eqpID">
          <el-input v-model="temp.eqpID"></el-input>
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
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";
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
          {key: '1', label: '图片标示码'},
          {key: '2', label: '图片名称'},
          {key: '3', label: '图片大小'}
        ],
        //加载图标
        listLoading: true,
        facePics: [],
        currentRowIndex: -1,
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加人脸图片',
          update: '修改人脸图片'
        },
        //对话框内容
        temp: {
          ID: '',
          name: '',
          size: '',
          fdID: '',
          eqpID: '',
          descr: ''
        },
        //内容验证规则
        rules: {
          ID: [{ required: true, message: '图片标示码不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '图片名称不能为空', trigger: 'blur' }],
          size: [{ required: true, message: '图片大小不能为空', trigger: 'blur' }],
          fdID: [{ required: true, message: '库标示码不能为空', trigger: 'blur' }],
          eqpID: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.getList();
    },
    methods: {
      //获取列表
      getList () {
        this.listLoading = true;
        //请求数据
        fetchList('/facePics', this.listQuery).then( response => {
          this.faceLibs = response.data.facePics;
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
        this.currentRowIndex = this.facePics.indexOf(val);
      },
      //删除列
      deleteRow(index, row) {
        if(index !== -1) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
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
          name: '',
          IP: '',
          port: '',
          username: '',
          passwd: '',
          model: '',
          types: '',
          baseparm: '',
          extparm: '',
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
