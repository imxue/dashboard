<template>
  <div>
    type3 -> subtype1-2
  </div>
</template>

<script>
  export default {
    name: 'subType1-1',
    data () {
      return {
        list: [{
          name: 'winxp', // 镜像名
          size: '4', // 镜像大小,单位GB
          path: 'hx1', // 保存路径
          dev: '/dev/sdc', // 设备名
          fun: 'osDisk', // 设备功能, osDisk为系统，imageDisk为镜像盘，dataDisk为数据盘，writebackDisk为回写盘，unUsed为是未使用，raidMember为阵列成员，unknown 为不存在设备
          menuItemName: 'winxp　系统', // 菜单在显示名称
          cacheSize: '512', // 缓存大小，单位为MB
          mountVol: 'E: ', // 映射盘符
          isImportFormMaster: 'yes', // 是否从主服务器导入,yes 为从主服务器导入，no为手动创建镜像
          modifyTime: '20130121072757', // 配置修改时间
          dataModifyTime: '20130113002520', // 数据修改时间
          fullPath: '/mnt/sdc/winxp', // 镜像保存位置
          fileSizeB: '1937746912', // 文件实际占用大小
          // 多配置列表
          profileList: [
            {
              // 多配置编号
              no: '1',
              // 多配置名称
              name: 'profile1',
              // 菜单在显示名称
              menuItemName: 'winxp　系统',
              // 数据修改时间
              dataModifyTime: '20130128000335',
              // 文件实际占用大小
              fileSizeB: '1937746912',
              // 还原点列表
              rollbackList: [{
                // 还原点名
                no: '1',
                // 还原点备注
                comment: '升级驱动',
                // 修改时间
                modifyTime: '2014-04-22 11:11:11',
                // 文件实际占用大小
                fileSizeB: '1937746912'
              },
              {
                no: '2',
                comment: '升级驱动',
                modifyTime: '2014-04-22 11:11:12',
                // 文件实际占用大小
                fileSizeB: '1937746912'
              }]
            },
            {
              no: '2',
              name: 'profile2',
              menuItemName: 'winxp　系统'

            }
          ],
          // 还原点列表（只linux支持）
          rollbackList: [
            {
              no: '1', // 还原点名
              comment: '升级驱动', // 还原点备注
              modifyTime: '2014-04-22 11:11:11' // 修改时间
            },
            {
              no: '2',
              comment: '升级驱动',
              modifyTime: '2014-04-22 11:11:12'
            }
          ]
        }]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      test () {
        let matched = this.$route.matched.filter(item => item.name)
        console.log(matched)
      }
    }
  }
</script>

<style scoped>

</style>

