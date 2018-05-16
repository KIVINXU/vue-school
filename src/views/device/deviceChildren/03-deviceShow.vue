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
                         icon="el-icon-plus"
                         disabled>
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
                         disabled>
                删除
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-upload" disabled>
                导入
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-download" disabled>
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
          <el-table-column prop="id" :show-overflow-tooltip="true" label="编号" width="50px"></el-table-column>
          <el-table-column prop="time" :show-overflow-tooltip="true" label="时间" width="100px"></el-table-column>
          <el-table-column prop="result" :show-overflow-tooltip="true" label="结果" width="60px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名" width="120px"></el-table-column>
          <el-table-column prop="sex" :show-overflow-tooltip="true" label="性别" width="50px"></el-table-column>
          <el-table-column prop="idfent" :show-overflow-tooltip="true" label="身份" width="100px"></el-table-column>
          <el-table-column prop="visitor" :show-overflow-tooltip="true" label="访问对象"></el-table-column>
          <el-table-column prop="relation" :show-overflow-tooltip="true" label="关系" width="110px"></el-table-column>
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
            <el-form-item label="编号" prop="ID">
              <el-input v-model="temp.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="size">
              <el-input v-model="temp.sex" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="身份" prop="fdID">
              <el-input v-model="temp.idfent" disabled></el-input>
            </el-form-item>
            <el-form-item label="访问对象" prop="eqpID">
              <el-input v-model="temp.visitor" disabled></el-input>
            </el-form-item>
            <el-form-item label="关系" prop="flag">
              <el-input v-model="temp.relation" disabled></el-input>
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
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table'
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
            id: '1101',
            time: '5/10/2018 10:28:00',
            result: '成功',
            name: '卜培林',
            sex: '男',
            idfent: '家长',
            visitor: '卜以立',
            relation: '主监护人',
            descr: 'sadas ',
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
          create: '添加展示信息',
          update: '修改展示信息'
        },
        //对话框内容
        temp: {
          id: '',
          time: '',
          result: '',
          name: '',
          sex: '',
          type: '',
          relation: '',
          descr: '',
        },
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
      //传过来是秒
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
        fetchList('/deviceShow', List).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 2000,
              showClose: true
            });
          }
          if (data.data) {
            this.list = data.data;
            this.list.forEach(item => {
              item.time = this.timestampToTime(item.time);
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
          fetchSearchOption('/deviceShow', {method: 'FieldQuery'})
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
      resetTemp() {
        this.temp = {
          id: '',
          time: '',
          result: '',
          name: '',
          sex: '',
          type: '',
          relation: '',
          descr: '',
        }
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
         this.$refs['dataForm'].validate((valid) => {
           if (valid) {
             let temp = Object.assign({method: 'Update'}, this.temp.descr);
             SubmitTable('/deviceShow', temp).then(response => {
               const data = response.data;
               if (data.msg && data.msg !== '') {
                 this.$message({
                   message: data.msg,
                   type: 'info',
                   duration: 2000,
                   showClose:true
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
    }
  }

</script>
