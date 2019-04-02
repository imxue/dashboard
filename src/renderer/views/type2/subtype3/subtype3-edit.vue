<template>
  <div style="margin-top:20px;">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <Row>
          <i-col span="10" offset="2">
     
          <FormItem prop="name" label="方案名称：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.name" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="netMk"  label="子网淹码：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.netMk" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="netGW"  label="子网淹码：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.netGW" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="dns1"  label="首选dns：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.dns1" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="dns2" label="备用dns：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.dns2" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="daSV" label="数据服务器：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.daSV" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="bala"  label="负载均衡：">
          <Row>
            <i-col span="10">
              <Select v-model="formValidate.bala">
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="disable" label="启用状态：">
          <Row>
            <i-col span="10">
              <Select v-model="formValidate.disable">
                 <Option value="1">启用</Option>
                <Option value="0">禁用</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
      </i-col>
      <i-col span="10">
        <FormItem prop="wrLimG"  label="回写总量限制：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.wrLimG" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="gTim"  label="方案切换等待：">
          <Row>
            <i-col span="16"><i-input v-model="formValidate.gTim" placeholder="" style="width:80px;"></i-input>&nbsp;&nbsp;秒，后启动默认方案，单镜像单配置时无需等待。
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="cach" label="缓存大小：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.cach" placeholder=""  style="width:120px;"></i-input>&nbsp;&nbsp; * 单位M</i-col>
          </Row>
        </FormItem>
        <FormItem prop="wieh" label="分辨率宽：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.wieh" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="hith" label="分辨率高：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.hith" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="resh" label="刷新率：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.resh" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="deps" label="色彩：">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.deps" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>

        </i-col>
        </Row>
        <!-- <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
        </FormItem> -->
    </Form>
    <Row style="margin-bottom:20px;">
      <!-- <Divider /> -->
      <Button type="primary"  @click="handleButtonAdd">添加镜像</Button>
    </Row>
    <Table border :columns="tableColumns1" :data="tableData1"></Table>
    <Modal
      title="添加镜像"
      v-model="showPopup"
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
        <FormItem label="镜像名称:" prop="schemeName">
          <Select v-model="formValidate2.schemeName" @on-change="handleSelectImageValue" clearable style="width:200px;" placeholder="---请选择镜像---">
            <Option v-for="item in imageList" :value="item.name" :key="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置名称:" prop="configName">
          <Select v-model="formValidate2.configName" clearable style="width:200px;" placeholder="---请选择配置名称---">
            <Option v-for="item in imageProList" :value="item.name" :key="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleAddProject('formValidate2')">添加</Button>
            <Button @click="handleImageReset('formValidate2')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <div class="buttonList" style="margin-top: 20px">
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
    </div>
  </div>
</template>

