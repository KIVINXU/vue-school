<template>
  <div>
    <el-row class="el-table-margin">
      <el-col :span="16" :offset="5">
        <el-select v-model="listQuery.key"
                   style="width: 14%"
                   @focus="handleFocus"
                   placeholder="查询对象">
          <el-option
            v-for="item in searchOption"
            :key="item.key"
            :label="item.label"
            :value="item.key">
          </el-option>
        </el-select>
        <el-input placeholder="请输入查询内容"
                  style="width: 30%;"
                  clearable
                  :disabled="listQuery.key === ''"
                  v-model.trim="listQuery.value"
                  @clear="getList()"
                  @keyup.enter.native="handleFilter(1)">
        </el-input>
        <el-button
          type="info" plain
          @click="handleFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''"
          icon="el-icon-search">查询
        </el-button>
        <el-button
          icon="el-icon-search"
          type="info" plain
          @click="handleExtFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''">相似</el-button>
      </el-col>
      <el-col :span="2">
        <el-dropdown>
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="handleCreate">
                添加
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(list[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex)"
                         :disabled="currentRowIndex === -1">
                删除
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
        <el-table :data="list" border
                  ref="deviceTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="设备编号" width="75px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="设备名称" width="88px"></el-table-column>
          <el-table-column prop="model" :show-overflow-tooltip="true" label="设备型号" width="88px"></el-table-column>
          <el-table-column prop="belong" :show-overflow-tooltip="true" label="学校名称"></el-table-column>
          <el-table-column prop="place" :show-overflow-tooltip="true" label="安装位置"></el-table-column>
          <el-table-column prop="total" :show-overflow-tooltip="true" label="图片数"></el-table-column>
          <el-table-column prop="ip" :show-overflow-tooltip="true" label="默认IP" width="115px"></el-table-column>
          <el-table-column prop="port" :show-overflow-tooltip="true" label="端口" width="55px"></el-table-column>
          <el-table-column prop="username" :show-overflow-tooltip="true" label="登录用户" width="100px"></el-table-column>
          <el-table-column prop="passwd" :show-overflow-tooltip="true" label="登录密码" width="100px"></el-table-column>
          <el-table-column prop="param" :show-overflow-tooltip="true" label="基本参数"></el-table-column>
          <el-table-column prop="exparam" :show-overflow-tooltip="true" label="扩展参数"></el-table-column>
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
    <!--删除-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span><i class="el-icon-warning"></i>是否确认删除名称为【{{deleteName}}】的数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, list)">确 定</el-button>
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
        <el-row>
        <el-col :sm="24" :md="12">
          <el-form-item label="设备编号" prop="id">
            <el-input v-model="temp.id" :maxlength="16"
                      :readonly="dialogStatus == 'update'"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="temp.name" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="登录用户" prop="username">
            <el-input v-model="temp.username" :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="passwd">
            <el-input type="password" v-model="temp.passwd"  :maxlength="64" @keyup.native="handlePasswd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="地 址" prop="ip">
            <el-input v-model="temp.ip"></el-input>
          </el-form-item>
          <el-form-item label="端 口" prop="port">
            <el-input v-model="temp.port" :maxlength="5"></el-input>
          </el-form-item>
          <el-form-item label="型 号" prop="model">
            <el-input v-model="temp.model"  :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="handleTest">测试</el-button>
          </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="安装位置" prop="place">
          <el-input v-model="temp.place" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="基本参数" prop="basepram">
          <el-input type="textarea" v-model="temp.param" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="扩展参数" prop="exparam">
          <el-input type="textarea" v-model="temp.exparam" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
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
  import { fetchList, SubmitTable, fetchSearchOption } from '@/api/table'
  import { cryptoPass } from '@/api/login'
  import { isvalidUsername, isvalidPassword, validateOther, validateNum } from '@/utils/validate'
  import { Message } from 'element-ui'
  export default {

    data() {
      //编号验证
      var checkID = (rule, value, callback) => {
        if (!validateOther(value)) {
          callback(new Error('只能输入数字、英文字母和下划线'));
        } else {
          callback();
        }
      };
      //登录名验证
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('必须由英文、数字或下划线组成，3到16位'))
        } else {
          callback()
        }
      }
      //密码验证
      const validatePass = (rule, value, callback) => {
        if (value.length < 32) {
          if (!isvalidPassword(value)) {
            callback(new Error('至少有1位英文、数字和特殊字符，3到16位'))
          } else {
            callback()
          }
        } else {
          callback()
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
      //端口限制
      var checkPort = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if(value < 10 || value > 65535){
          callback(new Error('限制10-65535,默认10'))
        }else{
          callback();
        }
      };
      return {
        //搜索内容
        listQuery: {
          method: '',
          page: 1,
          limit: 20,
          ext: undefined,
          key: '',  //查询对象的key值
          value: ''  //查询对象内容
        },
        //搜索flag
        queryFlag: true,
        //总条目数
        total: 0,
        searchOption: [],
        list: [],
        //行数
        currentRowIndex: -1,
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
          id: '',
          name: '',
          place: '',
          ip: '',
          port: '',
          username: '',
          passwd: '',
          model: '',
          param: '',
          exparam: '',
          descr: ''
        },
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          id: [
            {required: true, message: '设备编号不能为空', trigger: 'blur'},
            {validator: checkID, trigger: 'change'}
          ],
          name: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
          ip: [
            {required: true, message: '默认IP不能为空', trigger: 'blur'},
            {validator: validateIP, trigger: 'blur'}
          ],
          port: [
            {required: true, message: '端口不能为空', trigger: 'blur'},
            {validator: checkPort, trigger: 'change'}
          ],
          username: [
            {required: true, message: '登录用户名不能为空', trigger: 'blur'},
            {validator: validateUsername, trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '登录密码不能为空', trigger: 'blur'},
            {validator: validatePass, trigger: 'change'}
          ]
        }
      }
    },
    created () {
      this.getList();
    },
    watch: {
      $route() {
        this.getList();
      }
    },
    methods: {
      //请求后台
      requestList (List){
        fetchList('/deviceHome', List).then( response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            Message.error(data.msg);
          }
          this.list = [];
          if(data.data){
            for(let i = 0; i < data.data.length; i++){
              let tempData = {};
              tempData.id = data.data[i][0];
              tempData.name = data.data[i][1];
              tempData.model = data.data[i][2];
              tempData.belong = data.data[i][3];
              tempData.place = data.data[i][4];
              tempData.total = data.data[i][5];
              tempData.ip = data.data[i][6];
              tempData.port = data.data[i][7];
              tempData.username = data.data[i][8];
              tempData.passwd = data.data[i][9];
              tempData.param = data.data[i][10];
              tempData.exparam = data.data[i][11];
              tempData.descr = data.data[i][12];
              this.list.push(tempData);
            }
            this.total = data.total;
          }else {
            this.total = 0;
          }
        })
      },
      //获取列表
      getList () {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'List';
        this.requestList(this.listQuery);
      },
      //直接查询
      handleFilter(val) {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'Query';
        this.listQuery.page = val;
        this.requestList(this.listQuery);
      },
      //相似查询
      handleExtFilter(val) {
        this.listQuery.ext = 'like';
        this.listQuery.method = 'Query';
        this.listQuery.page = val;
        this.requestList(this.listQuery);
      },
      //改变显示条目
      handleSizeChange(size) {
        this.listQuery.limit = size;
        if(this.listQuery.ext === 'like') {
          this.handleExtFilter(1);
        }else if(this.listQuery.method === 'Query') {
          this.handleFilter(1);
        }else if(this.listQuery.method === 'List') {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      //改变页面事件
      handlePageChange(val) {
        if(this.listQuery.ext === 'like') {
          this.handleExtFilter(val);
        }else if(this.listQuery.method === 'Query') {
          this.handleFilter(val);
        }else if(this.listQuery.method === 'List') {
          this.getList();
        }
      },
      //select获取焦点后请求数据
      handleFocus() {
        if(this.searchOption.length === 0) {
          fetchSearchOption('/deviceHome',{method: 'FieldSelect'})
            .then(response => {
            const data = response.data;
            if(data.msg && data.msg !== ''){
              Message.error(data.msg);
            }
            if(data.data){
              let keys = Object.keys(data.data);
              let values = Object.values(data.data);
              for(let i = 0; i < keys.length; i++) {
                let optionObj = {};
                optionObj.key = keys[i];
                optionObj.label = values[i];
                this.searchOption.push(optionObj);
              }
            }
          })
        }
      },
      handleTest() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Message.info('正在连接设备，请稍等');
            let temp = Object.assign({method: 'Test'}, this.temp);
            delete temp.id;
            delete temp.name;
            delete temp.place;
            delete temp.model;
            delete temp.param;
            delete temp.exparam;
            delete temp.descr;
            SubmitTable('/deviceHome', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                Message.info(data.msg);
              }
            });
          }
        });
        
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          place: '',
          ip: '',
          port: '10',
          username: '',
          passwd: '',
          model: '',
          param: '',
          exparam: '',
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
            if(this.temp.passwd.length <= 16) {
              this.temp.passwd = cryptoPass(this.temp.passwd);
            }
            var temp = Object.assign({method: 'Insert'}, this.temp);
            SubmitTable('/deviceHome', temp).then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.info(data.msg);
              }
              if(data.id === '00000') {
                this.list.unshift(this.temp);
                this.dialogVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.total += 1;
              }
            });
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
      handlePasswd(e) {
        if(this.temp.passwd.length > 16 ||
          e.keyCode === 8 || e.keyCode === 46) {
          this.temp.passwd = '';
        }
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.temp.passwd.length <= 16) {
              this.temp.passwd = cryptoPass(this.temp.passwd);
            }
            let temp = Object.assign({method: 'Update'}, this.temp);
            SubmitTable('/deviceHome', temp).then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.info(data.msg);
              }
              if(data.id === '00000') {
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.temp);
                    break;
                  }
                }
                this.dialogVisible = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
              }
            });
          }
        })
      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.list.indexOf(val);
      },
      //descr剩余长度计算
      leftLength() {
        if(this.temp.descr === null){
          this.temp.descr = '';
        }
        return 128 - this.temp.descr.length
      },
      //删除行
      handleDelete(index) {
        this.deleteDialogVisible = true;
        this.deleteName = this.list[index].name
      },
      rowDelete(index, row) {
        var deleteData = Object.assign({method: 'Delete'}, {id: this.list[index].id});
        SubmitTable('/deviceHome', deleteData).then(response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            Message.info(data.msg);
          }
          if(data.id === '00000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            row.splice(index, 1);
            this.deleteDialogVisible = false;
            this.total -= 1;
          }
        });
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
