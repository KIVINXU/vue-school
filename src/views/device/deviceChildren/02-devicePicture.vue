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
                         icon="el-icon-edit"
                         @click="handleUpdate(list[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                详情
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
        <el-table :data="list" ref="facePicsTable"
                  border highlightCurrentRow
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="图片编号" width="120px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="标示码" width="350px"></el-table-column>
          <el-table-column prop="size" :show-overflow-tooltip="true" label="大小" width="60px"></el-table-column>
          <el-table-column prop="ctime" :show-overflow-tooltip="true" label="创建时间" width="140px"></el-table-column>
          <el-table-column prop="fdname" :show-overflow-tooltip="true" label="库名称" width="120px"></el-table-column>
          <el-table-column prop="eqpid" :show-overflow-tooltip="true" label="设备编号"></el-table-column>
          <el-table-column prop="flagname" :show-overflow-tooltip="true" label="状态" width="50px"></el-table-column>
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
            <el-form-item label="标示码">
              <el-input v-model="temp.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="temp.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="大小">
              <el-input v-model="temp.size" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="库标示码">
              <el-input v-model="temp.fdid" disabled></el-input>
            </el-form-item>
            <el-form-item label="设备编号">
              <el-input v-model="temp.eqpid" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="temp.flagname" disabled></el-input>
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
      <div slot="footer" style="height: 0; margin-top: -50px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!--<el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>-->
        <el-button type="primary" @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList,SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table'
  import ElFormItem from "element-ui/packages/form/src/form-item.vue";
  import ElDialog from "element-ui/packages/dialog/src/component.vue";

  export default {
    components: {
      ElDialog,
      ElFormItem
    },
    data() {
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
        list: [
          {
            id: '12345678912345678912345678912345',
            name: '1234567891234567891234567891234512345678912345678912345678912345',
            size: '1101',
            fdid:'111',
            fdname: '计算机学校',
            eqpid: 'EDS1101',
            flag: 1,
            flagname:'正常',
            ctime: 13122231,
            descr: '很好'
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
//          create: '添加人脸图片',
          update: '修改人脸图片'
        },
        //对话框内容
        temp: {
          id: '',
          name: '',
          size: '',
          fdid:'',
          fdname: '',
          eqpid: '',
          flag:'',
          flagname:'',
          ctime:'',
          descr: ''
        },
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {}
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
      timestampToTime(timestamp) {
        if(timestamp < 1000000000000) {
          timestamp = timestamp * 1000;
        } //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const date = new Date(timestamp);
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/';
        const Y = date.getFullYear() + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return M + D + Y + h + m + s;
      },
      //请求后台
      requestList(List) {
        fetchList('/devicePicture', List).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 2000,
            });
          }
          if (data.data) {
            this.list = data.data;
            this.list.forEach(item => {
              //传过来是秒
              item.ctime = this.timestampToTime(item.ctime);
            });
            this.total = data.total;
          } else {
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
          fetchSearchOption('/devicePicture', {method: 'FieldQuery'})
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
//      handleOption() {
//         if (this.flagOption.length === 0) {
//           fetchSearchOption('/devicePicture', {method: 'FieldLabel'})
//             .then(response => {
//               const data = response.data;
//               if (data.msg && data.msg !== '') {
//                 this.$message({
//                   showClose: true,
//                   message: data.msg,
//                   type: 'error',
//                   duration: 2000
//                 });
//               }
//               if (data.data) {
//                 this.flagOption = data.data.FLAG;
//               }
//             });
//         }
//      },
//      resetTemp() {
//        this.temp = {
//          id: '',
//          name: '',
//          size: '',
//          fdid:'',
//          fdname: '',
//          eqpid: '',
//          flag:'',
//          flagname:'',
//          descr: ''
//        }
//      },
      // 添加对话框
//      handleCreate() {
//         this.resetTemp();
//         this.handleOption();
//         //打开对话框先清空select选择框
//         this.dialogStatus = 'create';
//         this.dialogVisible = true;
//         this.$nextTick(() => {
//           this.$refs['dataForm'].clearValidate();
//         })
//      },
      //添加完毕上传
//      createData() {
//         this.$refs['dataForm'].validate((valid) => {
//           if (valid) {
//             this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
//             var temp = Object.assign({method: 'Insert'}, this.temp);
//             delete temp.flagname;
//             SubmitTable('/devicePicture', temp).then(response => {
//               const data = response.data;
//               if (data.msg && data.msg !== '') {
//                 this.$message({
//                   showClose: true,
//                   message: data.msg,
//                   type: 'info',
//                   duration: 2000
//                 });
//               }
//               if (data.id === '00000') {
//                 this.list.unshift(this.temp);
//                 this.dialogVisible = false;
//                 this.$notify({
//                   title: '成功',
//                   message: '创建成功',
//                   type: 'success',
//                   duration: 2000
//                 });
//                 this.total += 1;
//               }
//             });
//           }
//         })
//      },
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Update'}, this.temp);
            SubmitTable('/devicePicture', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'info',
                  duration: 2000,
                });
              }
              if (data.id === '00000') {
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
                  duration: 2000,
                  showClose:true
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
//         this.deleteDialogVisible = true;
//         this.deleteName = this.list[index].name
      },
      rowDelete(index, row) {
//         var deleteData = Object.assign({method: 'Delete'}, {id: this.list[index].id});
//         SubmitTable('/devicePicture', deleteData).then(response => {
//           const data = response.data;
//           if (data.msg && data.msg !== '') {
//             this.$message({
//               showClose: true,
//               message: data.msg,
//               type: 'info',
//               duration: 2000
//             });
//           }
//           if (data.id === '00000') {
//             this.$notify({
//               title: '成功',
//               message: '删除成功',
//               type: 'success',
//               duration: 2000
//             });
//             row.splice(index, 1);
//             this.deleteDialogVisible = false;
//             this.total -= 1;
//           }
//         });
      },
    }
  }
  
</script>
