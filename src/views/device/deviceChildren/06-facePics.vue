<template>
  <div>
    <el-row type="flex" justify="space-between" style="margin-bottom: 10px">
      <el-col :xs="18" :sm="18" :md="10" :lg="8">
        <el-input placeholder="请输入查询内容">
          <el-select v-model="listQuery.option" placeholder="查询对象" slot="prepend" style="width: 100px">
            <el-option
              v-for="item in searchOption"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
          <el-button
            type="primary"
            @click="handleSearch"
            icon="el-icon-search" slot="append">
          </el-button>
        </el-input>
      </el-col>
      <el-col :xs="5" :sm="3" :md="4" :lg="2">
        <el-dropdown>
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="handleCreate"
                         :disabled="true">
                添加图片
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(facePics[currentRowIndex])"
                         :disabled="true">
                修改图片
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, facePics)"
                         :disabled="currentRowIndex === -1">
                删除图片
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-upload">
                导入
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-download">
                导出
              </el-button>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="facePics"
                  border
                  style="width: 100%"
                  ref="facePicsTable"
                  highlightCurrentRow
                  @current-change="handleCurrentChange">
          <el-table-column prop="ID" :show-overflow-tooltip="true" label="图片编码"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="图片名称"></el-table-column>
          <el-table-column prop="size" :show-overflow-tooltip="true" label="图片大小(b)"></el-table-column>
          <el-table-column prop="eqpID" :show-overflow-tooltip="true" label="设备编号" ></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说明"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="18" :sm="18" :md="10" :lg="8">
        <!--分页条-->
        <el-pagination
          style="margin-top: 10px;margin-left: -9px;"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[20,50,100]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!--删除-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span><i class="el-icon-warning"></i>是否确认删除这行数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, facePics)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList} from '@/api/table'
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";

  export default {
    components: {
      ElDialog,
      ElFormItem
    },
    data() {
      return {
        //搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 3,
        searchOption: [
          {key: '1', label: '图片标示码'},
          {key: '2', label: '图片名称'},
          {key: '3', label: '图片大小'}
        ],

        //加载图标
        listLoading: true,
        currentRowIndex: -1,
        //图片库数据
        facePics: [
          {
            ID: '12345678900',
            name: '汪涵',
            size: '12.3',
            //fdID: '',
            eqpID: '100110011001',
            descr: ''
          },
          {
            ID: '22345678900',
            name: '谢娜',
            size: '22.7',
            //fdID: '',
            eqpID: '100110011001',
            descr: '汪涵家长'
          },
          {
            ID: '22345678900',
            name: '谢娜',
            size: '22.7',
            //fdID: '',
            eqpID: '100110011001',
            descr: '汪涵家长'
          },
        ],
         //对话框状态
        // dialogVisible: false,
        deleteDialogVisible:false,
        // //对话框状态
        // dialogStatus: '',
        // //对话框标题
        // textMap: {
        //   create: '添加人脸图片',
        //   update: '修改人脸图片'
        // },
        // //对话框内容
        // temp: {
        //   ID: '',
        //   name: '',
        //   size: '',
        //   fdID: '',
        //   eqpID: '',
        //   descr: ''
        // },
        //内容验证规则
        // rules: {
        //   ID: [{required: true, message: '图片标示码不能为空', trigger: 'blur'}],
        //   name: [{required: true, message: '图片名称不能为空', trigger: 'blur'}],
        //   size: [{required: true, message: '图片大小不能为空', trigger: 'blur'}],
        //   fdID: [{required: true, message: '库标示码不能为空', trigger: 'blur'}],
        //   eqpID: [{required: true, message: '设备编号不能为空', trigger: 'blur'}],
        // }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //获取列表
      getList() {
        this.listLoading = true;
        //请求数据
        // fetchList('/facePics', this.listQuery).then(response => {
        //   this.faceLibs = response.data.facePics;
        //   this.total = response.data.total;
        //   this.listLoading = false;
        // })
      },
      //搜索内容
      handleSearch() {
        console.log('搜索')
      },
      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.facePics.indexOf(val);
      },
      //删除列
      deleteRow(index, row) {
        if (index !== -1) {
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      //改变页面事件
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      resetTemp() {
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
      //   this.resetTemp();
      //   this.dialogStatus = 'create';
      //   this.dialogVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate();
      //   })
       },
      // //添加完毕上传
      // createData() {
      //   console.log('添加完毕上传');
      // },
      // //修改对话框
       handleUpdate(row) {
      //   this.temp = Object.assign({}, row);
      //   this.dialogStatus = 'update';
      //   this.dialogVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate();
      //   })
       },
      // //修改完毕上传
      // updateData() {
      //   console.log('修改完毕上传');
      // },
      //descr剩余长度计算
      leftLength() {
        return 128 - this.temp.descr.length
      },
      //删除行
      handleDelete() {
        this.deleteDialogVisible = true;
        console.log("开始删除");
      },
      rowDelete(index, row) {
        if (index !== -1) {
          this.total=this.total-1,
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000,
          });
          row.splice(index, 1);
          this.deleteDialogVisible = false;
        }
      },
    }
  }
</script>
<style>
  .el-table--small td, .el-table--small th {
    padding: 0;
    font-size: 14px;
    text-align: center;
  }

  .el-table .cell, .el-table th div {
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
