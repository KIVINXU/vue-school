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
                添加设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(deviceHome[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改设备
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, deviceHome)"
                         :disabled="currentRowIndex === -1">
                删除设备
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
        <el-table :data="deviceHome" border
                  ref="deviceTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="ID" :show-overflow-tooltip="true" label="设备编号" width="75px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="设备名称" width="88px"></el-table-column>
          <el-table-column prop="IP" :show-overflow-tooltip="true" label="默认IP" width="115px"></el-table-column>
          <el-table-column prop="port" :show-overflow-tooltip="true" label="端口" width="55px"></el-table-column>
          <el-table-column prop="username" :show-overflow-tooltip="true" label="登录用户" width="100px"></el-table-column>
          <el-table-column prop="model" :show-overflow-tooltip="true" label="设备型号" width="88px"></el-table-column>
          <el-table-column prop="place" :show-overflow-tooltip="true" label="位置"></el-table-column>
          <el-table-column prop="baseparm" :show-overflow-tooltip="true" label="基本参数"></el-table-column>
          <el-table-column prop="extparm" :show-overflow-tooltip="true" label="扩展参数"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说明"></el-table-column>
        </el-table>
      </el-col>
      <!-- /.表格结束 -->
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
    <!--删除设备-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span><i class="el-icon-warning"></i>是否确认删除这行数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, deviceHome)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改设备-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               style="margin-top: -30px"
               label-position="right"
               label-width="100px">
        <el-row>
        <el-col :sm="24" :md="12">
          <el-form-item label="设备编号" prop="ID">
            <el-input v-model="temp.ID" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="temp.name" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="登录用户" prop="username">
            <el-input v-model="temp.username" :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="passwd">
            <el-input type="password" v-model="temp.passwd"  :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="默 认 I P" prop="IP">
            <el-input v-model="temp.IP"></el-input>
          </el-form-item>
          <el-form-item label="设备端口" prop="port">
            <el-input v-model="temp.port"></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="model">
            <el-input v-model="temp.model"  :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwd2">
            <el-input type="password" v-model="temp.passwd2"  :maxlength="128"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="安装位置" prop="place">
          <el-input type="textarea" v-model="temp.place" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="基本参数" prop="basepram">
          <el-input type="textarea" v-model="temp.baseparm" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="扩展参数" prop="extparm">
          <el-input type="textarea" v-model="temp.extparm" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="height: 0; margin-top: -70px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, SubmitTable } from '@/api/table'
  export default {

    data() {
      //二次密码验证
      var validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请再次输入密码'));
        }else if(value !== this.temp.passwd) {
          callback(new Error('两次输入密码不一致！'))
        }else {
          callback();
        }
      };
      //IP地址验证
      var validateIP = (rule, value, callback) => {
        const IPReg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        if(!IPReg.test(value)) {
          callback(new Error('请输入正确的IP地址'));
        }else {
          callback();
        }
      };
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
          {key: '1', label: '设备编号'},
          {key: '2', label: '设备名称'},
          {key: '3', label: '默认IP'}
        ],
        deviceHome: [
          {
            ID: '1001',
            name: '打印机',
            place: '学校正门口，鹿城区第三实验小学',
            IP: '255.255.255.255',
            port: '80808',
            username: 'test3',
            passwd: 'a.1',
            model: 'HP294',
            baseparm: '高度：54,长度：41,宽度：22',
            extparm: '扩展高度：54,扩展长度：41,扩展宽度：22',
            descr: '已损坏，等待维修部维修。维修部反应无法修理，等待后勤部更换',
          },
          {
            ID: '1002',
            name: '显示屏',
            place: '学校正门口，鹿城区第三实验小学',
            IP: '255.255.255.255',
            port: '80808',
            username: 'test3',
            passwd: 'a.1',
            model: 'HP294',
            baseparm: '高度：54,长度：41,宽度：22',
            extparm: '扩展高度：54,扩展长度：41,扩展宽度：22',
            descr: '已损坏，等待维修部维修。维修部反应无法修理，等待后勤部更换',
          }
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
          create: '添加设备',
          update: '修改设备'
        },
        //对话框内容
        temp: {
          ID: '',
          name: '',
          place: '',
          IP: '',
          port: '',
          username: '',
          passwd: '',
          model: '',
          baseparm: '',
          extparm: '',
          descr: ''
        },
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          ID: [{required: true, message: '设备序列号不能为空', trigger: 'blur'}],
          name: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
          IP: [
            {required: true, message: '默认IP不能为空', trigger: 'blur'},
            {validator: validateIP, trigger: 'blur'}
          ],
          port: [{required: true, message: '端口不能为空', trigger: 'blur'}],
          username: [{required: true, message: '登录用户名不能为空', trigger: 'blur'}],
          passwd: [{required: true, message: '登录密码不能为空', trigger: 'blur'}],
          passwd2: [{required: true, validator: validatePass, trigger: 'blur'}],
          model: [{required: true, message: '设备型号不能为空', trigger: 'blur'}],
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
//        fetchList('/deviceHome', this.listQuery).then( response => {
//          this.deviceHome = response.data.deviceHome;
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
          name: '',
          place: '',
          IP: '',
          port: '',
          username: '',
          passwd: '',
          model: '',
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
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable(this.temp).then(() => {
//              this.deviceHome.unshift(this.temp);
//              this.dialogVisible = false;
//              this.$notify({
//                title: '成功',
//                message: '创建成功',
//                type: 'success',
//                duration: 2000
//              })
//            })
            this.deviceHome.push(this.temp);
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
        });
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable(this.temp).then(() => {
//
//            })
            for (const v of this.deviceHome) {
              if (v.ID === this.temp.ID) {
                const index = this.deviceHome.indexOf(v);
                this.deviceHome.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogVisible = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }
        })
        
      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.deviceHome.indexOf(val);
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
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          row.splice(index, 1);
          this.deleteDialogVisible = false;
        }
      },
    }
  }

</script>

<style lang="less">
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
