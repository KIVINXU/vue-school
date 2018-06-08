<template>
  <div>
    <el-row>
      <el-col class="el-table-margin" :offset="21">
        <el-button type="warning"
                   size="medium"
                   @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
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
                      :maxlength="8"
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
            <el-input v-model.trim="guardianForm.address" :maxlength="32"></el-input>
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
        <el-col :xs="22" :sm="12" :md="14" :lg="15" style="margin-left: -1px">
          <el-table :data="ing" class="tab">
            <el-table-column label="正在进行绑定的信息" width="150px"></el-table-column>
            <el-table-column label="主监护人" width="100px" prop="guarderName"></el-table-column>
            <el-table-column label="与主监护人关系" width="120px" property="请选择">
              <template slot-scope="scope">
                <el-select v-model="scope.row.guardianRela"
                           value-key="key"
                           size="mini"
                           style="width: 100px">
                  <el-option
                    v-for="item in options"
                    :key="item.key"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="学生姓名" width="100px" prop="stuName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--只有委托人姓名，身份证号，照片，关系存在才能绑定-->
                <el-button type="text"
                           :disabled="confirmDisabled"
                           @click="handleComfirm(scope.row)">确认绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
        
          <el-table :data="guardianForm.consigners" class="tab" >
            <el-table-column label="序号" width="50px" type="index"></el-table-column>
            <el-table-column label="主监护人" width="100px" prop="guarder"></el-table-column>
            <el-table-column label="与主监护人关系" width="120px" prop="relation.label"></el-table-column>
            <el-table-column label="学生" width="100px" prop="name"></el-table-column>
            <el-table-column label="所属学校" width="160px" prop="schoolname"></el-table-column>
            <el-table-column label="所属班级" width="100px" prop="classname"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
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
          consigners: [],
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        },
        //监护人名称和ID是否锁定为只读
        nameLocked: false,
        idLocked: false,
        //确认绑定按钮是否可用
        confirmDisabled: true,
        //抓取按钮是否可用
        fetchButton: true,
        //监护人学生数据
        ing:[
          {
            guarderName: this.$route.params.guarderName,
            stuName: this.$route.params.stuName,
            classname: this.$route.params.classname,
            schoolname: this.$route.params.schoolname,
            guardianRela:'',
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
          format: 'jpg',
          key: '',
          size: ''
        },
        //关系选项
        options: [],
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
        let listTemp = {
          method: 'FieldLabel',
          snumber: this.$route.params.snumber,
          guarderid: this.$route.params.guarderid,
        };
        fetchSearchOption('/faceConsigner',listTemp)
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
      //照片上传成功后,获取照片的key，size
      cropUploadSuccess(jsonData, field){
        if(jsonData.id === 0){
          this.imageInfo.key = jsonData.key;
          this.imageInfo.size = jsonData.size;
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
              //如果存在facekey，图片内容加载
              if(data.data.facekey){
                fetchSearchOption('/face/portraits', {method: 'FieldFacekey', facekey: this.guardianForm.facekey}).then(response => {
                  const faceData = response.data;
                  this.imageInfo.face = 'data:image/jpeg;base64,' + faceData.data.face;
                });
                //如果抓取不到照片，则不能绑定
                this.confirmDisabled = false;
              }
              //委托人姓名和身份证存在 姓名栏改为只读
              this.nameLocked = true;
            }else {
              this.confirmDisabled = true;
              this.nameLocked = false;
            }
            //表格信息加载
            //给每条数据添加对象--显示下拉框
            if(data.data.consigners_id === '00000'){
              this.guardianForm.consigners = data.data.consigners;
            }else {
              this.guardianForm.consigners = [];
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
            //如果抓取图片不存在,则判断
            if(!this.guardianForm.facekey) {
              if(!this.imageInfo.key) {
                this.$message({
                  showClose: true,
                  message: '请先上传照片',
                  type: 'error',
                  duration: 2000
                });
                return;
              }else {
                //如果已上传照片，则复制照片的key
                this.guardianForm.facekey = this.imageInfo.key;
                this.guardianForm.facesize = this.imageInfo.size;
              }
            }
            let temp = Object.assign(this.guardianForm, {method: 'Insert'});
            delete temp.guarders;
            delete temp.face;
            delete temp.mtime;
            delete temp.guarders_id;
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
                this.$notify({
                  title: '成功',
                  message: '录入成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetForm();
              }
            });
          }
        })
      },
      //确认绑定委托人信息
      handleComfirm() {
        let confirmData = {
          method: 'Append',
          snumber: this.$route.params.snumber,
          guarderid: this.$route.params.guarderid,
          consigid: this.guardianForm.id,
          relation: this.ing[0].guardianRela
        };
        SubmitTable('/faceConsigner', confirmData).then((response) => {
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
            this.guardianForm.consigners.append(this.ing[0]);
          }
        })
      }
      
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
