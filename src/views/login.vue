<template>
  <div class="login">
    <p class="wh b title">北京市过街天桥可视化养护管理平台</p>
    <el-card class="box-card">
      <p class="f20 mb20">用户登录</p>
      <el-form label-position="left" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="password"
            @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === '666666') {
        sessionStorage.setItem('isLogin', '1');
        this.$router.push('/');
      } else {
        this.$message({
          message: '请输入正确的用户名和密码',
          type: 'error',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(~@/assets/images/bg.png);
  width: 100%;
  height: 100%;
  background-size: cover;
}
.box-card {
  width: 400px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
}
.title {
  margin-bottom: 80px;
  font-size: 60px;
  text-shadow: 5px 5px 2px black;
}
</style>
