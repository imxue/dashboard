<template>
  <div style="margin-top:20px;">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <Row>
          <i-col span="10" offset="2">
     
          <FormItem prop="name" :label="this.$t('StartupScenarioName') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.name" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="netMk"  :label="this.$t('SubnetMask') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.netMk" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="netGW"  :label="this.$t('Gateway') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.netGW" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="dns1"  :label="this.$t('PreferreDNS') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.dns1" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="dns2" :label="this.$t('AlternateDNS') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.dns2" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
     
        <FormItem prop="bala"  :label="this.$t('LoadBalancing') + '：'">
          <Row>
            <i-col span="10">
              <Select v-model="formValidate.bala">
                <Option value="0">{{$t('Enable')}}</Option>
                <Option value="1">{{$t('Disable')}}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="disable" :label="this.$t('EnabledState') + '：'">
          <Row>
            <i-col span="10">
              <Select v-model="formValidate.disable">
                 <Option value="0">{{$t('Enable')}}</Option>
                <Option value="1">{{$t('Disable')}}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
      </i-col>
      <i-col span="10">
        <FormItem prop="wrLimG"  :label="this.$t('WritebackLimit') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.wrLimG" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="gTim"  :label="this.$t('PlanSwitchingWait') + '：'">
          <Row>
            <i-col span="20"><i-input v-model="formValidate.gTim" placeholder="" style="width:80px;"></i-input> {{$t('tip')}}
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="cach" :label="this.$t('CacheSize') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.cach" placeholder=""  style="width:120px;"></i-input>&nbsp;&nbsp; *M</i-col>
          </Row>
        </FormItem>
        <FormItem prop="wieh" :label="this.$t('WideResolution') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.wieh" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="hith" :label="this.$t('HighResolution') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.hith" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="resh" :label="this.$t('RefreshRate') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.resh" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="deps" :label="this.$t('Color') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.deps" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>

        </i-col>
        </Row>
    </Form>
    <Row style="margin-bottom:20px;">
      <Button type="primary"  @click="handleButtonAdd">{{$t('AddMirror')}}</Button>
    </Row>
    <Table border :columns="tableColumns1" :data="tableData1"></Table>
    <Modal
      :title="this.$t('AddMirror')"
      v-model="showPopup"
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
         <FormItem :label="this.$t('DatabaseServer')" prop="daSV">
           <Select v-model="formValidate2.daSV" @on-change="handleGetImageList" style="width:200px;" :placeholder="this.$t('pleaseSelectDatabaseServer')">
              <Option v-for="item in serverlist" v-bind:key="item.serverIp" v-bind:value="item.serverIp">{{item.serverIp}}</Option>
            </Select>
        </FormItem>
        <FormItem :label="this.$t('MirrorName')" prop="schemeName">
          <Select v-model="formValidate2.schemeName" @on-change="handleSelectImageValue" clearable style="width:200px;" :placeholder="this.$t('pleaseInputMirror')">
            <Option v-for="item in imageList" :value="item.name" :key="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('ConfigurationName')" prop="configName">
          <Select v-model="formValidate2.configName" clearable style="width:200px;" :placeholder="this.$t('pleaseInputConfigurationName')">
            <Option v-for="item in imageProList" :value="item.name" :key="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleAddProject('formValidate2')">{{$t('Add')}}</Button>
            <Button @click="handleImageReset('formValidate2')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
    </Modal>
    <div class="buttonList" style="margin-top: 20px">
        <Button type="primary" @click="handleSubmit('formValidate')">{{$t('Save')}}</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('return')}}</Button>
    </div>
  </div>
</template>

