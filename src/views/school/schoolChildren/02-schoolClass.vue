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
        <el-table :data="list" border
                  ref="classTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="班级编号" width="150px "></el-table-column>
          <el-table-column prop="classno" :show-overflow-tooltip="true" label="班级号" width="65px"></el-table-column>
          <el-table-column prop="gradeid" :show-overflow-tooltip="true" label="年级号" width="70px"></el-table-column>
          <el-table-column prop="schoolname" :show-overflow-tooltip="true" label="学校名称" width="230px"></el-table-column>
          <el-table-column prop="adviser" :show-overflow-tooltip="true" label="班主任" width="120px"></el-table-column>
          <el-table-column prop="adviser2" :show-overflow-tooltip="true" label="班主任(备)" width="120px"></el-table-column>
          <el-table-column prop="studentnum" :show-overflow-tooltip="true" label="在校学生">
          </el-table-column>
          <el-table-column prop="flagname" :show-overflow-tooltip="true" label="状态" width="70px"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说 明"></el-table-column>
          <el-table-column fixed="right"
                           width="80px"
                           label="花名册">
            <template slot-scope="scope">
              <el-button type="text" @click="handleClassDetail(scope.$index+1, scope.row)">班级详情</el-button>
            </template>
          </el-table-column>
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
               top="10px">
      <el-form ref="dataForm" :rules="rules"
               :model="temp"
               style="margin-top: -30px"
               label-position="right"
               label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item
              label="班级编号" prop="id"
              v-if="dialogStatus=='update'">
              <el-input v-model.trim="temp.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="班级号" prop="classno">
              <el-input v-model.trim="temp.classno"
                        :maxlength="2"></el-input>
            </el-form-item>
            <el-form-item label="学校名称" prop="schoolid">
              <el-tooltip effect="dark"
                          content="点击回车搜索" placement="top">
                <el-select v-model.trim="temp.schoolid"
                           placeholder="请输入学校编号搜索"
                           filterable remote
                           @keyup.enter.native="handleSchoolOption"
                           style="width: 100%">
                  <el-option v-for="item in schoolIDOption"
                             :key="item.key"
                             :label="item.label"
                             :value="item.key">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.key }}</span>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="班主任(备)" prop="adviser2">
              <el-input v-model.trim="temp.adviser2" :maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="年级号" prop="gradeid">
              <el-date-picker v-model.trim="temp.gradeid" placeholder="选择年级号"
                              align="right" style="width: 100%"
                              type="year" format="yyyy" value-format="yyyy"
                              :picker-options="gradeIDScope">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="班主任" prop="teacherid">
              <el-tooltip effect="dark"
                          content="点击回车搜索" placement="top">
                <el-select v-model.trim="temp.teacherid"
                           placeholder="请输入班主任编号搜索"
                           filterable remote
                           @keyup.enter.native="handleTeacherOption"
                           style="width: 100%">
                  <el-option v-for="item in teacherIDOption"
                             :key="item.key"
                             :label="item.label"
                             :value="item.key">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.key }}</span>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model.trim="temp.flag"
                         filterable remote
                         placeholder="请选择班级状态"
                         style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.key"
                           :label="item.label"
                           :disabled="item.disabled"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 1, maxRows: 4 }">
          </el-input>
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
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table'
  import {validateNum} from "../../../utils/validate";

  export default {
    data() {
      //班级号验证
      let checkClassNO = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if (value < 1 || value > 99) {
          callback(new Error('限制1-99'))
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
        list: [{
          id: '13141411',
          classno: '12',
          gradeid: 2014,
          schoolid: '313310053',
          schoolname: 'sdasdasda',
          teacherid: '14071212',
          adviser: '秦大叔',
          adviser2: '',
          studentnum: '34',
          flag: '',
          flagname: '正常',
          descr: '啊实打实大师大师啊等'
        },{
          id: '1879769',
          classno: '14',
          gradeid: 2011,
          schoolid: '313310053',
          schoolname: 'sdasdasda',
          teacherid: '14071212',
          adviser: '萨队',
          adviser2: '',
          studentnum: '23',
          flag: '',
          flagname: '正常',
          descr: '花里胡哨大会收到啦'
        }],
        //行数
        currentRowIndex: -1,
        //-----添加/修改对话框--------
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加班级',
          update: '修改班级'
        },
        //对话框内容
        temp: {
          id: '',
          old_id: '',
          classno: '',
          gradeid: '',
          schoolid: '',
          schoolname: '',
          teacherid: '',
          adviser: '',
          adviser2: '',
          studentnum: '',
          flag: '',
          flagname: '',
          descr: ''
        },
        //学校ID选项
        schoolIDOption: [],
        //学校ID搜索框数据
        schoolTemp: '',
        //年级号范围限制2000年到2099年
        gradeIDScope: {
          disabledDate(time) {
            return time.getTime() < new Date(2000, 1, 1) || time.getTime() > new Date(2099, 1, 1);
          },
        },
        //班主任选项
        teacherIDOption: [],
        //班主任ID搜索框数据
        teacherTemp: '',
        //标志选项
        flagOption: [],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          classno: [
            {required: true, message: '班级号不能为空', trigger: 'blur'},
            {validator: checkClassNO, trigger: 'change'}
          ],
          gradeid: {required: true, message: '请选择年级号', trigger: 'blur'},
          teacherid: {required: true, message: '请选择班主任', trigger: 'blur'},
          schoolid: {required: true, message: '请选择所属学校名称', trigger: 'blur'},
        },
      }
    },
    created() {
      //从班级详情返回时跳转到之前页数
      let pageNum = parseInt(window.sessionStorage.getItem('pageNum'));
      if(pageNum) {
        this.listQuery.page = pageNum;
        window.sessionStorage.removeItem('pageNum');
      }
      this.getList();
    },
    mounted() {
      let selectNum = parseInt(window.sessionStorage.getItem('selectNum'));
      if(selectNum) {
        this.setCurrent(this.list[selectNum - 1]);
        window.sessionStorage.removeItem('selectNum');
      }
    },
    watch: {
      $route() {
        this.getList();
      }
    },
    methods: {
      //选中当前行
      setCurrent(row) {
        this.$refs.classTable.setCurrentRow(row);
      },
      //请求后台
      requestList(List) {
        fetchList('/schoolClass', List).then(response => {
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
          fetchSearchOption('/schoolClass', {method: 'FieldQuery'})
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
      //点击按钮跳至班级详情页面
      handleClassDetail(id, row) {
        window.sessionStorage.setItem('classDetail', JSON.stringify(row));
        window.sessionStorage.setItem('pageNum', this.listQuery.page);
        window.sessionStorage.setItem('selectNum', id);
        this.$router.push({ path: '/school/classDetail/' + id });
      },
      
      //打开弹出框select请求数据
      handleOption() {
        if (this.flagOption.length === 0) {
          fetchSearchOption('/schoolClass', {method: 'FieldLabel'})
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
                this.flagOption = data.data.FLAG;
              }
            })
        }
      },
      //远程搜索教师数据
      handleTeacherOption(e) {
        let query = e.target.value;
        if(query !== ''){
          //如果未搜过学校 则弹出提示
          if(this.temp.schoolid === '') {
            this.$message({
              showClose: true,
              message: '请先选择学校',
              type: 'error',
              duration: 2000
            });
          }else {
            if(query !== this.teacherTemp) {
              let teacherData = Object.assign({method: 'FieldTeacher'} ,{schoolid: this.temp.schoolid}, {teacherid: query});
              fetchSearchOption('/schoolClass', teacherData)
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
                  if (data.data.teacherid) {
                    this.teacherIDOption = data.data.teacherid;
                  }
                });
              this.teacherTemp = query;
            }
          }
        }else {
          this.teacherIDOption = [];
        }
      },
      //远程搜索学校数据
      handleSchoolOption(e) {
        let query = e.target.value;
        if(query !== ''){
          if(query !== this.schoolTemp) {
            let schoolData = Object.assign({method: 'FieldSchool'}, {schoolid: query});
            fetchSearchOption('/schoolClass', schoolData)
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
                if (data.data.schoolid) {
                  this.schoolIDOption = data.data.schoolid;
                }
              });
            //搜索完后存储搜索内容
            this.schoolTemp = query;
          }
        }else {
          this.schoolIDOption = [];
        }
      },
      resetTemp() {
        this.temp = {
          id: '',
          old_id: '',//修改之前的id
          classno: '',
          gradeid: new Date().getFullYear().toString(),
          schoolid: '',
          schoolname: '',
          teacherid: '',
          adviser: '',
          adviser2: '',
          studentnum: 0,
          flag: '',
          flagname: '',
          descr: ''
        }
      },
      //添加对话框
      handleCreate() {
        this.handleOption();
        this.resetTemp();
        //打开对话框先清空select选择框
        this.schoolIDOption = [];
        this.teacherIDOption = [];
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
            if(this.temp.flag !== ''){
              this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            }else {
              this.temp.flagname = '';
            }
            this.temp.schoolname = valueToLabel(this.schoolIDOption, this.temp.schoolid);
            this.temp.adviser = valueToLabel(this.teacherIDOption, this.temp.teacherid);
            //自动更改id
            this.temp.id = this.temp.schoolid + this.temp.gradeid + this.temp.classno;
            let temp = Object.assign({method: 'Insert'}, this.temp);
            delete temp.old_id;
            delete temp.adviser;
            delete temp.schoolname;
            delete temp.flagname;
            delete temp.studentnum;
            SubmitTable('/schoolClass', temp).then(response => {
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
                //关闭弹窗时，清除保存的临时搜索内容
                this.schoolTemp = '';
                this.teacherTemp = '';
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
        this.temp.gradeid = this.temp.gradeid.toString();
        this.temp.old_id = this.temp.id;//打开对话框，存储已有的id
        //打开对话框先清空，再把当前项插入select选择框
        this.schoolIDOption = [];
        this.teacherIDOption = [];
        this.schoolIDOption.push({key: this.temp.schoolid, label: this.temp.schoolname});
        this.teacherIDOption.push({key: this.temp.teacherid, label: this.temp.adviser});
        this.handleOption();
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.temp.flag !== ''){
              this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            }else {
              this.temp.flagname = '';
            }
            this.temp.schoolname = valueToLabel(this.schoolIDOption, this.temp.schoolid);
            this.temp.adviser = valueToLabel(this.teacherIDOption, this.temp.teacherid);
            //自动更改id
            this.temp.id = this.temp.schoolid + this.temp.gradeid + this.temp.classno;
            let temp = Object.assign({method: 'Update'}, this.temp);
            delete temp.adviser;
            delete temp.schoolname;
            delete temp.flagname;
            delete temp.studentnum;
            SubmitTable('/schoolClass', temp).then(response => {
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
                //关闭弹窗时，清除保存的临时搜索内容
                this.schoolTemp = '';
                this.teacherTemp = '';
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
        this.deleteName = this.list[index].id
      },
      rowDelete(index, row) {
        let deleteData = Object.assign({method: 'Delete'}, {id: this.list[index].id});
        SubmitTable('/schoolClass', deleteData).then(response => {
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
