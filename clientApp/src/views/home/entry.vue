<template>
    <div class="home">
        <p class="top">
            <span v-if="userName">{{userName}}</span>
        </p>
        <div class="body">
            <div class="sidebar">
                <p :class="type === 'collection' ? 'active' : ''" @click="changeType('collection')">收集箱</p>
                <p :class="type === 'today' ? 'active' : ''" @click="changeType('today')">今日待办</p>
                <p :class="type === 'tomorrow' ? 'active' : ''" @click="changeType('tomorrow')">明日待办</p>
                <p :class="type === 'next' ? 'active' : ''" @click="changeType('next')">下一步行动</p>
                <p :class="type === 'future' ? 'active' : ''" @click="changeType('future')">将来/也许</p>
            </div>
            <div class="content">
                <input v-on:keyup.enter="addTodo"
                    placeholder="按回车添加"
                    v-model="content"
                    class="input"
                >
                <div class="todolist">
                    <p v-for="todo in todoList" :key="todo.id" class="todo">
                        {{todo.content}}
                    </p>
                </div>
            </div>
        </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component({
})
export default class Home extends Vue {
    userName = "";
    content = "";
    todoList: any[] = [];
    type = "today";
    mounted () {
        axios.get('/ajax/getUserInfo')
        .then((data: any) => {
            this.userName = data.data.name;
            if (!this.userName) {
                this.$router.push('/app/login');
            }
        });
        this.getTodoList();
    }
    getTodoList() {
        axios.get('/ajax/getToDoList', {
            params: {
                type: this.type,
            }
        })
        .then((data: any) => {
            this.todoList = data.data.data.todoList;
        })
    }
    toLogin() {
        this.$router.push('/app/login?type=login');
    }
    toRegister() {
        this.$router.push('/app/login?type=register');
    }
    addTodo() {
        axios.post('/ajax/addTodo', {
            content: this.content,
            type: this.type,
        })
        .then((data: any) => {
            this.todoList.push(data.data.data.todo);
            this.content = '';
        });
    }
    changeType(type: any) {
        if (this.type === type) {
            return;
        }
        this.type = type;
        this.getTodoList();
    }
}
</script>

<style lang='scss' scoped>
    .home {
        position: relative;
        height: 100%;
    }
    .top {
        position: fixed;
        width: 100%;
        height: 40px;
        padding: 8px 0;
        padding-left: 20px;
        left: 0;
        top: 0;
        background: linear-gradient(to right, #819dc1 , #2d4b72);
        display: flex;
        align-items: center;
        color: #fff;
        z-index: 10;
    }
    .sidebar {
        width: 200px;
        height: 100%;
        float: left;
        padding-top: 10px;
        background-color: #eee;
        p {
            padding: 10px 0;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            font-size: 14px;
        }
        p:hover {
            background-color: #ddd;
        }
        .active {
            border-left: 5px solid #819dc1;
        }
    }
    .body {
        margin-top: 56px;
        height: 100%;
        display: flex;
    }
    .content {
        float: right;
        height: 100%;
        flex: auto;
    }
    .input {
        width: 90%;
        height: 32px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        outline: 0 none;
        margin: 20px 10px 0 20px;
        padding: 0 10px;
    }
    .todolist {
        width: 95%;
        margin-top: 30px;
    }
    .todo {
        border-bottom: 1px solid #ddd;
        border-left: 5px solid #ddd;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        margin-left: 20px;
    }
    .todo:hover {
        background-color: #eee;
    }
</style>
