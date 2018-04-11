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
                添加班级
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(classInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改班级
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, classInfo)"
                         :disabled="currentRowIndex === -1">
                删除班级
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
        <el-table :data="classInfo" ref="classTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="班级编号" width="150px "></el-table-column>
          <el-table-column prop="classNO" :show-overflow-tooltip="true" label="班级号" width="65px"></el-table-column>
          <el-table-column prop="gradeid" :show-overflow-tooltip="true" label="年级号" width="70px"></el-table-column>
          <el-table-column prop="schoolName" :show-overflow-tooltip="true" label="学校名称" width="230px"></el-table-column>
          <el-table-column prop="head" :show-overflow-tooltip="true" label="班主任" width="120px"></el-table-column>
          <el-table-column prop="head2" :show-overflow-tooltip="true" label="班主任(前/代)" width="120px"></el-table-column>
          <el-table-column prop="flagName" :show-overflow-tooltip="true" label="状态" width="70px"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说明"></el-table-column>
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
      <span><i class="el-icon-warning"></i>是否确认删除这行数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, classInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="班级编号" prop="id" v-if="dialogStatus=='update'">
              <el-input v-model="temp.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="班级号" prop="classNO">
              <el-input v-model="temp.classNO" type="number" :maxlength="2"></el-input>
            </el-form-item>
            <el-form-item label="班主任" prop="teacherid">
              <el-select v-model="temp.teacherid" filterable placeholder="请选择班主任" style="width: 100%">
                <el-option v-for="item in teacheridOption"
                           :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班主任(前/代)" prop="head2">
              <el-input v-model="temp.head2" :maxlength="16"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="年级号" prop="gradeid">
              <el-date-picker v-model="temp.gradeid" placeholder="选择年级号"
                              align="right" style="width: 100%"
                              type="year" format="yyyy" value-format="yyyy">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="学校名称" prop="schoolid">
              <el-select v-model="temp.schoolid" filterable placeholder="请选择学校名称" style="width: 100%">
                <el-option v-for="item in schoolidOption"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model="temp.flag" placeholder="请选择班级状态" style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 1, maxRows: 4 }"></el-input>
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
  import {fetchList, SubmitTable, valueToLabel, labelToValue} from '@/api/table'

  export default {
    data() {
      return {
        //搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 2,
        searchOption: [
          {key: '1', label: '班级编号'},
          {key: '2', label: '班级号'},
          {key: '3', label: '年级号'}
        ],
        //加载图标
        listLoading: true,
        classInfo: [
          {
            id: 'c1001',
            classNO: 5,
            gradeid: '2014',
            schoolid: 's1001',
            schoolName: '温州市鹿城区蒲鞋市小学龟湖路校区',
            teacherid: '12345678900',
            head: '王安石',
            head2: '李白',
            flag: '2',
            flagName:'停办',
            descr: '好班级'
          },
          {
            id: 'c1002',
            classNO: 8,
            gradeid: '2018',
            schoolid: 's1002',
            schoolName: '温州市鹿城区第八中学',
            teacherid: '12345600789',
            head: '王安石',
            head2: '李白',
            flag: '1',
            flagName:'正常',
            descr: '好班级'
          },
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
          create: '添加班级',
          update: '修改班级'
        },
        //对话框内容
        temp: {
          id: '',
          classNO: '',
          gradeid: '',
          gradeName: '',
          schoolid: '',
          schoolName: '',
          teacherid: '',
          head: '',
          head2: '',
          flag: '',
          descr: ''
        },
        //学校id选项
        schoolidOption: [
          {
            value: 's1001',
            label: '温州市鹿城区蒲鞋市小学龟湖路校区'
          }, {
            value: 's1002',
            label: '温州市鹿城区第八中学'
          },
        ],
        //班主任选项
        teacheridOption: [
          {
            value: '12345678900',
            label: '王安石'
          }, {
            value: '00987654321',
            label: '李白'
          }, {
            value: '12345600789',
            label: '王安石'
          },
        ],
        //标志选项
        flagOption: [
          {
            value: '0',
            label: '正常'
          }, {
            value: '1',
            label: '毕业'
          }, {
            value: '2',
            label: '停办'
          }, {
            value: '3',
            label: '特殊休息'
          },
        ],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          classNO: [{required: true, message: '班级号不能为空', trigger: 'blur'}],
          gradeid: [{required: true, message: '请选择年级号', trigger: 'blur'}],
          teacherid: [{required: true, message: '请选择班主任', trigger: 'blur'}],
          schoolid: [{required: true, message: '请选择所属学校名称', trigger: 'blur'}],
          flag: [{required: true, message: '请选择班级状态', trigger: 'change'}],
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //获取列表
      getList() {
        // this.listLoading = true;
        // fetchList('/classInfo', this.listQuery).then( response => {
        //   this.classInfo = response.data.classInfo;
        //   this.total = response.data.total;
        //   this.listLoading = false;
        // })
      },
      //搜索内容
      handleSearch() {
        console.log('搜索')
      },
      resetTemp() {
        this.temp = {
          id: '',
          classNO: '',
          gradeid: new Date(),
          schoolid: '',
          schoolName: '',
          teacherid: '',
          head: '',
          head2: '',
          flag: '',
          flagName:'',
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
//            SubmitTable('/classInfo', this.temp).then(() => {
//              this.classInfo.unshift(this.temp);
//              this.dialogVisible = false;
//              this.$notify({
//                title: '成功',
//                message: '创建成功',
//                type: 'success',
//                duration: 2000
//              })
//            })
            this.total = this.total + 1;
            //通过select的value值找到label的值，显示给用户
            this.temp.head = valueToLabel(this.teacheridOption, this.temp.teacherid);
            this.temp.schoolName = valueToLabel(this.schoolidOption, this.temp.schoolid);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            //添加到表格
            console.log(this.temp);
            this.classInfo.push(this.temp);
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
        //this.temp.schoolid = labelToValue(this.schoolidOption, this.temp.schoolid);
        //this.temp.teacherid = labelToValue(this.teacheridOption, this.temp.teacherid);
        //this.temp.flag = labelToValue(this.flagOption, this.temp.flag);
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
//            SubmitTable('/classInfo', this.temp).then(() => {
//
//            })
            this.temp.head = valueToLabel(this.teacheridOption, this.temp.teacherid);
            this.temp.schoolName = valueToLabel(this.schoolidOption, this.temp.schoolid);
            this.temp.flageName = valueToLabel(this.flagOption, this.temp.flag);
            for (const v of this.classInfo) {
              if (v.id === this.temp.id) {
                const index = this.classInfo.indexOf(v);
                this.classInfo.splice(index, 1, this.temp);
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
        });

      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.classInfo.indexOf(val);
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
          this.total = this.total - 1;
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