<script>
  import { getImageList, editPcGroup } from '@/api/wupan'
  export default {
    name: 'subType3-edit',
    data () {
      return {
        imgCount: 0,
        showPopup: false,
        name01: '',
        name02: '',
        tableColumns1: [
          { title: '镜像名称', key: 'img' },
          { title: '配置名称', key: 'prof' },
          { title: '操作',
            width: 400,
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'error', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMove(params.index) } }
              }, '移除')
              let b = h('Button', {
                props: { type: 'info', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMoveTop(params.index) } }
              }, '上移')
              let c = h('Button', {
                props: { type: 'primary', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMoveBottom(params.index) } }
              }, '下移')
              let index = params.index
              if (index === 0 && this.imgCount > index) {
                return [a, c]
              } else if (index === this.imgCount - 1) {
                return [a, b]
              } else {
                return [a, b, c]
              }
            }
          },
          { title: '备注', key: 'info' }
        ],
        tableData1: [],
        formValidate: {
          name: '',
          netMk: '',
          netGW: '',
          dns1: '',
          dns2: '',
          daSV: '',
          bala: '0',
          disable: '0',
          wrLimG: '0',
          imgG: [],
          gTim: '',
          cach: '512',
          wieh: '1024',
          hith: '768',
          resh: '60',
          deps: '32'

        },
        // 验证添加方案字段
        ruleValidate: {
          name: [
            { required: true, message: '不能为空', trigger: 'blur' } ],
          netMk: [ { required: true, message: '不能为空', trigger: 'blur' }
          ],
          netGW: [{ required: true, message: '不能为空', trigger: 'blur' }],
          dns1: [{ required: true, message: '不能为空', trigger: 'blur' }],
          dns2: [{ required: true, message: '不能为空', trigger: 'blur' }],
          daSV: [{ required: true, message: '不能为空', trigger: 'blur' }],
          bala: [{ required: true, message: '不能为空', trigger: 'blur' }],
          disable: [{ required: true, message: '不能为空', trigger: 'blur' }],
          wrLimG: [{ required: true, message: '不能为空', trigger: 'blur' }],
          gTim: [{ required: true, message: '不能为空', trigger: 'blur' }],
          cach: [{ required: true, message: '不能为空', trigger: 'blur' }],
          wieh: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hith: [{ required: true, message: '不能为空', trigger: 'blur' }],
          resh: [{ required: true, message: '不能为空', trigger: 'blur' }],
          deps: [{ required: true, message: '不能为空', trigger: 'blur' }]
  
        },
        formValidate2: { schemeName: '', configName: '' },
        ruleValidate2: {
          schemeName: [{ required: true, message: '不能为空', trigger: 'change' }],
          configName: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        imageList: [],
        imageProList: []
      }
    },
    created () {
      this.handleCheckData()
      this.handleGetDataLength()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetDataLength () {
        this.imgCount = this.tableData1.length
      },
      handleCheckData () {
        var data = this.$route.query.data
        if (data) {
          this.formValidate.name = data.name
          this.formValidate.netMk = data.netMk
          this.formValidate.netGW = data.netGW
          this.formValidate.dns1 = data.dns1
          this.formValidate.dns2 = data.dns2
          this.formValidate.daSV = data.daSV
          this.formValidate.bala = data.bala
          this.formValidate.disable = data.disable
          this.formValidate.wrLimG = data.wrLimG
          // this.formValidate.imgG = data.imgG
          this.formValidate.gTim = data.gTim
          this.formValidate.cach = data.cach
          this.formValidate.wieh = data.wieh
          this.formValidate.hith = data.hith
          this.formValidate.resh = data.resh
          this.formValidate.deps = data.deps
          this.tableData1 = data.imgG
        }
      },
      handleGetImageList () {
        getImageList().then((a) => {
          var arr = a.data.result.list
          if (a.data.error === null && arr.length !== null) {
            this.imageList = arr
            // this.tableData1 = arr
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleSelectImageValue () {
        var arr = this.imageList
        var newArr = arr.filter(item => item.name === this.formValidate2.schemeName)
        this.imageProList = newArr[0].profileList
      },
      handleButtonAdd () {
        this.showPopup = true
        this.handleGetImageList()
      },
      handleGetSchemeName (value, type) {
        console.log(JSON.stringify(value) + '&&' + type)
        // alert('提交数据::' + this.formValidate2.schemeName + '&&' + this.formValidate2.configName)
      },
      // handleFormatValue () {
      //   var value = []
      //   value = this.schemeNameList.filter(item => item.name === this.formValidate2.schemeName)
      //   this.name01 = value[0].id

      //   var value2 = []
      //   value2 = this.configNameList.filter(item => item.name === this.formValidate2.configName)
      //   this.name02 = value2[0].id
      // },
      handleSubmit (name) {
        let that = this
        this.$refs[name].validate(valid => {
          if (valid) {
            if (that.tableData1 && that.tableData1.length === 0) {
              this.$Message.error('请至少添加一个镜像')
            } else {
              editPcGroup(
                that.formValidate.name,
                that.formValidate.netMk,
                that.formValidate.netGW,
                that.formValidate.dns1,
                that.formValidate.dns2,
                that.formValidate.daSV,
                that.formValidate.bala,
                that.formValidate.disable,
                that.formValidate.wrLimG,
                that.tableData1,
                that.formValidate.gTim,
                that.formValidate.cach,
                that.formValidate.wieh,
                that.formValidate.hith,
                that.formValidate.resh,
                that.formValidate.deps
              ).then((a) => {
                if (a.data.error === null) {
                  that.$Message.success('保存成功！')
                  that.$router.push('subType3-1') // 跳转到 全部方案首页
                } else {
                  that.$Message.error(a.data.error)
                }
              }, (err) => { console.log(err) })
            }
          } else {
            that.$Message.error('验证失败xx')
          }
        })
      },
      handleSubmitProject () {

      },
      handleAddProject (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            this.tableData1.push({
              img: this.formValidate2.schemeName,
              prof: this.formValidate2.configName,
              daSV: '',
              item: this.formValidate2.schemeName
            })
            this.handleGetDataLength()
            // console.log('tableData1::' + JSON.stringify(this.tableData1))
            // this.handleSubmitProject()
          } else {
            this.$Message.error('验证失败!')
          }
        })
      },
      handleImageReset (name) {
        this.showPopup = false
      },
      handleMove (index) {
        this.tableData1.splice(index, 1)
        this.handleGetDataLength()
        // console.log('handleMove::after===' + JSON.stringify(this.tableData1))
      },
      handleMoveTop (index) {
        let temp = this.tableData1[index - 1]
        this.$set(this.tableData1, index - 1, this.tableData1[index])
        this.$set(this.tableData1, index, temp)
        this.handleGetDataLength()
        // console.log('handleMoveTop::after===' + JSON.stringify(this.tableData1))
      },
      handleMoveBottom (index) {
        let i = this.tableData1[index + 1]
        this.$set(this.tableData1, index + 1, this.tableList[index])
        this.$set(this.tableData1, index, i)
        this.handleGetDataLength()
        // console.log('handleMoveBottom::after===' + JSON.stringify(this.tableData1))
      },
      handleReset () {
        this.$router.push('subType3-1')
      }
    }
  }
</script>

<style scoped>
 
  .FormItem {
    margin-bottom: 20px;
  }
</style>