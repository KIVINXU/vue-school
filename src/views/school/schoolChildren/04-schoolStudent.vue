<template>
  <div>
    <el-row class="el-table-margin">
      <el-col :span="16" :offset="5">
        <el-select v-model.trim="listQuery.key"
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
                  v-model.trim.trim="listQuery.value"
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
            || listQuery.value === ''">相似
        </el-button>
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
        <el-table :data="list" ref="studentTable"
                  border highlightCurrentRow
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column type="expand" width="20px">
            <template slot-scope="props">
              <el-form class="demo-table-expand" label-position="right">
                <el-row>
                  <el-col :sm="5">
                    <el-form-item label="父亲" style="margin-bottom: 0;"><span>{{ props.row.father}}</span></el-form-item>
                  </el-col>
                  <el-col :sm="4">
                    <el-form-item label="电话" style="margin-bottom: 0;"><span>{{ props.row.fa_contact }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="5">
                    <el-form-item label="母亲" style="margin-bottom: 0;"><span>{{ props.row.mother}}</span></el-form-item>
                  </el-col>
                  <el-col :sm="4">
                    <el-form-item label="电话" style="margin-bottom: 0;"><span>{{ props.row.mo_contact }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="5">
                    <el-form-item label="学校" style="margin-bottom: 0;"><span>{{ props.row.schoolname}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="4">
                    <el-form-item label="班级" style="margin-bottom: 0;"><span>{{ props.row.classname}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="5">
                    <el-form-item label="班主任" style="margin-bottom: 0;"><span>{{ props.row.adviser}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="id" :show-overflow-tooltip="true" label="学生编号（证件号码）" width="150px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名"></el-table-column>
          <el-table-column prop="d_of_b" :show-overflow-tooltip="true" label="出生日期"></el-table-column>
          <el-table-column prop="sex" :show-overflow-tooltip="true" label="性别"></el-table-column>
          <el-table-column prop="address" :show-overflow-tooltip="true" label="住址"></el-table-column>
          <el-table-column prop="guarder" :show-overflow-tooltip="true" label="主监护人"></el-table-column>
          <el-table-column prop="relationname" :show-overflow-tooltip="true" label="与学生的关系"></el-table-column>
          <el-table-column prop="studentno" :show-overflow-tooltip="true" label="学号"></el-table-column>
          <el-table-column prop="flagname" :show-overflow-tooltip="true" label="状态"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说 明"></el-table-column>
        </el-table>
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
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogVisible"
               top="10px"
               width="60%">
      <el-form ref="dataForm" :rules="rules"
               :model="temp"
               style="margin-top: -30px"
               label-position="right"
               label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="temp.name" :maxlength="8"
                        style="float: left;margin-right:10px;width:50%;min-width: 87px"></el-input>
              <el-radio-group v-model.trim="temp.sex">
                <el-radio-button label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="d_of_b">
              <el-date-picker v-model.trim="temp.d_of_b"
                              placeholder="请选择出生日期"
                              align="right" style="width: 100%"
                              type="date" format="MM/dd/yyyy"
                              value-format="MM/dd/yyyy">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="证件类别" prop="id_type">
              <el-select v-model.trim="temp.id_type"
                         placeholder="请选择证件类别"
                         style="width: 100%">
                <el-option v-for="item in id_typeOption "
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="id">
              <el-input v-model.trim="temp.id" :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="住址" prop="address">
              <el-input v-model.trim="temp.address" :maxlength="48"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <!--<el-form-item label="主监护人编号" prop="guarderid">-->
              <!--<el-input v-model.trim="temp.guarderid" :maxlength="18"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="主监护人" prop="guarder">-->
              <!--<el-input v-model.trim="temp.guarder" :maxlength="16"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="与学生关系" prop="relation">-->
              <!--<el-select v-model.trim="temp.relation"-->
                         <!--placeholder="请选择学生与主监护人关系"-->
                         <!--style="width: 100%">-->
                <!--<el-option v-for="item in relationOption"-->
                           <!--:key="item.key"-->
                           <!--:label="item.label"-->
                           <!--:value="item.key">-->

                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="状态" prop="flag">-->
            <!--<el-select v-model.trim="temp.flag"-->
            <!--placeholder="请选择学生状态"-->
            <!--style="width: 100%">-->
            <!--<el-option v-for="item in flagOption"-->
            <!--:key="item.key"-->
            <!--:label="item.label"-->
            <!--:value="item.key">-->

            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            
            
            <el-form-item label="父亲" prop="father">
              <el-input v-model.trim="temp.father" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="fa_contact">
              <el-input v-model.trim="temp.fa_contact" :maxlength="24"></el-input>
            </el-form-item>
            <el-form-item label="母亲" prop="mother">
              <el-input v-model.trim="temp.mother" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="mo_contact">
              <el-input v-model.trim="temp.mo_contact" :maxlength="24"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim.trim="temp.descr"
                    :autosize="{ minRows: 1, maxRows: 4 }"></el-input>
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
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table';
  import {validateTel, validateIdentity18, validatePassport, validateOther} from "../../../utils/validate";
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {
      ElRow
    },
    data() {
      //电话号码验证
      var checkTel = (rule, value, callback) => {
        if (!validateTel(value)) {
          callback(new Error('请输入正确的手机或电话号码'))
        } else {
          callback()
        }
      };
      //证件号码验证
      var checkID_number = (rule, value, callback) => {
        if (this.temp.id_type === 0) {
          if (!validateIdentity18(value)) {
            callback(new Error('请输入正确的18位身份证号码'))
          } else {
            callback()
          }
        } else if (this.temp.id_type === 1) {
          if (!validatePassport(value)) {
            callback(new Error('请输入正确的护照号码'));
          } else {
            callback();
          }
        } else if (this.temp.id_type === 2) {
          if (!validateOther(value)) {
            callback(new Error('只能输入数字和英文字母'));
          } else {
            callback();
          }
        }
      };
      //主监护人验证，如果主监护人证件号码不为空，则名称和关系不能空
      var checkGuarder = (rule, value, callback) => {
        if (this.temp.guarderid && !value) {
          callback(new Error('主监护人名称不能为空'));
        } else {
          callback();
        }
      };
      var checkRelation = (rule, value, callback) => {
        if (this.temp.guarderid && !value) {
          callback(new Error('与学生关系不能为空'));
        } else {
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
        //总条目数
        total: 0,
        searchOption: [],
        //加载图标
        listLoading: true,
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
          create: '添加学生',
          update: '修改学生'
        },
        //对话框内容
        temp: {
          id: '',
          old_id: '', //修改之前的id
          name: '',
          d_of_b: '',
          sex: '',
          address: '',
          id_type: '',
          id_type_name: '',
          father: '',
          fa_contact: '',
          mother: '',
          mo_contact: '',
          guarderid: '',
          guarder: '',
          relation: '',
          relationname: '',
          relnum: '',
          studentno: '',
          // flag: '',
          flagname: '',
          descr: '',
          schoolname: '',
          classname: '',
          adviser: '',
        },
        sexOption: [
          {
            key: '男',
            label: '男'
          },
          {
            key: '女',
            label: '女'
          }
        ],
        //证件类型
        id_typeOption: [],
        //标志选项
        // flagOption: [],
        //关系选项
        relationOption: [],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          name: {required: true, message: '请输入学生姓名', trigger: 'blur'},
          sex: {required: true, message: '请选择学生性别', trigger: 'blur'},
          d_of_b: {required: true, message: '请选择出生日期', trigger: 'blur'},
          id_type: {required: true, message: '请选择证件类别', trigger: 'blur'},
          id: [{required: true, message: '请输入正确的证件号码', trigger: 'blur'},
              {validator: checkID_number, trigger: 'change'}],
          guarder: {validator: checkGuarder, trigger: 'blur'},
          relation: {validator: checkRelation, trigger: 'blur'},
          // flag: {required: true, message: '请选择学生状态', trigger: 'blur'},

        },
      }
    },
    created() {
      this.getList();
    },
    watch: {
      $route() {
        this.getList();
      }
    },
    methods: {
      //请求后台
      requestList(List) {
        fetchList('/schoolStudent', List).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 2000
            });
          }
          if(data.data){
            this.list = data.data;
            this.list.forEach(item => {
              //传过来是秒
              let newDate = new Date(item.d_of_b * 1000);
              item.d_of_b = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' +  newDate.getFullYear();
            });
            this.total = data.total;
          }else {
            this.list = [];
            this.total = 0;
          }
        })
      },
      //获取列表
      getList() {
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
        if (this.listQuery.ext === 'like') {
          this.handleExtFilter(1);
        } else if (this.listQuery.method === 'Query') {
          this.handleFilter(1);
        } else if (this.listQuery.method === 'List') {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      //改变页面事件
      handlePageChange(val) {
        if (this.listQuery.ext === 'like') {
          this.handleExtFilter(val);
        } else if (this.listQuery.method === 'Query') {
          this.handleFilter(val);
        } else if (this.listQuery.method === 'List') {
          this.getList();
        }
      },
      //select获取焦点后请求数据
      handleFocus() {
        if (this.searchOption.length === 0) {
          fetchSearchOption('/schoolStudent', {method: 'FieldQuery'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'error',
                  duration: 2000
                });
              }
              if (data.data) {
                let keys = Object.keys(data.data);
                let values = Object.values(data.data);
                for (let i = 0; i < keys.length; i++) {
                  let optionObj = {};
                  optionObj.key = keys[i];
                  optionObj.label = values[i];
                  this.searchOption.push(optionObj);
                }
              }
            })
        }
      },
      //打开弹出框select请求数据
      handleOption() {
        if (this.id_typeOption.length === 0) {
          fetchSearchOption('/schoolStudent', {method: 'FieldLabel'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'error',
                  duration: 2000
                });
              }
              if (data.data) {
                this.id_typeOption = data.data.ID_TYPE;
                this.relationOption = data.data.RELATION;
                // this.flagOption = data.data.FLAG;
              }
            });
        }
      },
      resetTemp() {
        this.temp = {
          id: '',
          old_id: '',
          name: '',
          d_of_b: '',
          sex: '男',
          address: '',
          id_type: 0,
          id_type_name: '',
          father: '',
          fa_contact: '',
          mother: '',
          mo_contact: '',
          // flag: '',
          flagname: '',
          descr: ''
        }
      },
      //添加对话框
      handleCreate() {
        this.resetTemp();
        this.handleOption();
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
            this.temp.id_typename = valueToLabel(this.id_typeOption, this.temp.id_type);
//            this.temp.relationname = valueToLabel(this.relationOption, this.temp.relation);
            // this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Insert'}, this.temp);
            delete temp.old_id;
            delete temp.id_typename;
            delete temp.guarderid;
            delete temp.guarder;
            delete temp.relation;
            delete temp.relationname;
            delete temp.studentno;
            delete temp.flagname;
            delete temp.schoolname;
            delete temp.classname;
            delete temp.adviser;
            delete temp.relnum;
            SubmitTable('/schoolStudent', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'info',
                  duration: 2000
                });
              }
              if (data.id === '00000') {
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
        this.temp.old_id = this.temp.id;//打开对话框，存储已有的id
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.handleOption();
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id_typename = valueToLabel(this.id_typeOption, this.temp.id_type);
//            this.temp.relationname = valueToLabel(this.relationOption, this.temp.relation);
            // this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Update'}, this.temp);
            delete temp.id_typename;
            delete temp.relationname;
            delete temp.relation;
            delete temp.guarderid;
            delete temp.guarder;
            delete temp.flagname;
            delete temp.studentno;
            delete temp.schoolname;
            delete temp.classname;
            delete temp.adviser;
            delete temp.relnum;
            SubmitTable('/schoolStudent', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'info',
                  duration: 2000
                });
              }
              if (data.id === '00000') {
                for (const v of this.list) {
                  if (v.id === this.temp.old_id) {
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
        });
      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.list.indexOf(val);
      },
      //descr剩余长度计算
      leftLength() {
        if (this.temp.descr === null) {
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
        SubmitTable('/schoolStudent', deleteData).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'info',
              duration: 2000
            });
          }
          if (data.id === '00000') {
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
<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 60px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item__content {
    margin-right: 0;
    margin-bottom: 0;
    float: left;
    text-align: left;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 5px;
  }

  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    line-height: 20px;
  }
</style>
