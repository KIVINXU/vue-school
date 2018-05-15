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
                         disabled>
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
    <el-row class="demo-class2">
      <el-col :md="4" :lg="3">
        <img class="avatar2" :src="visitorInfo.pic">
      </el-col>
      <el-col :span="19">
        <el-form class="demo-class" inline="">
          <el-form-item label="访客姓名">{{visitorInfo.name}}</el-form-item>
          <el-form-item label="性别">{{visitorInfo.sex}}</el-form-item><br>
          <el-form-item label="证件类别">{{visitorInfo.id_type}}</el-form-item>
          <el-form-item label="证件号码">{{visitorInfo.id_number}}</el-form-item><br>
          <el-form-item label="联系方式">{{visitorInfo.contact}}</el-form-item><br>
          <el-form-item label="联系住址">{{visitorInfo.address}}</el-form-item><br>
          <el-form-item label="说  明">{{visitorInfo.descr}}</el-form-item><br>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="list" border highlightCurrentRow>
      <el-table-column prop="time" :show-overflow-tooltip="true" label="时间" width="150px"></el-table-column>
      <el-table-column prop="idfent" :show-overflow-tooltip="true" label="身份" width="100px"></el-table-column>
      <el-table-column prop="studentid" :show-overflow-tooltip="true" label="学生编号" width="230px"></el-table-column>
      <el-table-column prop="studentname" :show-overflow-tooltip="true" label="姓名" width="120px"></el-table-column>
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
  </div>
</template>

<script>
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table';
  import {validateTel, validateIdentity18, validatePassport, validateOther} from "@/utils/validate";
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {
      ElRow
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
        total: 1,
        searchOption: [],
        //加载图标
        listLoading: true,
        //访客信息
        visitorInfo: {
          pic:'@/../static/pic.jpg',
          name: '蒲鞋市',
          sex: '男',
          id_type: '身份证',
          id_number:'330381199912121414',
          contact: '13000000000',
          address: '蒲鞋市蒲鞋市蒲鞋市蒲鞋市蒲鞋市蒲鞋市',
          descr: '蒲鞋市',
        },
        //访问信息
        list: [
          {
            time: '5/10/2018 10:28:00',
            idfent: '主监护人',
            studentid: '1101',
            studentname: '卜培林',
            descr: 'sadas ',
          },
        ],
      }
    },
    // created() {
    //   this.getList();
    // },
    // watch: {
    //   $route() {
    //     this.getList();
    //   }
    // },
    methods: {
      //请求后台
      requestList(List) {
        fetchList('/studentHome', List).then(response => {
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
              item.d_of_b = new Date(item.d_of_b).toLocaleDateString();
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
          fetchSearchOption('/studentHome', {method: 'FieldQuery'})
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
    }
  }

</script>
<style>
  .avatar2 {
    width: 120px;
    height: 180px;
  }

  .demo-class2 {
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
