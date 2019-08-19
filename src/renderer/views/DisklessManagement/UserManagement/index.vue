<template>
    <div class="container">
      <Modal
        v-model="createdModel"
        :title="this.$t('createUser')"
        footer-hide
        >
        <Form ref="createdUser" :model="createdUser" :rules="ruleCreatedUser" :label-width="100" style="width: 340px">
        <FormItem prop="user" :label="this.$t('userName')">
            <Input type="text" v-model="createdUser.user" placeholder="Username" />
        </FormItem>
           <FormItem prop="sizeM" :label="this.$t('Volume')">
             <div class="wrapper">
            <Input v-model="createdUser.sizeM" placeholder="sizeM"  type="number" />
            <Select v-model="sizeMUnit" style="width:90px; margin-left:4px;">
              <Option :value="0">MB</Option>
              <Option :value="1">GB</Option>
              <Option :value="2">TB</Option>
           </Select>
           </div>
        </FormItem>
        <FormItem prop="pwd" :label="this.$t('password')">
           <Input v-model="createdUser.pwd" placeholder="password" type="password"/>
        </FormItem>
        <FormItem >
          <Button @click="handleuserCreate('createdUser')" type="primary">{{$t('Save')}}</Button>
          <Button @click="HandleCancel('createdModel','createdUser')" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
        <Modal
        v-model="modal6"
        :title="this.$t('setUserinfo')"
        footer-hide>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" style="width: 300px">
        <FormItem prop="user" :label="this.$t('userName')">
            <Input type="text" v-model="formInline.user" placeholder="Username" disabled/>
        </FormItem>
        <FormItem prop="usedM" :label="this.$t('usedVolume') + '(MB)'">
            <Input disabled v-model="formInline.usedM" placeholder="usedM" type="number" />
        </FormItem>
        <FormItem prop="sizeM" :label="this.$t('Volume') + '(MB)'">
          <div class="wrapper1">
            <Input v-model.lazy="formInline.sizeM" placeholder="usedM" type="number" @on-focus="Handlefocus()"/>
           </div>
        </FormItem>
        <FormItem >
          <Button class="mr8" @click="HandleSave('formInline')"  type="primary">{{$t('Save')}}</Button>
          <Button @click="modal6 = false;" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="passwordModel"
        :title="this.$t('changePassword')"
        @on-visible-change="visibleChange"
        footer-hide
        >
        <Form ref="PasswordInfo" :model="PasswordInfo" :rules="rulesPasswordInfo" :label-width="100" style="width: 300px">
        <FormItem prop="password" :label="this.$t('password')">
            <Input type="password" v-model="PasswordInfo.password" :placeholder="this.$t('password')"/>
        </FormItem>
        <FormItem prop="Confirmpassword" :label="this.$t('cofirmPassword')">
            <Input type="password" v-model="PasswordInfo.Confirmpassword" :placeholder="this.$t('cofirmPassword')" :disabled="!PasswordInfo.password"/>
        </FormItem>
        <FormItem >
          <Button class="mr8" @click="HandleChangePasswordSave" type="primary" >{{$t('Save')}}</Button>
          <Button @click="HandleCancel('passwordModel','PasswordInfo')" >{{$t('cancelText')}}</Button>
        </FormItem>
    </Form>
    </Modal>
        <div class="del">
           <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('pleaseUserName')" style="width: 200px;" :data="vdata" @on-change='ChangeValue' />
         <Button class="mr8" @click="handleRefresh" type='info' >{{$t('Refresh')}}</Button>
         <Button class="mr8" @click="createdModel = true" type="primary" >{{$t('Create')}}</Button>
         <Button @click="handleDeleteAll" type='error' >{{$t('Delete')}}</Button>
         <!-- <Button @click="handleDeleteAllUser" type='error' style=" float:right;">{{$t('删除全部用户')}}</Button> -->
        </div>
        <div ref="viewTable" class="box">
         <Table   :columns="userListColumns" :data="userList" @on-selection-change='handleSelect' border :loading="loading" @on-select-all="selectAll" @on-select-all-cancel='CancelselectAll' @on-select="OnSelect" @on-select-cancel="OnCancelSelect"></Table>
            <div ref='divScroll' id="divScroll" ></div>
        </div>
        <span class="f">{{this.list.length}}</span>
       <Row style="margin-top:10px; ">
      <!-- <Col span="24"><Page @on-page-size-change="test" :total="this.pageInfo.count"  :page-size="this.Pagelimit" @on-change="handleGetTableList" show-sizer :page-size-opts="PageSize" show-total style=" float:right;"/></Col> -->
    </Row>
    </div>
</template>



