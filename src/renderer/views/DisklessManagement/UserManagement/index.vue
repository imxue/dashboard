<template>
    <div class="container">
      <Modal
        v-model="createdModel"
        :title="this.$t('createUser')"
        footer-hide
        >
        <Form ref="createdUser" :model="createdUser" :rules="createdUser" :label-width="100">
        <FormItem prop="user" :label="this.$t('userName')">
            <Input type="text" v-model="createdUser.name" placeholder="Username" />
        </FormItem>
        <FormItem prop="sizeM" :label="this.$t('password')">
            <Input v-model="createdUser.pwd" placeholder="usedM" />
        </FormItem>
        <FormItem prop="usedM" :label="this.$t('Volume') + '(MB)'">
            <Input v-model="createdUser.sizeM" placeholder="usedM" />
     
        </FormItem>
        
        <FormItem >
          <Button @click="handleuserCreate">{{$t('Save')}}</Button>
          <Button @click="createdModel = false" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
        <Modal
        v-model="modal6"
        :title="this.$t('setUserinfo')"
        footer-hide
        >
        <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <FormItem prop="user" :label="this.$t('userName')">
            <Input type="text" v-model="formInline.name" placeholder="Username" />
        </FormItem>
        <FormItem prop="usedM" :label="this.$t('Volume') + '(*m)'">
            <Input  v-model="formInline.sizeM" placeholder="usedM" />
     
        </FormItem>
        <FormItem prop="sizeM" :label="this.$t('usedVolume') + '(*m)'">
            <Input disabled v-model="formInline.usedM" placeholder="usedM" />
        </FormItem>
        <FormItem >
          <Button @click="HandleSave" >{{$t('Save')}}</Button>
          <Button @click="modal6 = false" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="passwordModel"
        :title="this.$t('changePassword')"
        footer-hide
        >
        <Form ref="PasswordInfo" :model="PasswordInfo" :rules="rulesPasswordInfo" :label-width="100">
        <FormItem prop="password" :label="this.$t('password')">
            <Input type="text" v-model="PasswordInfo.password" :placeholder="this.$t('password')"/>
        </FormItem>
        <FormItem prop="Confirmpassword" :label="this.$t('cofirmPassword')">
            <Input v-model="PasswordInfo.Confirmpassword" :placeholder="this.$t('cofirmPassword')"/>
        </FormItem>
        <FormItem >
          <Button @click="HandleChangePasswordSave" >{{$t('Save')}}</Button>
          <Button @click="passwordModel = false" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
        <div class="del">
         <Button @click="createdModel = true" type='info' >{{$t('Create')}}</Button>
         <Button @click="handleDeleteAll" type='error' >{{$t('Delete')}}</Button>
        </div>
         <Table :columns="userListColumns" :data="userList" @on-selection-change='handleSelect' border></Table>
    </div>
</template>



