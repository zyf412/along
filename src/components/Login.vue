<template>
  <div class="loginContainer">
     <div class="box">
          <div class="login" v-if="loginShow">
            <el-form class="LoginForm" :model="loginForm" :rules="formRules" ref="loginFormRef" label-width="80px">
              <el-form-item label="账号" prop="username">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns" v-if="btnShow">
             <el-button type="primary" @click="login" @keyup.enter="login">登录</el-button>
             <el-button type="info" @click="resetLogin">重置</el-button>
             <el-button type="info" @click="goRegister">去注册</el-button>
            </el-form-item>
            </el-form>
      </div>
      <div class="register" v-if="registerShow">
            <el-form class="LoginForm" :model="registerForm" :rules="formRules" ref="registerFormRef" label-width="80px">
              <el-form-item label="账号" prop="username">
              <el-input v-model="registerForm.username"></el-input>
              </el-form-item>
                <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" type="password"></el-input>
            </el-form-item>
             <el-form-item label="确认密码" prop="password">
              <el-input v-model="registerForm.checkPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns" v-if="btnShow">
             <el-button type="primary" @click="register" @keyup.enter="register">注册</el-button>
             <el-button type="info" @click="resetRegister">重置</el-button>
             <el-button type="info" @click="goLogin">去登录</el-button>
            </el-form-item>
            </el-form>
      </div>
     </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginShow: true,
      btnShow: true,
      registerShow: false,
      loginForm: {
        username: 'zyf',
        password: '123456'
      },
      registerForm: {
        username: '',
        password: '',
        checkPassword: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLogin () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://127.0.0.1:80/api/login', this.loginForm)
        console.log(res)
        if (res.status !== 0) {
          return this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.$message('登录成功')
        window.sessionStorage.setItem('token', res.token)
        this.$router.push('/home')
      })
    },
    goRegister () {
      this.registerShow = true
      this.loginShow = false
    },
    goLogin () {
      this.registerShow = false
      this.loginShow = true
    },
    resetRegister () {
      this.$refs.registerFormRef.resetFields()
    },
    register () {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        if (this.registerForm.password !== this.registerForm.checkPassword) {
          return this.$message({ message: '两次密码不一致', type: 'error' })
        }
        const { data: res } = await this.$http.post('http://127.0.0.1:80/api/register', this.registerForm)
        if (res.status !== 0) {
          return this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.$message('注册成功')
        this.goLogin()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loginContainer{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../assets/bgc1.jpg') no-repeat;
    background-size: 100% 100%;
    .box {
        width: 400px;
        height: 300px;
        position: relative;
        border-radius: 10px;
    }
    .box:hover {
        background-color: rgba(255, 255, 255, .2);
        /deep/.el-input__inner {
          background-color: #fff;
          outline: none;
          border: 0px;
        }
    }
    .login,
    .register {
        position: absolute;
        top:0px;
        left: 0px;
        width: 400px;
        height: 280px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .LoginForm {
        width: 100%;
        height: 200px;
        box-sizing: border-box;
        padding: 5px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        /deep/.el-input__inner {
          background-color: rgba(255, 255, 255, .3);
          outline: none;
          border: 0px;
        }
    }
     .btns {
    display: flex;
    box-sizing: border-box;
    justify-content: flex-end;
  }
}
 /deep/.el-form-item__label  {
    text-align: left;
}
 /deep/.el-form-item .btns {
   margin-bottom: 0px !important;
 }
</style>
