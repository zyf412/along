<template>
  <div>
      <div class="header">
         <div class="myPic">
              <i class="setting el-icon-s-tools" @click="setMyInfo" title = '修改信息'></i>
              <el-avatar class="avatar" @click.native="avatarDialogVisible=true" :size="50" :src="'http://127.0.0.1:80/api/publicImage/img/'+ myInfo.user_pic" :key="'http://127.0.0.1:80/api/publicImage/img/'+ myInfo.user_pic" ></el-avatar>
              <span>{{myInfo.nickname}}</span>
         </div>
      </div>
       <!-- 弹出头像对话框  -->
        <el-dialog
  :visible.sync="avatarDialogVisible"
  width="30%" class="avatarDialog">
  <img class="avatarImg"  :src="'http://127.0.0.1:80/api/publicImage/img/'+ myInfo.user_pic" alt="">

  <el-upload
         action="http://127.0.0.1:80/my/upload"
         :headers= myHeaders
         name="photo"
         :multiple="false"
        :auto-upload="true"
        :on-success="handleSueecss"
        ref="uploadImage"
        class="upload"
        >
       <el-button size="small" type="primary">修改头像</el-button>
    </el-upload>
</el-dialog>
      <!-- 弹出修改框 -->
        <el-dialog title="修改信息" :visible.sync="settingFormVisible">
         <el-form :model="setInfo" :rules="modifyRules" ref="setInfoRef">
             <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
              <el-input v-model="setInfo.nickname" autocomplete="off"></el-input>
             </el-form-item>
             <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="setInfo.email" autocomplete="off"></el-input>
             </el-form-item>
         </el-form>
        <!-- 修改密码对话框 -->
      <el-dialog
      width="30%"
      title="修改密码"
      :visible.sync="passwordVisible"
      append-to-body>
      <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordFormRef" label-width="100px" class="demo-ruleForm">
       <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password"></el-input>
       </el-form-item>
       <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="passwordForm.checkPassword" type="password"></el-input>
       </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
    <el-button @click="passwordVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyPassword">确 定</el-button>
  </div>
    </el-dialog>

  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="passwordVisible = true">修改密码</el-button>
    <el-button @click="settingFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="modify">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  props: ['myInfo', 'token'],
  data () {
    return {
      myHeaders: null, // 设置请求头
      ifChanged: false, // 是否改变头像
      setInfo: {
        id: '',
        username: '',
        nickname: '',
        email: '',
        user_pic: ''
      },
      settingFormVisible: false,
      avatarDialogVisible: false,
      passwordVisible: false,
      formLabelWidth: '120px', // 弹出框标签的长度
      modifyRules: {
        nickname: [
          { message: '请输入昵称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      passwordForm: {
        newPassword: '',
        checkPassword: ''
      },
      passwordFormRules: {
        newPassword: [
          { message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        checkPassword: [
          { message: '确认新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setMyInfo () {
      this.settingFormVisible = true
      this.setInfo.id = this.myInfo.id
      this.setInfo.username = this.myInfo.username
      this.setInfo.nickname = this.myInfo.nickname
      this.setInfo.email = this.myInfo.email
      this.setInfo.user_pic = this.myInfo.user_pic
    },
    // 修改头像成功
    handleSueecss (res) {
      if (res.status !== 0) {
        return this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.$message({
        message: res.message,
        type: 'success'
      })
      this.ifChanged = true
      this.$emit('changeInfo', this.ifChanged)
      this.avatarDialogVisible = false
      this.$refs.uploadImage.clearFiles()
    },
    // 修改信息
    modify () {
      this.$refs.setInfoRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请正确填写表单项')
        }
        if (!(this.setInfo.nickname === this.myInfo.nickname && this.setInfo.email === this.myInfo.email)) {
          const { data: res } = await this.$http.post('my/userInfo', { email: this.setInfo.email, nickname: this.setInfo.nickname })
          if (res.status !== 0) {
            return this.$message({
              message: res.message,
              type: 'error'
            })
          }
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
        this.settingFormVisible = false
        this.ifChanged = true
        this.$emit('changeInfo', this.ifChanged)
      })
    },
    // 修改密码
    modifyPassword () {
      this.$refs.passwordFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请正确填写表单项')
        }
        if (this.passwordForm.newPassword !== this.passwordForm.checkPassword) {
          return this.$message.error('两次密码不一致')
        }
        const { data: res } = await this.$http.post('my/modifyPassword', { newPassword: this.passwordForm.newPassword })
        if (res.status !== 0) {
          return this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.passwordVisible = false
      })
    }
  },
  created () {
    this.myHeaders = { Authorization: this.token }
  }
}
</script>

<style lang='less' scoped>
    .header {
        height: 80.000025px;
        background-color: rgba(255,255,255,.3);
        box-shadow: 0px 5.000025px 15px 8.000025px rgba(0,0,0,.3) ;
    }
    .myPic {
            float: left;
            height: 80.000025px;
            width: 200.000025px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                margin-left: 5.000025px;
            }
        }
    .setting {
        transition: all 1s;
        cursor: pointer;
    };
    .setting:hover {
        transform: rotate(360deg);
    }
    .avatar {
        transition: all 0.5s;
        cursor: pointer;
        margin: 0 20px;
    }
    .avatar:hover {
        transform: scale(1.3);
    }
    .avatarImg {
        width: 300px;
        margin: 0 auto;
        display: block;
        margin-bottom: 20px;
    }
    // .avatarDialog {
    //   position: absolute;
    // }
    .upload {
      display: flex;
      justify-content: flex-end;
    }

</style>
