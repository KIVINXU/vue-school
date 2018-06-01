<template>
  <div>
    <el-row class="el-table-margin">
      <el-col :span="15" :offset="5">
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
                  v-model.trim="listQuery.value"
                  @clear="getList()"
                  @keyup.enter.native="handleFilter()">
        </el-input>
        <el-button
          type="info" plain
          @click="handleFilter()"
          :disabled="listQuery.key === ''
            || listQuery.value === ''"
          icon="el-icon-search">查询
        </el-button>
        <el-button
          icon="el-icon-search"
          type="info" plain
          @click="handleExtFilter()"
          :disabled="listQuery.key === ''
            || listQuery.value === ''">相似
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="warning" @click="handleGoback">返回</el-button>
        <el-dropdown>
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="handleCreate">
                添加学生
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(list[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改学生
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex)"
                         :disabled="currentRowIndex === -1">
                移除学生
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
      <!--当前班级信息-->
      <el-form :model="classInfo" class="demo-class" inline>
        <el-form-item label="班级编号">{{classInfo.id}}</el-form-item>
        <el-form-item label="班级号">{{classInfo.classno}}</el-form-item>
        <el-form-item label="年级号">{{classInfo.gradeid}}</el-form-item>
        <el-form-item label="学校">{{classInfo.schoolname}}</el-form-item>
        <el-form-item label="班主任">{{classInfo.adviser}}</el-form-item>
        <el-form-item label="班主任(备)">{{classInfo.adviser2}}</el-form-item>
        <el-form-item label="状态">{{classInfo.flagname}}</el-form-item>
        <el-form-item label="学生数">{{classInfo.studentnum}}</el-form-item>
        <el-form-item label="说明">{{classInfo.descr}}</el-form-item>
      </el-form>
    </el-row>
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
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" :show-overflow-tooltip="true" label="学生编号（证件号码）" width="150px"></el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名"></el-table-column>
      <el-table-column prop="d_of_b" :show-overflow-tooltip="true" label="出生日期"></el-table-column>
      <el-table-column prop="sex" :show-overflow-tooltip="true" label="性别"></el-table-column>
      <el-table-column prop="address" :show-overflow-tooltip="true" label="住址"></el-table-column>
      <el-table-column prop="id_typename" :show-overflow-tooltip="true" label="证件类型"></el-table-column>
      <el-table-column prop="guarder" :show-overflow-tooltip="true" label="主监护人"></el-table-column>
      <el-table-column prop="relationname" :show-overflow-tooltip="true" label="与学生人关系"></el-table-column>
      <el-table-column prop="relnum" :show-overflow-tooltip="true" label="关联数"></el-table-column>
      <el-table-column prop="studentno" :show-overflow-tooltip="true" label="学号"></el-table-column>
      <el-table-column prop="flagname" :show-overflow-tooltip="true" label="状态"></el-table-column>
      <el-table-column prop="descr" :show-overflow-tooltip="true" label="说明"></el-table-column>
    </el-table>
    
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
              <el-input v-model.trim="temp.name" :maxlength="16"
                        style="float: left;margin-right:10px;width:50%;min-width: 87px"></el-input>
              <el-radio-group v-model.trim="temp.sex">
                <el-radio-button label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
              </el-radio-group>
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
              <el-tooltip  content="注意：从服务器抓取信息会重置表单内容" placement="top">
                <el-input v-model.trim="temp.id"
                          :disabled="dialogVisible === 'update'"
                          :maxlength="18" >
                  <el-button slot="append" @click="handleStudentInfo">抓取信息</el-button>
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="出生日期" prop="d_of_b">
              <el-date-picker v-model.trim="temp.d_of_b"
                              placeholder="请选择出生日期"
                              align="right" style="width: 100%"
                              type="date" format="MM/dd/yyyy" value-format="MM/dd/yyyy">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="住址" prop="address">
              <el-input v-model.trim="temp.address" :maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="父亲" prop="father">
              <el-input v-model.trim="temp.father" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="联系" prop="fa_contact">
              <el-input v-model.trim="temp.fa_contact" :maxlength="24"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="主监护人编号" prop="guarderid">
              <el-input v-model.trim="temp.guarderid" :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="主监护人" prop="guarder">
              <el-input v-model.trim="temp.guarder" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="与学生关系" prop="relation">
              <el-select v-model.trim="temp.relation"
                         placeholder="请选择学生与主监护人关系"
                         style="width: 100%">
                <el-option v-for="item in relationOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model.trim="temp.flag"
                         placeholder="请选择学生状态"
                         style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学号" prop="studentno">
              <el-input v-model.trim="temp.studentno" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="母亲" prop="mother">
              <el-input v-model.trim="temp.mother" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="联系" prop="mo_contact">
              <el-input v-model.trim="temp.mo_contact" :maxlength="24"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128"
                    v-model.trim.trim="temp.descr"
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
  import {validateIdentity18, validatePassport, validateOther} from "@/utils/validate";
  import ElRow from "element-ui/packages/row/src/row";
  
  export default {
    components: {
      ElRow
    },
    data() {
      //证件号码验证
      const checkID_number = (rule, value, callback) => {
        if (this.temp.id_type === 0) {
          if (!validateIdentity18(value)) {
            callback(new Error('请输入正确的18位身份证号码'))
          } else {
            this.handleBirthday();
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
      //如果主监护人编号不为空，则主监护人不能空，关系不能为未知
      //如果主监护人编号为空，则主监护人必须为空，关系必须为未知
      const checkGuarder = (rule, value, callback) => {
        if (this.temp.guarderid) {
          if(!value) {
            callback(new Error('主监护人编号存在，名称不能为空'));
          }else {
            callback();
          }
        } else {
          if(!value) {
            callback();
          }else {
            callback(new Error('主监护人编号为空，无法添加'))
          }
        }
      };
      const checkRelation = (rule, value, callback) => {
        if (this.temp.guarderid) {
          if(value === 0) {
            callback(new Error('主监护人编号存在，关系不能为未知'));
          }else {
            callback()
          }
        } else {
          if(value === 0) {
            callback();
          }else {
            callback(new Error('主监护人编号为空，无法选择'))
          }
        }
      };
      return {
        //搜索内容
        listQuery: {
          method: '',
          ext: undefined,
          key: '',  //查询对象的key值
          value: '',  //查询对象内容
          classid: ''
        },
        searchOption: [],
        //加载图标
        classInfo: {
          id: '313310005320103',
          classno: '1',
          gradeid: '2010',
          schoolid: '1101',
          schoolname: '蒲鞋市小学龟湖路校区',
          teacherid: '1101',
          adviser: '蒲鞋市',
          adviser2: '蒲鞋市',
          studentno: '34',
          flag: 0,
          flagname: '正常',
          descr: 'dd'
        },
        list: [
          {
            id: '1101',
            name: '岑湘鄂',
            sex: '男',
            address: '蒲鞋市小学龟湖路校区67号',
            id_typename: '身份证',
            guarder: '蒲鞋市',
            relationname: '父母',
            relnum: 0,
            studentno: '',
            flagename: '在校',
            descr: 'ddd',
            father: '岑湘鄂',
            fa_contact: '123456',
            mother: '岑湘鄂',
            mo_contact: '12345678900'
          }
        ],
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
          flag: '',
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
        flagOption: [],
        //关系选项
        relationOption: [{
          key: 0, label: '未知'
        },{
          key: 1, label: '父亲'
        },{
          key: 2, label: '母亲'
        }],
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
            {validator: checkID_number, trigger: 'blur'}],
          guarder: {validator: checkGuarder, trigger: ['blur', 'change']},
          relation: {validator: checkRelation, trigger: ['blur', 'change']},
          // flag: {required: true, message: '请选择学生状态', trigger: 'blur'},
          
        },
      }
    },
     created() {
       this.classInfo = JSON.parse(window.sessionStorage.getItem('classDetail'));
       this.getList();
     },
    methods: {
      //请求后台
      requestList(List) {
        fetchList('/schoolRoster', List).then(response => {
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
            this.list = data.data;
            this.list.forEach(item => {
              //传过来是秒
              let newDate = new Date(item.d_of_b * 1000);
              item.d_of_b = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' +  newDate.getFullYear();
            });
          } else {
            this.list = [];
          }
        })
      },
      //获取列表
      getList() {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'List';
        this.listQuery.classid = this.classInfo.id;
        this.requestList(this.listQuery);
      },
      //直接查询
      handleFilter() {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'Query';
        this.listQuery.classid = this.classInfo.id;
        this.requestList(this.listQuery);
      },
      //相似查询
      handleExtFilter() {
        this.listQuery.ext = 'like';
        this.listQuery.method = 'Query';
        this.listQuery.classid = this.classInfo.id;
        this.requestList(this.listQuery);
      },
      
      //select获取焦点后请求数据
      handleFocus() {
        if (this.searchOption.length === 0) {
          fetchSearchOption('/schoolRoster', {method: 'FieldQuery'})
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
          fetchSearchOption('/schoolRoster', {method: 'FieldLabel'})
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
                this.flagOption = data.data.FLAG;
              }
            });
        }
      },
      resetTemp() {
        this.temp = {
          id: '',
          old_id: '', //修改之前的id
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
          guarderid: '',
          guarder: '',
          relation: 0,
          relnum: 0,
          relationname: '',
          studentno: '',
          flag: 0,
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
      //输入学生编号可以自动补全对话框内容
      handleStudentInfo() {
        fetchSearchOption('/schoolRoster', { method: 'FieldIdnumber', idnumber: this.temp.id})
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
            if (data.data && data.data !== []) {
              this.temp = Object.assign(this.temp, data.data[0]);
              //转化生日时间戳
              let newDate = new Date(this.temp.d_of_b * 1000);
              this.temp.d_of_b = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' +  newDate.getFullYear();
            }else {
              this.resetTemp();
            }
          });
      },
      
      //根据身份证自动填入出生年月
      handleBirthday() {
        let birthyear = this.temp.id.substring(6, 10);
        let birthmonth = this.temp.id.substring(10, 12);
        let birthday = this.temp.id.substring(12, 14);
        this.temp.d_of_b = birthmonth + '/' + birthday + '/' + birthyear;
      },
      
      //添加完毕上传
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id_typename = valueToLabel(this.id_typeOption, this.temp.id_type);
            if(this.temp.relation !== ''){
              this.temp.relationname = valueToLabel(this.relationOption, this.temp.relation);
            }else {
              this.temp.relationname = '';
            }
             this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Insert', classid: this.classInfo.id}, this.temp);
            delete temp.old_id;
            delete temp.id_typename;
            delete temp.relationname;
            delete temp.flagname;
            delete temp.schoolname;
            delete temp.classname;
            delete temp.adviser;
            delete temp.relnum;
            SubmitTable('/schoolRoster', temp).then(response => {
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
                this.classInfo.studentnum += 1;
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
            if(this.temp.relation !== ''){
              this.temp.relationname = valueToLabel(this.relationOption, this.temp.relation);
            }else {
              this.temp.relationname = '';
            }
             this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Update', classid: this.classInfo.id}, this.temp);
            delete temp.id_typename;
            delete temp.relationname;
            delete temp.flagname;
            delete temp.schoolname;
            delete temp.classname;
            delete temp.adviser;
            delete temp.relnum;
            SubmitTable('/schoolRoster', temp).then(response => {
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
        var deleteData = Object.assign({method: 'Delete'}, {id: this.list[index].id, classid: this.classInfo.id});
        SubmitTable('/schoolRoster', deleteData).then(response => {
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
            this.classInfo.studentnum -= 1;
          }
        });
      },
      //返回
      handleGoback() {
        window.sessionStorage.removeItem('classDetail')
        this.$router.go(-1);
      }
    }
  }

</script>
<style>
  .demo-class {
    border-radius: 8px;
    border: #EBEEF5 1px solid;
    padding: 5px;
    margin-bottom: 10px;
  }
  
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
  
  .demo-class label {
    text-align: center;
    width: 80px;
    color: #99a9bf;
  }
  
  .demo-class .el-form-item__content {
    margin-right: 0;
    margin-bottom: 0;
    text-align: left;
  }
</style>