<script>
  import { getImageListx, editPcGroupx, getServersx } from '@/api/wupan'
  export default {
    name: 'subType3-edit',
    data () {
      return {
        imgCount: 0,
        showPopup: false,
        name01: '',
        name02: '',
        serverlist: '',
        tableColumns1: [
          { key: 'img', renderHeader: (h, params) => { return h('span', this.$t('MirrorName')) } },
          { key: 'daSV', renderHeader: (h, params) => { return h('span', this.$t('DatabaseServer')) } },
          { key: 'prof', renderHeader: (h, params) => { return h('span', this.$t('ConfigurationName')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            width: 400,
            key: 'operation',
            render: (h, params) => {
              let resp = h('Button', {
                props: { type: 'error', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMove(params.index) } }
              }, this.$t('Remove'))
              let b = h('Button', {
                props: { type: 'info', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMoveTop(params.index) } }
              }, this.$t('MoveUp'))
              let c = h('Button', {
                props: { type: 'primary', ghost: true },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleMoveBottom(params.index) } }
              }, this.$t('MoveDown'))
              let index = params.index
              if (index === 0 && this.imgCount > index) {
                return [resp, c]
              } else if (index === this.imgCount - 1) {
                return [resp, b]
              } else {
                return [resp, b, c]
              }
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('Remarks')) }, key: 'info' }
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
            { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          netMk: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }
          ],
          netGW: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          dns1: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          dns2: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          daSV: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          bala: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          disable: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          wrLimG: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          gTim: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          cach: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          wieh: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          hith: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          resh: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          deps: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
  
        },
        formValidate2: { schemeName: '', daSV: '', configName: '' },
        ruleValidate2: {
          daSV: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
          schemeName: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
          configName: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }]
        },
        imageList: [],
        imageProList: []
      }
    },
    created () {
      this.handleCheckData()
      this.handleGetDataLength()
      this.handlegetServerlist()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetDataLength () {
        if (this.tableData1) {
          this.imgCount = this.tableData1.length
        } else {
          this.imgCount = 0
        }
      },
      handleCheckData () {
        var data = this.$route.query.data
        if (data) {
          this.formValidate = data
          // 镜像列表
          if (data.imgG) {
            this.tableData1 = data.imgG
          }
        }
      },
      /*
      获取服务器类表
      */
      handlegetServerlist () {
        let mip = localStorage.getItem('masterip')
        getServersx(mip).then(response => {
          if (!response.data.error) {
            this.serverlist = response.data.result.list
          }
        })
      },
      /*
      获取镜像类表
      */
      handleGetImageList () {
        let x = this.formValidate2.daSV
        getImageListx(x).then((resp) => {
          if (!resp.data.error) {
            var arr = resp.data.result.list
            this.imageList = arr
          } else {
            this.$Message.error(resp.data.error)
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
      },
      handleGetSchemeName (value, type) {
        console.log(JSON.stringify(value) + '&&' + type)
      },
      /**
       * 保存镜像
       */
      handleSubmit (name) {
        let that = this
        this.$refs[name].validate(valid => {
          if (valid) {
            if (that.tableData1 && that.tableData1.length === 0) {
              this.$Message.error(this.$t('PleaseAddOneMirror'))
            } else {
              that.formValidate.imgG = that.tableData1
              editPcGroupx(
                that.formValidate, localStorage.getItem('masterip')
              ).then((resp) => {
                if (!resp.data.error) {
                  that.$Message.success(this.$t('SetSucess'))
                  that.$router.push('StartUpPlan') // 跳转到 全部方案首页
                } else {
                  that.$Message.error(resp.data.error)
                }
              })
            }
          }
        })
      },
      handleSubmitProject () {

      },
      handleAddProject (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            if (this.tableData1 === null) {
              this.tableData1 = []
            }
            this.tableData1.push({
              img: this.formValidate2.schemeName,
              prof: this.formValidate2.configName,
              daSV: this.formValidate2.daSV,
              item: this.formValidate2.schemeName
            })
            this.handleGetDataLength()
          } else {
            this.$Message.error(this.$t('ValidationFailure'))
          }
        })
      },
      handleImageReset (name) {
        this.showPopup = false
      },
      handleMove (index) {
        this.tableData1.splice(index, 1)
        this.handleGetDataLength()
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
        this.$router.push('StartUpPlan')
      }
    }
  }
</script>

<style scoped>
 
  .FormItem {
    margin-bottom: 20px;
  }
</style>