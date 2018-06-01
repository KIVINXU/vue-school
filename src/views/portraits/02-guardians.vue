<template>
  <el-form ref="guardianForm" :rules="guardianRules" :model="guardianForm" label-width="100px">
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="guardianForm">
        <el-form-item labelWidth="125px">
          <el-button type="text" class="avatar"
                     :disabled="!idLocked"
                     @click="toggleShow" title="点击上传照片">
            <img v-if="imageInfo.face" :src="imageInfo.face" alt="" style="width: 98%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-button>
          <image-upload :field="imageInfo.imgField"
                        :img-format="imageInfo.format"
                        :url="imageInfo.url"
                        :params="{id: guardianForm.id}"
                        inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess"
                        @crop-upload-success="cropUploadSuccess"
                        :no-circle="true"
                        :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="委托人姓名：">
          <el-input v-model.trim="guardianForm.name"
                    :readonly="nameLocked"
                    style="float: left;width:50%;margin-right: 10px"></el-input>
          <template>
            <el-radio-group v-model="guardianForm.sex">
              <el-radio-button label="男">男</el-radio-button>
              <el-radio-button label="女">女</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id">
          <el-input v-model.trim="guardianForm.id" :readonly="idLocked">
            <el-button slot="append"
                       :disabled="fetchButton"
                       @click="handleStudentInfo">抓取信息</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="contact">
          <el-input v-model.trim="guardianForm.contact" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址:" prop="address">
          <el-input v-model.trim="guardianForm.address" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="descr">
          <el-input type="textarea" v-model.trim="guardianForm.descr" :maxlength="128"></el-input>
          <span style="font-size: 13px; color: #606266;">最近更新时间：{{guardianForm.mtime}}</span>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="warning"
                       size="medium"
                       @click="resetForm">
              取消录入
            </el-button>
            <el-button type="primary"
                       size="medium"
                       :disabled="!idLocked"
                       @click="submitForm('guardianForm')">
              确认录入
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="12" :md="14" :lg="16" style="margin-left: -1px">
        <el-table :data="ing" class="tab">
          <el-table-column label="正在进行绑定的信息" width="150px"></el-table-column>
          <el-table-column label="主监护人" width="80px" prop="responseName"></el-table-column>
          <el-table-column label="与学生关系" width="100px" property="请选择">
            <template slot-scope="scope">
              <el-select v-model="scope.row.relation" value="guardianRela" size="mini" style="width: 100px">
                <el-option
                  v-for="item in options"
                  :key="item.key"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="stuName"></el-table-column>
        </el-table>
        <el-table :data="stuInfo" class="tab" >
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="主监护人" width="80px" prop="guarder"></el-table-column>
          <el-table-column label="与学生关系" width="90px" prop="relation"></el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="name"></el-table-column>
          <el-table-column label="所属学校" width="160px" prop="schoolname"></el-table-column>
          <el-table-column label="所属班级" width="80px" prop="classname"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ImageUpload from 'vue-image-crop-upload'
  import { fetchList, SubmitTable, fetchSearchOption } from '@/api/table'
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";
  import {validateTel, validateIdentity18} from "@/utils/validate";


  export default {
    components: {
      ElRadioButton,
      ElButton,
      'image-upload': ImageUpload
    },
    data() {
      //证件号码验证
      const checkID_number = (rule, value, callback) => {
        if (!validateIdentity18(value)) {
          this.fetchButton = true;
          callback(new Error('请输入正确的18位身份证号码'))
        } else {
          this.fetchButton = false;
          callback()
        }
      };
      //电话号码校验
      const checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话号码不能为空'));
        }
        if (!validateTel(value)) {
          callback(new Error('请输入正确的11位号码'));
        } else {
          callback();
        }
      };
      return {
        //接送人数据
        guardianForm: {
          name: '',
          sex: '男',
          id: '',
          facekey: '', //表明后台接受到图片的返回值
          facesize: '', //后台图片的尺寸
          //主监护人表格内容
          guarders: [],
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        },
        //监护人名称和ID是否锁定为只读
        nameLocked: false,
        idLocked: false,
        //抓取按钮是否可用
        fetchButton: true,
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
        guardianRules: {
          id: [
            {required: true, message: '请输入证件号码', trigger: 'blur'},
            {validator: checkID_number, trigger: ['blur','change']}
          ],
          contact: [
            {required: true, message: '请输入有效电话', trigger: 'blur'},
            {validator: checkTel, trigger: 'blur'}
          ],
        },
        //上传图片
        showImage: false,
        //图片上传插件参数
        imageInfo: {
          url: '/faces',
          face: '',
          imgField: 'face',
          format: 'jpg'
        },
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
      }
    },
    created () {
      this.getList();
    },
    methods: {
      //传过来是微秒
      timestampToTime(timestamp) {
        let time = timestamp.toString().split('.');
        const date = new Date(parseInt(time[0]) * 1000);
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/';
        const Y = date.getFullYear() + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return M + D + Y + h + m + s;
      },
      //获取学生关系下拉框选项
      getList() {
        fetchSearchOption('/faceConsigner',{method: 'FieldLabel'})
          .then(response => {
            const data = response.data;
            if(data.msg && data.msg !== ''){
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'error',
                duration: 2000
              });
            }
            if(data.data && data.data !== []){
              this.options = data.data.RELATION;
            }
          })
      },
      toggleShow() {
        this.showImage = !this.showImage;
      },
      //照片裁剪完成后
      cropSuccess(avatarUrl, field) {
        this.imageInfo.face = avatarUrl;
      },
      //照片上传成功后
      cropUploadSuccess(jsonData, field){
        if(jsonData.id === 0){
          this.guardianForm.facekey = jsonData.key;
          this.guardianForm.facesize = jsonData.size;
        }
      },
      //输入身份证编号可以自动补全表单内容和表格内容
      handleStudentInfo() {
        fetchSearchOption('/faceConsigner', { method: 'FieldIdnumber', idnumber: this.guardianForm.id})
          .then(response => {
            this.idLocked = true;
            const data = response.data;
            if (data.msg && data.msg !== '') {
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'error',
                duration: 2000
              });
            }
            if (data.data.id && data.data.name) {
              //监护人表单信息加载
              this.guardianForm = data.data;
              //转化时间戳
              if(this.guardianForm.mtime){
                this.guardianForm.mtime = this.timestampToTime(this.guardianForm.mtime);
              }
              //表格信息加载
              //给每条数据添加对象--显示下拉框
              if(this.guardianForm.guarders){
                this.guardianForm.guarders.forEach(item => {
                  this.$set(item, 'selectShow', false); //set方法才能添加对象
                });
              }else {
                this.guardianForm.guarders = [];
              }
              //如果存在facekey，图片内容加载
              if(this.guardianForm.facekey){
                fetchSearchOption('/face/portraits', {method: 'FieldFacekey', facekey: this.guardianForm.facekey}).then(response => {
                  const faceData = response.data;
                  this.imageInfo.face = 'data:image/jpeg;base64,' + faceData.data.face;
                });
              }
              this.nameLocked = true;
            }else {
              this.$message({
                showClose: true,
                message: '找不到此证件号码对应的信息',
                type: 'warning',
                duration: 2000
              });
              this.nameLocked = false;
            }
          });
      },
      //重置监护人信息
      resetForm() {
        this.guardianForm = {
          name: '',
          sex: '男',
          id: '',
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        };
        this.imageInfo.face = '';
        this.idLocked = false;
        this.nameLocked = false;
      },
      //上传主监护人信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let temp = Object.assign(this.guardianForm, {method: 'Update'});
            delete temp.guarders;
            delete temp.face;
            delete temp.mtime;
            SubmitTable('/faceConsigner', temp).then((response) => {
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
                //默认状态不上传 如果图片有变化则上传，状态再改回默认
                this.$notify({
                  title: '成功',
                  message: '录入成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetForm();
              }
            })
          }
        })
      },
    }
  }
</script>
<style lang="scss">
  .guardianForm {
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
    border: #3a8ee6 1px dashed !important;
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
