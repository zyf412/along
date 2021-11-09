<template>
  <div class="container">
    <Header :myInfo = userInfo :token = mytoken @changeInfo = undateInfo></Header>

  </div>
</template>

<script>
import Header from '@/components/header/Header.vue'
export default {
  components: {
    Header
  },
  data () {
    return {
      userInfo: {
        id: '',
        username: '',
        nickname: '',
        email: '',
        user_pic: ''
      },
      mytoken: ''
    }
  },
  methods: {
    async getUserInfo () {
      const { data: res } = await this.$http.get('my/userInfo')
      if (res.status !== 0) {
        this.$router.push('/login')
      }
      this.userInfo.id = res.data.id
      this.userInfo.username = res.data.username
      this.userInfo.nickname = res.data.nickname
      this.userInfo.email = res.data.email
      this.userInfo.user_pic = res.data.user_pic
    },
    undateInfo (val) {
      if (val) {
        this.getUserInfo()
      }
    }
  },
  created () {
    this.getUserInfo()
    this.mytoken = window.sessionStorage.getItem('token')
  }
}
</script>

<style lang='less' scoped>
  .container {
    height: 100%;
    background:linear-gradient(to right,#6e56ac,#ef96af,#ff7268,#d18db6);
  }
</style>
