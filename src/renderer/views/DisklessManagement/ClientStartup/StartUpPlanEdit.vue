<template>
  <div style="margin-top:20px;">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <Row>
          <i-col span="10" offset="1">
          <FormItem prop="name" :label="this.$t('StartupScenarioName') + '：'">
          <Row>
            <i-col span="10"><i-input v-model="formValidate.name" placeholder="" :disabled='flag' ></i-input></i-col>
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
        <FormItem prop="wrLimG"  :label="this.$t('WritebackLimit')" >
          <Row>
            <i-col span="10">
                  <Tooltip max-width="200" content="当设置会写为零的时候，回写量是回写盘的十分之一">
              <i-input v-model="formValidate.wrLimG" placeholder="">
               <span slot="append">G</span>
              </i-input>
               </Tooltip>
               </i-col>
          </Row>
        </FormItem>
        <FormItem prop="gTim"  :label="this.$t('PlanSwitchingWait') + '：'" >
          <Row>
            <i-col span="10">
            <!-- <Poptip trigger="focus"> -->
             <Tooltip max-width="200" :content="this.$t('tip')">
             <Input v-model="formValidate.gTim" placeholder="" >
             <span slot="append">S</span>
             </Input>
                </Tooltip>
             <!-- <div slot="content">{{$t('tip')}}</div> -->
            <!-- </Poptip> -->
            </i-col>
            <!-- <i-input v-model="formValidate.gTim" placeholder="" style="width:80px;"></i-input> {{$t('tip')}} -->
          </Row>
        </FormItem>
        <FormItem prop="cach" :label="this.$t('CacheSize') + '：'" >
          <Row >
            <i-col span="10" >
              <i-input v-model="formValidate.cach" > <span slot="append">M</span> </i-input>
            </i-col>
          </Row>
        </FormItem>
        <!-- <FormItem prop="wieh" :label="this.$t('WideResolution') + '：'" :label-width="140">
          <Row>
            <i-col span="10">
              <i-input v-model="formValidate.wieh" placeholder=""></i-input>
              </i-col>
          </Row>
        </FormItem> -->
        
        <FormItem prop="PNPvalue" label="PNP设置：">
          <Row>
            <i-col span="10">
            <Select v-model="formValidate.pnps" multiple >
             <Option value="disp">{{$t('显卡')}}</Option>
              <Option value="usb">{{$t('usb')}}</Option>
               <Option value="base">{{$t('主板')}}</Option>
              <Option value="aud">{{$t('声卡')}}</Option>
              <Option value="mon">{{$t('显示器')}}</Option>
             </Select>
             </i-col>
          </Row>
        </FormItem>
        <FormItem prop="hith" :label="this.$t('Resolution') + '：'" >
          <Row>
             <i-col span="4">
                    <Poptip trigger="focus">
                     <i-input v-model="formValidate.wieh" placeholder="">
                     </i-input>
                   <div slot="content">{{$t('宽')}}</div>
                   </Poptip>
              </i-col>
                    <i-col span="1" style="text-align:center;">
                        <span>X</span>
                   </i-col>
            <i-col span="5">
                  <Poptip trigger="focus">
                <i-input v-model="formValidate.hith" placeholder="" ></i-input>
                <div slot="content">{{$t('高')}}</div>
                      </Poptip>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="resh" :label="this.$t('RefreshRate') + '：'" >
          <Row>
            <i-col span="10">
          <i-input v-model="formValidate.resh" placeholder="" >
             <span slot="append">Hz</span>
          </i-input>
          </i-col>
          </Row>
        </FormItem>
        <FormItem prop="deps" :label="this.$t('Color') + '：'" >
          <Row>
            <i-col span="10"><i-input v-model="formValidate.deps" placeholder="" ></i-input></i-col>
          </Row>
        </FormItem>
        </i-col>
        </Row>
    </Form>
    <Row style="margin-bottom:20px;">
      <Button type="primary"  @click="handleButtonAdd">{{$t('AddMirror')}}</Button>
    </Row>
    <div style="overflow:auto"> 
      <Table border :columns="tableColumns1" :data="tableData1"></Table>
    </div>
    <Modal
      :title="this.$t('AddMirror')"
      v-model="showPopup"
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="110" label-position="left">
         <FormItem :label="this.$t('DatabaseServer')" prop="daSV" style="white-space:nowrap;">
           <Select v-model="formValidate2.daSV" @on-change="handleGetImageList" style="width:200px;" :placeholder="this.$t('pleaseSelectDatabaseServer')">
              <Option v-for="item in serverlist" v-bind:key="item.serverIp" v-bind:value="item.serverIp">{{item.serverIp}}</Option>
            </Select>
        </FormItem>
        <FormItem :label="this.$t('MirrorName')" prop="schemeName">
          <Select v-model="formValidate2.schemeName" @on-change="handleSelectImageValue" clearable style="width:200px;" :placeholder="this.$t('pleaseInputMirror')">
            <Option v-for="item in imageList" :value="item.name" :key="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('ConfigurationName')" prop="configName" >
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
  import { getImageListx, editPcGroupx, getServers } from '@/api/wupan'
  export default {
    name: 'subType3-edit',
    data () {
      var checkIpformat = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('Thisfieldcannotbeempty')))
        } else {
          let reg = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
          let regexp = new RegExp(reg)
          if (regexp.test(value)) {
            callback()
          } else {
            return callback(new Error(this.$t('IPAddressIsIncorrect')))
          }
        }
      }
      return {
        masterip: this.$store.state.app.masterip || '',
        imgCount: 0,
        flag: false, // 修改标志
        showPopup: false,
        PNPvalue: [],
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
          pnps: [],
          disable: '0',
          wrLimG: '10',
          imgG: [],
          gTim: '10',
          cach: '512',
          wieh: '1980',
          hith: '1080',
          resh: '60',
          deps: '32'
        },
        // 验证添加方案字段
        ruleValidate: {
          name: [
            { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          netMk: [ { required: true, validator: checkIpformat, trigger: 'blur' }
          ],
          netGW: [{ required: true, validator: checkIpformat, trigger: 'blur' }],
          dns1: [{ required: true, validator: checkIpformat, trigger: 'blur' }],
          dns2: [{ required: true, validator: checkIpformat, trigger: 'blur' }],
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
    methods: {
      handleGetDataLength () {
        if (this.tableData1) {
          this.imgCount = this.tableData1.length
        } else {
          this.imgCount = 0
        }
      },
      handleCheckData () {
        let datax = this.$route.query
        if (datax.flag === 'edit') {
          this.flag = true
        }
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
        if (!this.masterip) return
        getServers(this.masterip).then(response => {
          if (!response.data.error) {
            this.serverlist = response.data.result.list
          }
        })
      },
      /*
      获取镜像类表
      */
      handleGetImageList () {
        let serverIp = this.formValidate2.daSV
        if (!serverIp) return
        getImageListx(serverIp).then((resp) => {
          if (!resp.data.error) {
            var arr = resp.data.result.list
            this.imageList = arr
            this.formValidate2.schemeName = this.imageList[0].name
            this.handleSelectImageValue()
          } else {
            this.$Message.error(resp.data.error)
          }
        })
      },
      /**
       * 选择镜像配置
       */
      handleSelectImageValue () {
        var arr = this.imageList
        var newArr = arr.filter(item => item.name === this.formValidate2.schemeName)
        this.imageProList = newArr[0].profileList
        this.formValidate2.configName = this.imageProList[0].name
      },
      handleButtonAdd () {
        this.showPopup = true
        this.formValidate2.daSV = this.serverlist[0].serverIp
        this.handleGetImageList()
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
                that.formValidate, this.masterip
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
      },
      handleMoveBottom (index) {
        let temp = this.tableData1[index + 1]
        this.$set(this.tableData1, index + 1, this.tableData1[index])
        this.$set(this.tableData1, index, temp)
        this.handleGetDataLength()
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