<script>
import { userList, userDelete, userSet, userCreate } from '@/api/wupan'
// import { userCreate, userSet, userDelete, userList } from '@/api/wupan'
export default {
  name: 'user',
  data () {
    var checkpassword = (rule, value, callback) => {
      if (!this.PasswordInfo.password) { return callback(new Error(this.$t('Thisfieldcannotbeempty'))) }
      if (!value) {
        return callback(new Error(this.$t('Thisfieldcannotbeempty')))
      } else {
        if (value === this.PasswordInfo.password) {
          callback()
        } else {
          return callback(new Error(this.$t('passwordError')))
        }
      }
    }
    return {
      masterip: this.$store.state.app.masterip || '',
      createdModel: false,
      selectData: [],
      modal6: false,
      passwordModel: false,
      optData: [],
      formInline: {
        name: '',
        usedM: '',
        sizeM: ''
      },
      createdUser: {
        name: '',
        pwd: '',
        sizeM: ''
      },
      PasswordInfo: {
        password: '',
        Confirmpassword: ''
      },
      rulesPasswordInfo: {
        password: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        Confirmpassword: [{ required: true, validator: checkpassword, trigger: 'blur' }]
      },
      ruleInline: {},
      userList: [],
      userListColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('userName')) },
          key: 'name',
          width: 150
        },
        {
          title: '个人磁盘',
          key: 'sizeM',
          width: 250,
          render: (h, params) => {
            let a = h('Progress', {
              props: { percent: (params.row.usedM / params.row.sizeM) * 100, 'stroke-width': 13, 'hide-info': true },
              style: { paddingBottom: '3px' }
            })
            let b = h('span', {
              style: { paddingTop: '20px' }
            }, `已使用 ${params.row.usedM} MB，`)
            let c = h('span', {

            }, `总容量 ${params.row.sizeM} MB`)
            return [a, b, c]
          }
        },
        // {
        //   align: 'center',
        //   renderHeader: (h, params) => { return h('span', this.$t('usedVolume')) },
        //   key: 'usedM'
        // },
        {
          renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let a = h('Button', {
              props: { type: 'primary' },
              style: { marginRight: '10px' },
              on: {
                click: () => {
                  this.handleSeeDetail(params.row)
                }
              }
            }, this.$t('Edit'))
            let b = h('Button', {
              props: { type: 'info' },
              style: { marginRight: '10px' },
              on: {
                click: () => {
                  this.optData = params.row
                  this.passwordModel = true
                }
              }
            }, this.$t('changePassword'))
            let c = h('Button', {
              props: { type: 'error' },
              on: {
                click: () => {
                  this.handleDelete(params.row)
                }
              }
            }, this.$t('Delete'))
            return [a, b, c]
          }
        }
      ]
    }
  },
  created () {
    this.handleGetUserList(this.masterip)
  },
  methods: {
    /**
        创建用户
      */
    handleuserCreate () {
      let info = {
        'name': this.createdUser.name,
        'pwd': this.createdUser.pwd,
        'sizeM': this.createdUser.sizeM
      }
      userCreate(info, this.masterip).then(resp => {
        this.handleGetUserList(this.masterip)
        this.createdModel = false
      })
    },
    /**
        获取用户信息
      */
    handleGetUserList (ip) {
      userList(ip).then(resp => {
        this.userList = resp.data.result.list || []
      })
    },
    /**
      编辑用户信息
    */
    HandleSave () {
      let _this = this
      this.$refs['formInline'].validate(valid => {
        if (valid) {
          let info = {
            name: this.formInline.name,
            sizeM: this.formInline.sizeM
          }
          userSet(info, this.masterip).then(resp => {
            this.handleGetUserList(this.masterip)
            this.modal6 = false
          }).catch((e) => {
            _this.notifyUserOfError(e)
            console.log(this)
          })
        }
      })
    },
    /**
        删除用户
    */
    handleDelete (data) {
      let userList = []
      userList.push(data.name)
      userDelete(userList, this.masterip).then((resp) => {
        this.handleGetUserList(this.masterip)
      })
    },
    /**
        获取用户信息
    */
    handleSelect (data) {
      this.selectData = []
      if (data.length === 0) { return 0 }
      let selectDataName = []
      data.forEach(item => {
        selectDataName.push(item.name)
      })
      this.selectData = selectDataName
      return 1
    },
    /**
        删除用户信息
    */
    handleDeleteAll () {
      if (this.selectData.length > 0) {
        userDelete(this.selectData, this.masterip).then(() => {
          this.handleGetUserList(this.masterip)
        })
      } else {
        console.log(this.selectData)
      }
    },
    /**
    编辑用户信息
     */
    handleSeeDetail (data) {
      this.formInline = {
        name: data.name,
        usedM: data.usedM,
        sizeM: data.sizeM
      }
      this.modal6 = true
    },

    /**
        修改密码
    */
    HandleChangePasswordSave () {
      let _this = this
      this.$refs['PasswordInfo'].validate(valid => {
        if (valid) {
          let info = {
            name: this.optData.name,
            pwd: this.PasswordInfo.Confirmpassword,
            sizeM: this.optData.sizeM
          }
          userSet(info, this.masterip).then(resp => {
            this.passwordModel = false
          }).catch((e) => {
            _this.notifyUserOfError(e)
            console.log(this)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
    .del {
        margin-bottom: 10px;
    }
    .del > button{
        margin-right: 10px;
    }
</style>



