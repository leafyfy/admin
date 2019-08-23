<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
          :collapse="isShow"
          :default-active="'1-1'"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="indexs+''" v-for="(items,indexs) in menuList" :key="indexs">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{items.authName}}</span>
            </template>
            <el-menu-item
              :index="'/home/'+index.path"
              v-for="(item,index) in items.children"
              :key="index"
            >
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="myicon myicon-menu toggle-btn" @click="isShow=!isShow"></span>
          <span class="system-title">电商后台管理系统</span>
          <a href="javascript:;" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { perm } from '@/api/permissions'
export default {
  data () {
    return {
      isShow: true,
      menuList: []
    }
  },
  mounted () {
    perm()
      .then(res => {
        // console.log(res)
        this.menuList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu {
    width: auto;
  }
  // 如果是展开状态,那么宽度就是200px,如果是合并状态,宽度:auto
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
