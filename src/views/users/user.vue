<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和按钮 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right: 10px;"
        v-model="userobj.query"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        style="left:10px"
        placeholder
        @click="addDialogVisible=true"
      >添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:10px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="modify_time" label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="Monmouth(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditor(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="showDelete(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加提示" :visible.sync="addDialogVisible">
      <el-form :model="addUsers" :label-width="'80px'" :rules="rules" ref="addUsers">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsers.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsers.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUsers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adds">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑提示" :visible.sync="editorDialogVisible">
      <el-form :model="editorUsers" :label-width="'80px'" :rules="rules" ref="editorUsers">
        <el-form-item label="用户名">
          <el-input v-model="editorUsers.username" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editorUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editorUsers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editor">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限提示" :visible.sync="roleDialogVisible">
      <el-form :model="roleUser" :label-width="'80px'" :rules="rules" ref="editorUsers">
        <el-form-item label="用户名:">
          <span>{{roleUser.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="roleList.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  gitUsrt,
  addUser,
  editorUser,
  Assign,
  augburto,
  userDisplay
} from '@/api/user_index'
import { roleGrid } from '@/api/role_index'

export default {
  data () {
    return {
      // 角色数据
      roleDialogVisible: false,
      roleList: [],
      roleUser: {
        id: '',
        rid: 1,
        username: ''
      },
      // 编辑用户
      editorDialogVisible: false,
      editorUsers: {
        id: 1,
        email: '',
        mobile: '',
        username: ''
      },
      // 添加用户
      addDialogVisible: false,
      addUsers: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户数据列表
      userList: [],
      total: 0,
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 用户权限状态
      status: true
    }
  },
  mounted () {
    this.init()
    // 角色列表
    roleGrid()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    // 修改用户状态
    Monmouth (id, type) {
      // console.log(id, type)
      userDisplay(id, type)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('修改成功')
            this.init()
          }
        })
        .catch(() => {
          this.$message.success('修改失败')
        })
    },
    // 删除用户
    showDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          augburto(id)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success('删除成功')
                this.init()
              }
            })
            .catch(() => {
              this.$message.success('删除失败')
            })
        })
        .catch(() => {
          this.$message.info('删除用户失败')
        })
    },
    // 分配权限
    roles () {
      // console.log(this.roleUser)
      if (this.roleUser.rid) {
        // 获取角色数据
        Assign(this.roleUser)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.roleDialogVisible = false
              this.init()
              this.$message.success('成功分配权限')
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message.success('分配权限失败')
        return false
      }
    },
    // 显示分配角色对话框
    showRole (row) {
      // console.log(row)
      this.roleDialogVisible = true
      this.roleUser.username = row.username
      this.roleUser.id = row.id
      this.roleUser.rid = row.role_id
    },
    // 显示编辑用户对话框
    showEditor (row) {
      this.editorDialogVisible = true
      this.editorUsers.id = row.id
      this.editorUsers.username = row.username
      this.editorUsers.email = row.email
      this.editorUsers.mobile = row.mobile
    },
    // 编辑用户
    editor () {
      this.$refs.editorUsers.validate(valid => {
        if (valid) {
          editorUser(this.editorUsers)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                // 点击确定后隐藏
                this.editorDialogVisible = false
                // 刷新
                this.init()
                this.$message.success('编辑用户成功')
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message.success('编辑用户失败')
          return false
        }
      })
    },
    // 添加用户
    adds () {
      this.$refs.addUsers.validate(valid => {
        if (valid) {
          addUser(this.addUsers)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('添加用户成功')
                // 添加完成后隐藏
                this.addDialogVisible = false
                // 重置表单
                this.$refs.addUsers.resetFields()
                // 刷新
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message.success('添加用户失败')
          return false
        }
      })
    },
    // 每页条数
    handleSizeChange (val) {
      this.userobj.pagesize = val
      this.init()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.userobj.pagenum = val
      this.init()
    },
    // 获取数据
    init () {
      gitUsrt(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
