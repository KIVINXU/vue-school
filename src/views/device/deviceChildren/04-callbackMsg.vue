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
                         @click="handleCreate">
                添加信息
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(callbackHome[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改信息
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, callbackHome)"
                         :disabled="currentRowIndex === -1">
                删除信息
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
      <el-col>
        <el-table :data="callbackHome" border
                  ref="callbackTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="ID" :show-overflow-tooltip="true" label="学校编号" width="100px"></el-table-column>
          <el-table-column prop="adver" :show-overflow-tooltip="true" label="标题广告"></el-table-column>
          <el-table-column prop="welcome" :show-overflow-tooltip="true" label="欢迎词" width="100px"></el-table-column>
          <el-table-column prop="call" :show-overflow-tooltip="true" label="称呼" width="88px"></el-table-column>
          <el-table-column prop="assist" :show-overflow-tooltip="true" label="辅助信息" width="100px"></el-table-column>
          <el-table-column prop="date" :show-overflow-tooltip="true" label="日期" width="88px"></el-table-column>
          <el-table-column prop="time" :show-overflow-tooltip="true" label="时间" width="88px"></el-table-column>
          <el-table-column prop="fdid" :show-overflow-tooltip="true" label="人脸图片"></el-table-column>
        </el-table>
      </el-col>
      <!-- /.表格结束 -->
    </el-row>
    <el-row>
      <el-col :xs="18" :sm="18" :md="10" :lg="9">
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
        <el-button type="primary" @click="rowDelete(currentRowIndex, callbackHome)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               style="margin-top: -30px"
               label-position="right"
               label-width="100px">
            <el-form-item label="学校编号" prop="id">
              <el-input v-model="temp.ID" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="name">
              <el-input v-model="temp.adver" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="欢迎词" prop="username">
             <el-input v-model="temp.welcome" :maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="称呼" prop="username">
              <el-input v-model="temp.call" :maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="日期" prop="passwd">
              <el-input v-model="temp.date"  :maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="IP">
              <el-input v-model="temp.time"></el-input>
            </el-form-item>
            <el-form-item label="人脸图片" prop="port">
              <el-input v-model="temp.fdid"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" style="height: 0; margin-top: -50px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, createTable } from '@/api/table'
  export default {

    data() {
      // //二次密码验证
      // var validatePass = (rule, value, callback) => {
      //   if(value === '') {
      //     callback(new Error('请再次输入密码'));
      //   }else if(value !== this.temp.passwd) {
      //     callback(new Error('两次输入密码不一致！'))
      //   }else {
      //     callback();
      //   }
      // };
      // //IP地址验证
      // var validateIP = (rule, value, callback) => {
      //   const IPReg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      //   if(!IPReg.test(value)) {
      //     callback(new Error('请输入正确的IP地址'));
      //   }else {
      //     callback();
      //   }
      // };
      return {
        //搜索内容
        listQuery: {
          page: 1,
          limit: 10,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 2,
        searchOption: [
          {key: '1', label: '学校编号'},
          {key: '2', label: '其他'},
        ],
        callbackHome: [
          {
            ID: '1001',
            adver: '欢迎观临鹿城区第三小学',
            welcome: '欢迎您',
            call: '家长',
            assist: '',
            date: '2018-3-26',
            time: '11：11',
            fdid: '',
          },
          {
            ID: '1002',
            adver: '欢迎观临鹿城区第三小学',
            welcome: '欢迎您',
            call: '家长',
            assist: '',
            date: '2018-3-26',
            time: '11：11',
            fdid: '',
          },
        ],
        //行数
        currentRowIndex: -1,
        //加载中
        listLoading: true,
        //-----添加/修改对话框--------
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加信息',
          update: '修改信息'
        },
        //对话框内容
        temp: {
          ID: '',
          adver: '',
          welcome: '',
          call: '',
          assist: '',
          date: '',
          time: '',
          fdid: '',
        },
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          ID: [{required: true, message: '设备序列号不能为空', trigger: 'blur'}],
          // name: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
          // IP: [
          //   {required: true, message: '默认IP不能为空', trigger: 'blur'},
          //   {validator: validateIP, trigger: 'blur'}
          // ],
          // port: [{required: true, message: '端口不能为空', trigger: 'blur'}],
          // username: [{required: true, message: '登录用户名不能为空', trigger: 'blur'}],
          // passwd: [{required: true, message: '登录密码不能为空', trigger: 'blur'}],
          // passwd2: [{validator: validatePass, trigger: 'change'}],
          // model: [{required: true, message: '设备型号不能为空', trigger: 'blur'}],
        }
      }
    },
    created () {
      this.getList();
    },
    methods: {
      //获取列表
      getList () {
//        this.listLoading = true;
//        fetchList('/callbackHome', this.listQuery).then( response => {
//          this.callbackHome = response.data.callbackHome;
//          this.total = response.data.total;
//          this.listLoading = false;
//        })
      },
      handleSearch() {
        console.log('搜索')
      },
      resetTemp() {
        this.temp = {
          ID: '',
          adver: '',
          welcome: '',
          call: '',
          assist: '',
          date: '',
          time: '',
          fdid: '',
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
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            createTable(this.temp).then(() => {
//              this.callbackHome.unshift(this.temp);
//              this.dialogVisible = false;
//              this.$notify({
//                title: '成功',
//                message: '创建成功',
//                type: 'success',
//                duration: 2000
//              })
//            })
            this.total=this.total+1,
              this.callbackHome.push(this.temp);
            this.dialogVisible = false;
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }
        })
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
      updateData() {
        for (const v of this.callbackHome) {
          if (v.ID === this.temp.ID) {
            const index = this.callbackHome.indexOf(v)
            this.callbackHome.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogVisible = false;
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.callbackHome.indexOf(val);
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
      //descr剩余长度计算
      leftLength() {
        return 128 - this.temp.descr.length
      },
      //删除行
      handleDelete() {
        this.deleteDialogVisible = true;
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

<style lang="less">

</style>
