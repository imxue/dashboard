<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonFilter">硬件筛选</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
      <Button type="primary" class="topColumn" @click="handleButtonEdit">批量编辑</Button>
      <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonImport">导入</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonRemove">移动至方案</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAwaken">唤醒</Button>
      <Button type="primary" class="topColumn" @click="handleButtonShutdown">关机</Button>
      <Button type="primary" class="topColumn" @click="handleButtonReStart">重启</Button>
    </div>
        <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-select="handleGetTableRowInfo" @on-select-cancel="handleRemoveTableRowInfo"></Table>
    <Row style="margin-top:10px; ">
      <!-- <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col> -->
      <Page v-if="tableListPage" :current="currentPage"   :page-size="pageSize" :total="totalPageNumber"  show-total style=" float:right;" @on-change="hanbleChangePage"/>
    </Row>
    <!-- 删除提示 -->
        <Modal
        v-model="showDeleteBox"
        title="删除提示"
        @on-ok="handleConfirmDelete"
        @on-cancel="handleCancel">
        <p>是否删除当前数据？</p>
    </Modal>
    <!-- 移动至方案 -->
    <Modal
      class="modalBox"
      title="移动至方案"
      v-model="showPopup"
      width= "500"
      class-name="vertical-center-modal">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="移动至方案：" prop="nameVal">
            <Select v-model="formValidate.nameVal" placeholder="默认当前(方案)">
                <Option  v-for="item in nameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getClientList, deleteClient, changeSchema } from '@/api/client'
  import { getPcListConfigx } from '@/api/wupan'
import Cookies from 'js-cookie'
  export default {
    name: 'subType1-1',
    data () {
      return {
        popupVal: '',
        curroffset: 0,
        currlimit: 5,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        tableListPage: true,
        showPopup: false,
        showDeleteBox: false,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableData: [],
        tableDataList: [], // 批量编辑时，传值到下一页
        tableColumns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '状态', key: 'stat' },
          { title: '客户机IP', key: 'ip' },
          { title: '客户机MAC', key: 'mac' },
          { title: '配置方案', key: 'pcGp' }
        ],
        nameList: [
          { Id: 1, value: '大厅A001', label: '大厅A001-A050' },
          { Id: 2, value: '大厅A002', label: '大厅A002-A050' },
          { Id: 3, value: '大厅A003', label: '大厅A003-A050' }
        ],
        formValidate: { nameVal: '' },
        ruleValidate: { nameVal: [{ required: true, message: '请至少选择一个', trigger: 'change' }] }
      }
    },
    created () {
      // this.handleGetClientList(this.curroffset, this.currlimit)
      this.handgetClienList()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handgetClienList () {
        if (Cookies.get('masterip')) {
          let ip = Cookies.get('masterip')
          getPcListConfigx(ip).then((response) => {
            this.tableData = response.data.result.list
          })
        }
      },
      handleRemoveTableRowInfo (data) {
        this.handleFormatArr(data)
      },
      handleGetTableRowInfo (data) {
        this.handleFormatArr(data)
      },
      handleFormatArr (data) {
        var list = []
        for (var i in data) {
          list.push({
            ActiveDns: data[i].ActiveDns,
            BackupDns: data[i].BackupDns,
            Enable: data[i].Enable,
            Gateway: data[i].Gateway,
            Id: data[i].Id,
            Ip: data[i].Ip,
            StartSchema: data[i].StartSchema,
            Subnet: data[i].Subnet
          })
        }
        this.tableDataList = list
        // console.log(JSON.stringify(this.tableDataList))
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleGetClientList (offset, limit) {
        var listQuery = '?offset=' + offset + '&limit=' + limit
        getClientList(listQuery).then((a) => {
          var datalist = a.data.Data.List
          if (a.data.Code === 0) {
            if (datalist === null) {
              this.data = null
            } else {
              this.tableData = a.data.Data.List
              this.totalPageNumber = Number(a.data.Data.TotalCount)
              this.currentPage = Number(a.data.Data.PageNo)
              this.pageSize = Number(a.data.Data.PageSize)
            }
          } else {
            this.$Message.error(a.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      hanbleChangePage (num) {
        if (num === 1) {
          num = 0
        } else {
          num = (this.currlimit * num) - this.currlimit
        }
        this.handleGetClientList(num, this.currlimit)
      },
      handleCheckBoxNumber (name) {
        var val = this.getCheckboxVal.length
        if (val === 0 || val > 1) {
          this.$Message.error('请选择列表中的一项')
        } else {
          this.handlePostData(name)
        }
      },
      handlePostData (name) {
        if (name === 'del') {
          this.showDeleteBox = true // show删除提示
        }
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list.join(',')
        return this.getCheckboxVal
      },
      handleButtonFilter (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.info('筛选成功……')
        }
      },
      handleButtonAdd (val) {
        this.$router.push({ path: 'subtype1-add' })
      },
      handleButtonEdit (val) {
        // alert(JSON.stringify(this.tableDataList))
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype1-add',
            query: { dataList: this.tableDataList }
          })
        }
      },
      handleConfirmDelete () {
        deleteClient(this.getCheckboxVal).then((res) => {
          // console.log('res:' + JSON.stringify(res))
          this.$Message.success('操作成功')
          this.handleGetClientList()
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleButtonDelete (del) {
        var name = 'del'
        this.handleCheckBoxNumber(name)
      },
      handleCancel () {
        this.showDeleteBox = false
      },
      handleButtonImport () {},
      handleButtonRemove (name) {
        var val = this.getCheckboxVal.length
        if (val === 0 || val > 1) {
          this.$Message.error('请选择列表中的一项')
        } else {
          this.showPopup = true
        }
      },
      handleButtonRemovePost () {
        var currId = this.getCheckboxVal
        var self = this
        this.$refs[name].validate((valid) => {
          if (valid) { // this.$Message.success('表单验证成功!')
            deleteClient(currId).then((res) => {
              self.handleCallBackVaild(res)
            }, () => {
              this.$Message.error('请求出错，请稍后再试')
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      handleButtonAwaken () {},
      handleButtonShutdown () {},
      handleButtonReStart () {},
      handleTableEdit (index) {
        // alert(JSON.stringify(index))
        this.$router.push({
          path: 'subtype1-add',
          query: { data: index }
        })
      },
      handleTableRemove (index) {
        this.showPopup = true
      },
      handleSubmit (name) {
        var self = this
        this.$refs[name].validate((valid) => {
          if (valid) { // this.$Message.success('表单验证成功!')
            changeSchema(this.getCheckboxVal, this.formValidate.nameVal).then((res) => {
              self.handleCallBackVaild(res)
            }, () => {
              this.$Message.error('请求出错，请稍后再试')
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.showPopup = false
      }
    }
  }
</script>

<style scoped>
</style>
