<template>
  <el-form ref="visitorForm" :rules="visitorRules" :model="visitorForm" label-width="100px">
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="visitorForm">
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
                        :params="{id: visitorForm.id}"
                        inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess"
                        @crop-upload-success="cropUploadSuccess"
                        :no-circle="true"
                        :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="访客姓名:">
          <el-input v-model.trim="visitorForm.name"
                    :maxlength="8"
                    :readonly="nameLocked"
                    style="float: left;width:50%;margin-right: 10px"></el-input>
          <el-radio-group v-model="visitorForm.sex">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id">
          <el-input v-model.trim="visitorForm.id" :readonly="idLocked">
            <el-button slot="append"
                       :disabled="fetchButton"
                       @click="handleStudentInfo">抓取信息</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model.trim="visitorForm.contact" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址:" prop="address">
          <el-input v-model.trim="visitorForm.address" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="descr">
          <el-input type="textarea" v-model.trim="visitorForm.descr" :maxlength="128"></el-input>
          <span style="font-size: 13px; color: #606266;">最近更新时间：{{visitorForm.mtime}}</span>
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
                       @click="submitForm('visitorForm')">
              确认录入
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="20" :md="14" :lg="16" style="margin-left: -1px">
        <div class="tab">
          <el-form-item label="访问对象：">
            <el-input v-model.trim="visitorForm.visitTo"
                      placeholder="请输入模糊查询内容"
                      :disabled="visitorForm.select !== '3'">
              <el-select v-model="visitorForm.select" slot="prepend" placeholder="请选择查询对象" style="width: 100px">
                <el-option v-for="item in visitOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-button slot="append"
                         :disabled="visitorForm.select !== '3'"
                         @click="dialogVisible = true">查询
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="访问姓名：" prop="visitTel" style="float: left">
            <el-input v-model.trim="visitorForm.visitName" readonly></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="visitTel" style="float: left">
            <el-input v-model.number="visitorForm.visitTel" readonly></el-input>
          </el-form-item>
          <el-form-item label="访问原因：" prop="visitTel" style="clear: left">
            <el-input v-model.number="visitorForm.visitReason"></el-input>
          </el-form-item>
          
        </div>
        <el-table :data="teacherInfo" class="tab" style="margin-top: -1px">
          <el-table-column label="序号" width="50px" type="index"></el-table-column>
          <el-table-column label="姓名" width="100px" prop="teacherName" ></el-table-column>
          <el-table-column label="性别" width="50px" prop="teacherGender"></el-table-column>
          <el-table-column label="职位" width="150px" prop="teacherJob"></el-table-column>
          <el-table-column label="所属学校" width="200px" prop="school"></el-table-column>
          <el-table-column label="手机号码" width="100px"  prop="teacherPhone"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="findResult(scope.row)">
                确认选择
              </el-button>
            </template>
          </el-table-column>
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
        //访客数据
        visitorForm: {
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
        idLocked: false,
        nameLocked: false,
        //抓取按钮是否可用
        fetchButton: true,
        //教师数据
        teacherInfo: [
          {
            teacherName:'阿根达',
            teacherGender:'女',
            school:'温州鹿城区第十三小学',
            teacherJob:'六二班班主任',
            teacherPhone:'12345678900',
          },
          {
            teacherName:'阿根达斯',
            teacherGender:'男',
            school:'温州鹿城区第十三小学',
            teacherJob:'六年级语文老师',
            teacherPhone:'12345678900',
          },
        ],
        visitorRules: {
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
        //访问对象选项
        visitOption: [{
          value: '1',
          label: '教师姓名'
        }, {
          value: '2',
          label: '手机号码'
        }, {
          value: '3',
          label: '其他模糊查询'
        }],
        value: '',
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
        fetchSearchOption('/faceVisitor',{method: 'FieldLabel'})
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
      findResult(row){
        this.visitorForm.visitName=row.teacherName;
        this.visitorForm.visitTel=row.teacherPhone;
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
          this.visitorForm.facekey = jsonData.key;
          this.visitorForm.facesize = jsonData.size;
        }
      },
      //输入身份证编号可以自动补全表单内容和表格内容
      handleStudentInfo() {
        fetchSearchOption('/faceVisitor', { method: 'FieldIdnumber', idnumber: this.visitorForm.id})
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
              this.visitorForm = data.data;
              //转化时间戳
              if(this.visitorForm.mtime){
                this.visitorForm.mtime = this.timestampToTime(this.visitorForm.mtime);
              }
              //表格信息加载
              //给每条数据添加对象--显示下拉框
              if(this.visitorForm.guarders){
                this.visitorForm.guarders.forEach(item => {
                  this.$set(item, 'selectShow', false); //set方法才能添加对象
                });
              }else {
                this.visitorForm.guarders = [];
              }
              //如果存在facekey，图片内容加载
              if(this.visitorForm.facekey){
                fetchSearchOption('/face/portraits', {method: 'FieldFacekey', facekey: this.visitorForm.facekey}).then(response => {
                  const faceData = response.data;
                  this.imageInfo.face = 'data:image/jpeg;base64,' + faceData.data.face;
                });
              }
              this.nameLocked = true;
            }else {
              this.nameLocked = false;
            }
          });
      },
      //重置监护人信息
      resetForm() {
        this.visitorForm = {
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
      //上传员工信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let temp = Object.assign(this.visitorForm, {method: 'Insert'});
            delete temp.guarders;
            delete temp.face;
            delete temp.mtime;
            delete temp.guarders_id;
            SubmitTable('/faceVisitor', temp).then((response) => {
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
      }
    }
  }
</script>
<style lang="scss">
  .visitorForm {
    border-radius: 8px;
    border: #AAAAAA 1px solid;
    padding: 10px;
  }

  .tab {
    padding: 20px;
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


  .el-form-item {
    margin-bottom: 14px;
  }

</style>
