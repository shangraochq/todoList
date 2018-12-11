<template>
    <div>
        <el-form ref="form" label-width="100px">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="userName"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <p>{{errorMessage}}</p>
            </el-form-item>
            <el-button @click="login('login')" type="primary">登录</el-button>
            <el-button @click="login('register')" type="primary">注册</el-button>
        </el-form>
    </div>
</template>
<script lang='ts'>
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import axios from "axios";
    @Component
    export default class extends Vue {
        userName = '';
        password = '';
        errorMessage = ''
        type = "login";
        mounted () {
        }
        login(typeAg: any) {
            this.type = typeAg;
            const url = this.type === 'login' ? '/ajax/login' : '/ajax/register';;
            axios.post(url, {
                name: this.userName,
                pass: this.password,
            })
            .then((data: any) =>{
                if (data.data.retCode === 200) {
                    this.$router.push('/app');
                } else {
                    this.errorMessage = data.data.msg;
                }
            });
        }
    }
</script>
<style lang='scss' scoped>
</style>