<script>
import { userList, userDelete, userSet, userCreate } from '@/api/wupan'
import { CreateAt, OnScroll } from '@/utils/index'
export default {
  name: 'user',
  data () {
    var checkpassword = (rule, value, callback) => {
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
    var checksizeM = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('Thisfieldcannotbeempty')))
      } else {
        if (parseInt(value) >= this.formInline.usedM) {
          callback()
        } else {
          return callback(new Error(this.$t('不能小于已用空间')))
        }
      }
    }
    var checkUserRelp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('Thisfieldcannotbeempty')))
      } else {
        if (this.userListv.has(value)) {
          return callback(new Error(this.$t('UserNoReap')))
        } else {
          callback()
        }
      }
    }
    return {
      masterip: localStorage.getItem('masterip') || '',
      oldValue: '', // 编辑时，新值不能不原来的值小
      loading: false,
      list: [],
      createdModel: false,
      selectData: [],
      modal6: false,
      passwordModel: false,
      optData: [],
      vdata: [], // 搜索的数据
      sizeMUnit: 0,
      Pagelimit: 13,
      PageSize: [13, 20, 30, 100],
      pageInfo: {
        count: 0,
        page_index: 1
      },
      start: 0,
      index: 0,
      limit: 13,
      end: '',
      confirm: '',
      formInline: {
        user: '',
        usedM: '',
        sizeM: ''
      },
      createdUser: {
        user: '',
        pwd: '',
        sizeM: ''
      },
      ruleCreatedUser: {
        user: [{ required: true, validator: checkUserRelp, trigger: 'change' }],
        pwd: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
        sizeM: [
          { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }
        ]
      },
      ruleInline: {
        user: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
        usedM: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
        sizeM: [
          { required: true, validator: checksizeM, trigger: 'change' }
        ]
      },
      PasswordInfo: {
        password: '',
        Confirmpassword: ''
      },
      rulesPasswordInfo: {
        password: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
        Confirmpassword: [{ required: true, validator: checkpassword, trigger: 'change' }]
      },
      userList: [],
      userListv: [],
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
          // render: (h, params) => {
          //   return h('Button', {
          //     props: { trigger: 'contextMenu' }
          //   })
          // }
        },
        {
          title: '个人磁盘',
          key: 'sizeM',
          width: 260,
          render: (h, params) => {
            let per = Math.round((params.row.usedM / params.row.sizeM) * 100) < 100 ? Math.round((params.row.usedM / params.row.sizeM) * 100) : 100
            let a = null
            if (per >= 90) {
              a = h('Progress', {
                props: { percent: per, 'stroke-width': 13, 'stroke-color': '#DA2626', 'hide-info': true },
                style: { paddingBottom: '3px' },
                slot: '<span>123</span>'
              })
            } else {
              a = h('Progress', {
                props: { percent: per, 'stroke-width': 13, 'stroke-color': '#26A0DA', 'hide-info': true },
                style: { paddingBottom: '3px' },
                slot: '<span>123</span>'
              })
            }
            let b = h('span', {
              style: { paddingTop: '20px' }
            }, `${this.$t('usedVolume')} ${this.byToSize(params.row.usedM)}，`)
            let c = h('span', {
            }, `${this.$t('Volume')}  ${this.byToSize(params.row.sizeM)}`)
            return [a, b, c]
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let a = h('Button', {
              props: { type: 'primary' },
              style: { marginRight: '10px' },
              on: {
                click: () => {
                  this.usedM = '0'
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
  mounted () {
    this.$refs.viewTable.addEventListener('mousewheel', (e) => {
      let offset = 0
      if (e.deltaY < 0) {
        this.bar.scrollTop -= 48
        // offset = -48
        // if (this.limit > this.Pagelimit) {
        //   this.start -= 1
        //   this.limit = this.limit - 1
        //   this.userList = this.list.slice(this.start, this.limit)
        // }
      } else {
        this.bar.scrollTop += 48
        // if (this.limit < this.list.length) {
        //   offset = 48
        //   this.start += 1
        //   this.limit = this.limit + 1
        //   this.userList = this.list.slice(this.start, this.limit)
        // }
      }
      OnScroll.call(this, this.$refs.divScroll, offset)
    }, true)
    this.$refs.divScroll.addEventListener('scroll', (e) => {
      this.userList = this.list.slice(parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + 13)
    }, true)
  },
  methods: {
    /**
     * 选择某一个
     */
    OnSelect (data) {
      this.list.forEach(item => {
        data.forEach(itemx => {
          if (item.name === itemx.name && item.usedM === itemx.usedM) {
            item._checked = true
          }
        })
      })
    },
    /**
     * 选择某一个取消
     */
    OnCancelSelect (data, row) {
      this.list.forEach(item => {
        if (item.name === row.name && item.usedM === row.usedM) {
          delete item._checked
        }
      })
    },
    /**
     * 取消全部
     */
    CancelselectAll () {
      this.list.forEach(item => {
        delete item._checked
      })
      console.log(this.list)
    },
    /**
     * 选择全部全部
    */
    selectAll (e) {
      this.list.forEach(item => {
        item._checked = true
      })
    },
    test (v) {
      this.Pagelimit = v
      this.handleGetUserList(this.masterip)
    },
    ChangeValue (e) {
      this.vdata = []
      if (!e) {
        this.handleGetUserList(this.masterip)
      }
      let data = this.list.filter(item => {
        if (item.name.indexOf(e) !== -1) {
          if (data && data.length !== 0) {
            if (this.vdata.length < 10) {
              this.vdata.push(item.name)
            }
          } else {
            if (this.vdata.length < 10) {
              this.vdata.push(item.name)
            }
          }
        }
        return e === item.name
      })
      if (data) {
        this.pageInfo.count = data.length
        this.userList = data
      }
    },
    handleGetTableList (index) {
      this.pageInfo.page_index = index
      this.userList = this.list.slice((index - 1) * this.Pagelimit, (index - 1) * this.Pagelimit + this.Pagelimit)
    },

    visibleChange (v) {
      if (!v) {
        this.$refs['PasswordInfo'].resetFields()
      }
    },
    handleRefresh () {
      this.selectData = []
      this.loading = true
      this.handleGetUserList(this.masterip)
    },
    /**
        创建用户
      */
    handleuserCreate (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let sizeM
          if (this.sizeMUnit === 1) {
            sizeM = this.createdUser.sizeM * 1024
          } else if (this.sizeMUnit === 2) {
            sizeM = this.createdUser.sizeM *= 1048576
          } else if (this.sizeMUnit === 0) {
            sizeM = this.createdUser.sizeM
          }
          let info = {
            'name': this.createdUser.user,
            'pwd': this.createdUser.pwd,
            'sizeM': sizeM + ''
          }
          userCreate(info, this.masterip).then(resp => {
            this.$refs['createdUser'].resetFields()
            this.handleGetUserList(this.masterip)
            this.createdModel = false
          })
        }
      })
    },
    /**
        获取用户信息
      */
    handleGetUserList (ip) {
      this.loading = true
      if (!ip) return
      userList(ip).then(resp => {
        this.list = resp.data.result.list || []
        CreateAt.call(this, this.$refs.divScroll, this.list.length * 48)
        this.pageInfo.count = this.list.length
        // this.userList = this.list
        this.userList = this.list.slice((this.pageInfo.page_index - 1) * this.Pagelimit, ((this.pageInfo.page_index - 1) * this.Pagelimit) + this.Pagelimit)
        this.loading = false
        this.userListv = new Set()
        this.list.forEach(item => {
          this.userListv.add(item.name)
        })
        this.loading = false
        console.log(this.userListv)
      }, (error) => {
        this.loading = false
        this.$Message.error({
          content: this.$t(`kxLinuxErr.${error.data.error}`)
        })
      }).catch(r => {
        console.log(r)
      })
    },
    /**
      编辑用户信息
    */
    HandleSave (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let info = {
            name: this.formInline.user,
            sizeM: this.formInline.sizeM + ''
          }
          userSet(info, this.masterip).then(resp => {
            console.log(this.userList)
            this.handleGetUserList(this.masterip)
            this.modal6 = false
          }).catch((e) => {
            console.log(e)
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
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: `${this.$t('Delete')} 【${data.name}】 ${this.$t('User')} `,
        onOk: () => {
          userDelete(userList, this.masterip).then((resp) => {
            this.handleGetUserList(this.masterip)
          })
        }
      })
    },
    /**
        获取用户信息
    */
    handleSelect (data) {
      if (data.length === 0) return
      this.selectData = []
      this.selectData = this.list.filter(item => {
        return item._checked
      })
      let selectDataName = []
      this.selectData.forEach(item => {
        selectDataName.push(item.name)
      })
      this.selectData = selectDataName
      console.log(selectDataName)
    },
    /**
        删除用户信息
    */
    handleDeleteAll () {
      if (this.selectData.length > 0) {
        this.$Modal.confirm({
          title: this.$t('DeleteTip'),
          content: `${this.$t('Delete')} 【${this.selectData.length > 3 ? this.selectData.slice(0, 3) + '...' : this.selectData}】 ${this.$t('User')} `,
          onOk: () => {
            userDelete(this.selectData, this.masterip).then((resp) => {
              this.handleGetUserList(this.masterip)
            })
          },
          onCancel: () => {
            this.selectData = []
            this.list.forEach(item => {
              this.selectData.forEach(itemx => {
                if (item.name === itemx.name && item.usedM === itemx.usedM) {
                  delete item._checked
                }
              })
            })
            this.handleGetUserList(this.masterip)
          }
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
        user: data.name,
        usedM: data.usedM,
        sizeM: data.sizeM
      }
      this.modal6 = true
    },

    /**
        修改密码
    */
    HandleChangePasswordSave () {
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
            console.log(this)
          })
        }
      })
    },
    HandleCancel (Modal, name) {
      this[Modal] = false
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style >
    .del {
        margin-bottom: 10px;
    }
    .del > button{
        margin-right: 10px;
    }
    .wrapper{
      display: flex;
      justify-content: space-between;
    }
    .mr8{
      margin-right:8px;
    }
    .box{
      display: flex;
    }
  #divScroll{
    margin-top:42px;
    position: relative;
    right: 20px;
  }

</style>



