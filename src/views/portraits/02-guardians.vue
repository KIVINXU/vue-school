<template>
  <el-form ref="guardianForm" :rules="parentRules" :model="guardianForm" label-width="100px">
    <el-row style="margin-bottom: 10px">
      <el-col :xs="20" :sm="12" :md="9" :lg="7">
        <el-input placeholder="请输入证件号码" >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" @click="submitForm('parentForm')">确认录入</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="7" class="parentForm">
        <el-form-item>
          <el-button type="text" class="avatar" @click="toggleShow" title="点击上传照片">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" style="width: 98%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-button>
          <image-upload field="img" img-format="jpg" inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess" :no-circle="true" :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="接送人姓名：">
          <el-input v-model="guardianForm.name" readonly style="float: left;width:50%;margin-right: 10px"></el-input>
          <template>
            <el-radio-group v-model="guardianForm.gender">
              <el-radio-button label="M">男</el-radio-button>
              <el-radio-button label="F">女</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input v-model="guardianForm.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model="guardianForm.tel" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址：" prop="addr">
          <el-input v-model="guardianForm.addr" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="desc">
          <el-input type="textarea" v-model="guardianForm.desc" :maxlength="128"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="12" :md="14" :lg="16" :offset="1">
        <el-table :data="ing" class="tab">
          <el-table-column label="正在进行绑定的信息" width="150px"></el-table-column>
          <el-table-column label="责任人" width="80px" prop="responseName"></el-table-column>
          <el-table-column label="与责任人关系" width="100px" property="请选择">
            <template slot-scope="scope">
              <el-select v-model="scope.row.guardianRela" value="guardianRela" size="mini" style="width: 100px">
                <el-option
                  v-for="item in options" :key="item.key" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="stuName"></el-table-column>
        </el-table>
        <el-table :data="stuInfo" class="tab" >
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="责任人" width="80px" prop="responseName"></el-table-column>
          <el-table-column label="与责任人关系" width="90px" prop="guardianRela"></el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="stuName"></el-table-column>
          <el-table-column label="所属学校" width="160px" prop="stuSchool"></el-table-column>
          <el-table-column label="所属班级" width="80px" prop="stuClass"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ImageUpload from 'vue-image-crop-upload'
  import {createPerson} from '@/api/table'
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";

  export default {
    components: {
      ElRadioButton,
      ElButton,
      'image-upload': ImageUpload
    },
    data() {
      //电话号码校验
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话号码不能为空'));
        }
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback(new Error('请输入正确的11位号码'));
        } else {
          callback();
        }
      };
      return {
        //正在进行绑定的接送人信息
        ing:[
          {
            stuName:this.$route.params.stuName,
            responseName:this.$route.params.responseName,
            guardianRela:'',
          },
        ],
        //学生数据
        stuInfo: [
          {
            stuName: '汪涵',
            guardianRela: "父母",
            stuSchool: "温州市鹿城第八十八小学",
            stuClass: "六<22>班",
            responseName:'谢娜',
          },
          {
            stuName: '吴亦凡',
            guardianRela: "爷奶",
            stuSchool: "温州市鹿城区第三小学",
            stuClass: "六<12>班",
            responseName:'谢娜',
          },
          {
            stuName: '王者荣耀',
            guardianRela: "保姆",
            stuSchool: "温州市鹿城区小学",
            stuClass: "六<2>班",
            responseName:'谢娜',
          },
        ],
        //接送人数据
        guardianForm: {
          name: '',
          gender: 'M',
          id: '',
          tel: '',
          addr: '',
          desc: '',
        },
        parentRules: {
          tel: [
            {required: true, message: '请输入有效电话', trigger: 'blur'},
            {validator: checkTel, trigger: 'change'}
          ],
          addr: [
            {required: true, message: '请输入有效住址', trigger: 'blur'}
          ]
        },
        //tabs标签切换
        activeName: 'guardian',
        //上传图片
        showImage: false,
        avatarUrl: '',
        //关系选项
        options: [
          {
            key: 1,
            label: '父母',
          },
          {
            key: 2,
            label: '爷奶',
          },
          {
            key: 3,
            label: '父系长辈',
          },
          {
            key: 4,
            label: '母系长辈',
          },
        ],
        value: '',
        imgsize:'1:2',
      }
    },
    methods: {
      selectShow(row) {
        row.clickshow = !row.clickshow;
      },
      toggleShow() {
        this.showImage = !this.showImage;
      },
      cropSuccess(avatarUrl, field) {
        console.log('-------- 裁剪成功 --------');
        this.avatarUrl = avatarUrl;
      },
      //上传责任人信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.parentForm = Object.assign(this.parentForm, {imgUrl: this.avatarUrl})
            createPerson('/portraits', this.parentForm).then((response) => {
              console.log(response);
              this.$notify({
                title: '录入成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        })
      },
    }
  }
</script>
<style lang="less">
  .parentForm {
    border-radius: 8px;
    border: #AAAAAA 1px solid;
    padding: 10px;
  }

  .tab {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #aaa;
  }

  .avatar {
    border: #3a8ee6 1px dashed;
    border-radius: 6px;
    width: 120px;
    height: 180px;
    text-align: center;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .el-form-item{
    margin-bottom: 14px;
  }
</style>
