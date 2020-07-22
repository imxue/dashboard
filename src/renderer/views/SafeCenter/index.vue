<template>
    <div>
      <div>
        <template v-for="(item,index) in SafeStrategy">
            <h3 :key="item.group_name" style="marginBottom:10px;">
              {{index === 0 ? $t('Browserprotection') :""}}
               {{index === 1 ? $t('Clientprotection'):"" }}
               {{index === 2 ? $t('LANprotection'):'' }}
              </h3>
            <Table :columns="columns1" border :data="item.items" :key="index" style="marginBottom:10px;"></Table>
        </template>
      </div>
        <Modal v-model="addSafeitem"
        width="800"
        footer-hide
        :title="obj[code] && obj[code].title">
         <add  :code="code" v-if="addSafeitem"  :addItem="addItem" />
        </Modal>

        <Modal v-model="Safeitem"
        width="900"
        footer-hide
        @on-visible-change="HandleVisibleChange"
        
        :title="obj[code] && obj[code].title"
        >
        <div >
          <Button v-if="code !== '1003002' || type !== 0" @click="additem" type="primary" style="marginBottom:10px;">{{$t('Add')}}</Button>
         <div style="marginBottom:4px;">
            <Checkbox v-if="code === '1003001'" v-model="single" @on-change="HandelSetBind">{{$t('autobind')}}</Checkbox>
           
         </div>
        </div>
            <Table  border :columns="getSafeitemcol" :data="viewItem" ></Table>
            <div style="marginTop:10px;">
               <Button v-if="code === '1003002' && type !== 0" type="primary" @click="HandleRecobery">{{$t('RecoveryCriteria')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getSafeStrategy, defaultparam, autobind, deleteSafeStrategy, getSafeStrategybyId, saveSafeStrategybyId, addSafeStrategy, deleteSafeStrategybyId, enableSafeStrategy, disableSafeStrategy } from '../../api/common'
import add from './add'
export default {
  name: 'safeCenter',
  components: {
    add
  },
  data () {
    return {
      type: '0', // (开启)网络攻击防护
      SafeStrategy: [],
      single: 0, // 绑定网关
      Safeitem: false,
      viewItem: [],
      Demo: ['1001002', '1002001', '1002002', '1003003'],
      addTime: '',
      addSafeitem: false,
      code: '',
      addFlag: true,
      selectId: '',
      obj: {
        '1001001': {
          items: [{ filed: 'domain', value: '' }, { filed: 'Description', value: '' }],
          title: this.$t('Addillegalweb')
        },
        '1002003': {
          items: [{ filed: 'Window', value: '' }, { filed: 'Description', value: '' }],
          title: this.$t('Addillegalwindow')
        },

        '1002004': {
          items: [{ filed: 'Process', value: '1231' }, { filed: 'FeatureCode', value: '' }, { filed: 'Description', value: '' }],
          title: this.$t('Addillegalprocess')
        },

        '1002005': {
          items: [{ filed: 'Process', value: '' }, { filed: 'FeatureCode', value: '' }, { filed: 'Description', value: '' }],
          title: this.$t('AddSafeprocess')
        },
        '1003001': {
          items: [{ filed: 'ip', value: '' }, { filed: 'mac', value: '' }, { filed: 'Description', value: '' }],
          title: this.$t('bindServe')
        },
        '1003002': {
          title: this.$t('Modifyprotectionparameters')
        }
      }

    }
  },
  computed: {
    getSafeitemcol: function () {
      let obj = {
        '1001001': [
          {
            key: 'item_code',
            title: this.$t('item_code')
          },
          {
            key: 'domain',
            title: this.$t('domain'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.domain
                  },
                  on: {
                    'on-change' (e) {
                      params.row.domain = e.target.value
                    }
                  }
                }, params.row.domain)
              } else {
                return h('span', params.row.domain)
              }
            }
          },
          {
            key: 'description',
            title: this.$t('description'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.description
                  },
                  on: {
                    'on-change' (e) {
                      params.row.description = e.target.value
                    }
                  }
                }, params.row.domain)
              } else {
                return h('span', params.row.description)
              }
            }
          },
          {
            key: 'Action',
            title: this.$t('operation'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                if (params.row.$isAdd) {
                  return h('div', [

                    h('Button', {
                      props: {
                        type: 'primary'
                      },

                      on: {
                        click: () => {
                          this.Add(params.row)
                        }
                      }
                    }, this.$t('Add')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginRight: '20px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))

                  ])
                } else {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      style: {
                        marginRight: '10px'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                }
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.Edit(params.row)
                      }
                    }
                  }, this.$t('Edit')),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  }, this.$t('Delete'))
                ])
              }
            }
          }
        ],
        '1001002': [
          {
            key: 'item_code',
            title: 'item_code'
          },
          {
            key: 'domain',
            title: 'domain'
          },
          {
            key: 'description',
            title: 'description'
          }
        ],
        '1002001': [
          {
            key: 'item_code',
            title: 'item_code'
          },
          {
            key: 'domain',
            title: 'domain'
          },
          {
            key: 'description',
            title: 'description'
          }
        ],
        '1002002': [
          {
            key: 'item_code',
            title: 'item_code'
          },
          {
            key: 'domain',
            title: 'domain'
          },
          {
            key: 'description',
            title: 'description'
          }
        ],
        '1002003': [
          {
            key: 'item_code',
            title: this.$t('item_code'),
            width: 100
          },
          {
            key: 'window',
            title: this.$t('Window'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.window
                  },
                  on: {
                    'on-change' (e) {
                      params.row.window = e.target.value
                    }
                  }
                }, params.row.window)
              } else {
                return h('span', params.row.window)
              }
            }
          },
          {
            key: 'description',
            title: this.$t('description'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.description
                  },
                  on: {
                    'on-change' (e) {
                      params.row.description = e.target.value
                    }
                  }
                }, params.row.domain)
              } else {
                return h('span', params.row.description)
              }
            }
          },
          {
            key: 'Action',
            title: this.$t('operation'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                if (params.row.$isAdd) {
                  return h('div', [
                    // 保存
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Add(params.row)
                        }
                      }
                    }, this.$t('Add')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('LocalRemoval'))
                  ])
                } else {
                  //
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('LocalRemoval'))
                  ])
                }
              } else {
                // 编辑
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    on: {
                      click: () => {
                        this.Edit(params.row)
                      }
                    }
                  }, this.$t('Edit')),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  }, this.$t('LocalRemoval'))
                ])
              }
            }
          }
        ],
        '1002004': [
          {
            key: 'item_code',
            title: this.$t('item_code')
          },
          // {
          //   key: 'feature_code',
          //   title: this.$t('feature_code'),
          //   render: (h, params) => {
          //     if (params.row.$isEdit || params.row.$isAdd) {
          //       return h('Input', {
          //         props: {
          //           value: params.row.feature_code
          //         },
          //         on: {
          //           'on-change' (e) {
          //             params.row.feature_code = e.target.value
          //           }
          //         }
          //       })
          //     } else {
          //       return h('span', params.row.feature_code)
          //     }
          //   }
          // },
          {
            key: 'process',
            title: this.$t('process'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.process
                  },
                  on: {
                    'on-change' (e) {
                      params.row.process = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.process)
              }
            }
          },
          {
            key: 'description',
            title: this.$t('description'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.description
                  },
                  on: {
                    'on-change' (e) {
                      params.row.description = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.description)
              }
            }
          },
          {
            key: 'Action',
            title: this.$t('operation'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                if (params.row.$isAdd) {
                  return h('div', [
                    // 保存
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Add(params.row)
                        }
                      }
                    }, this.$t('Add')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('LocalRemoval'))
                  ])
                } else {
                  //
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                }
              } else {
                // 编辑
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    on: {
                      click: () => {
                        this.Edit(params.row)
                      }
                    }
                  }, this.$t('Edit')),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  }, this.$t('Delete'))
                ])
              }
            }
          }
        ],
        '1002005': [
          {
            key: 'item_code',
            title: this.$t('item_code')
          },
          {
            key: 'proc_path',
            title: this.$t('proc_path'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.proc_path
                  },
                  on: {
                    'on-change' (e) {
                      params.row.proc_path = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.proc_path)
              }
            }
          },
          {
            key: 'parameter',
            title: this.$t('parameter'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.parameter
                  },
                  on: {
                    'on-change' (e) {
                      params.row.parameter = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.parameter)
              }
            }
          },
          {
            key: 'description',
            title: this.$t('description'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.description
                  },
                  on: {
                    'on-change' (e) {
                      params.row.description = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.description)
              }
            }

          },

          {
            key: 'Action',
            title: this.$t('operation'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                if (params.row.$isAdd) {
                  return h('div', [
                    // 保存
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Add(params.row)
                        }
                      }
                    }, this.$t('Add')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                } else {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                }
              } else {
                // 编辑
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    on: {
                      click: () => {
                        this.Edit(params.row)
                      }
                    }
                  }, this.$t('Edit')),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  }, this.$t('Delete'))
                ])
              }
            }
          }
        ],
        '1003001': [
          {
            key: 'item_code',
            title: this.$t('item_code')
          },
          {
            key: 'mac',
            title: 'mac',
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.mac
                  },
                  on: {
                    'on-change' (e) {
                      params.row.mac = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.mac)
              }
            }
          },
          {
            key: 'ip',
            title: 'ip',
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.ip
                  },
                  on: {
                    'on-change' (e) {
                      params.row.ip = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.ip)
              }
            }
          },
          {
            key: 'description',
            title: this.$t('description'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                return h('Input', {
                  props: {
                    value: params.row.description
                  },
                  on: {
                    'on-change' (e) {
                      params.row.description = e.target.value
                    }
                  }
                })
              } else {
                return h('span', params.row.description)
              }
            }
          },
          {
            key: 'Action',
            title: this.$t('operation'),
            render: (h, params) => {
              if (params.row.$isEdit || params.row.$isAdd) {
                if (params.row.$isAdd) {
                  return h('div', [
                    // 保存
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Add(params.row)
                        }
                      }
                    }, this.$t('Add')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                } else {
                  //
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save')),
                    h('Button', {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginLeft: '10px'
                      },
                      on: {
                        click: () => {
                          this.delete(params.row)
                        }
                      }
                    }, this.$t('Delete'))
                  ])
                }
              } else {
                // 编辑
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    on: {
                      click: () => {
                        this.Edit(params.row)
                      }
                    }
                  }, this.$t('Edit')),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  }, this.$t('Delete'))
                ])
              }
            }
          }
        ],
        '1003002': {
          '0': [
            {
              key: 'item_code',
              title: 'item_code'
            },
            {
              key: 'max_packet',
              title: this.$t('MaxPacket'),
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.max_packet
                    },
                    on: {
                      'on-change' (e) {
                        params.row.max_packet = Number(e.target.value)
                      }
                    }
                  })
                } else {
                  return h('span', params.row.max_packet)
                }
              }
            },
            {
              key: 'max_tcp_conn',
              title: this.$t('max_tcp_conn'),
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.max_tcp_conn
                    },
                    on: {
                      'on-change' (e) {
                        params.row.max_tcp_conn = Number(e.target.value)
                      }
                    }
                  })
                } else {
                  return h('span', params.row.max_tcp_conn)
                }
              }

            },
            {
              key: 'max_upd_conn',
              title: this.$t('max_udp_conn'),
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.max_upd_conn
                    },
                    on: {
                      'on-change' (e) {
                        params.row.max_upd_conn = Number(e.target.value)
                      }
                    }
                  })
                } else {
                  return h('span', params.row.max_upd_conn)
                }
              }
            },
            {
              key: 'Action',
              title: this.$t('operation'),
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Save(params.row)
                        }
                      }
                    }, this.$t('Save'))
                  ])
                } else {
                // 编辑
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Edit(params.row)
                        }
                      }
                    }, this.$t('Edit'))
                  ])
                }
              }
            }
          ],
          '1': [
            {
              key: 'item_code',
              title: 'item_code'
            },
            {
              key: 'start_ip',
              title: this.$t('startIp'),
              render: (h, params) => {
                if (params.row.$isEdit || params.row.$isAdd) {
                  return h('Input', {
                    props: {
                      value: params.row.start_ip
                    },
                    on: {
                      'on-change' (e) {
                        params.row.start_ip = e.target.value
                      }
                    }
                  })
                } else {
                  return h('span', params.row.start_ip)
                }
              }
            },
            {
              key: 'end_ip',
              title: this.$t('endIp'),
              render: (h, params) => {
                if (params.row.$isEdit || params.row.$isAdd) {
                  return h('Input', {
                    props: {
                      value: params.row.end_ip
                    },
                    on: {
                      'on-change' (e) {
                        params.row.end_ip = e.target.value
                      }
                    }
                  })
                } else {
                  return h('span', params.row.end_ip)
                }
              }
            },

            {
              key: 'description',
              title: this.$t('description'),
              render: (h, params) => {
                if (params.row.$isEdit || params.row.$isAdd) {
                  return h('Input', {
                    props: {
                      value: params.row.description
                    },
                    on: {
                      'on-change' (e) {
                        params.row.description = e.target.value
                      }
                    }
                  })
                } else {
                  return h('span', params.row.description)
                }
              }
            },
            {
              key: 'Action',
              title: this.$t('operation'),
              render: (h, params) => {
                if (params.row.$isEdit || params.row.$isAdd) {
                  if (params.row.$isAdd) {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary'
                        },
                        on: {
                          click: () => {
                            this.Add(params.row)
                          }
                        }
                      }, this.$t('Add'))
                    ])
                  } else {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary'
                        },
                        on: {
                          click: () => {
                            this.Save(params.row)
                          }
                        }
                      }, this.$t('Save'))
                    ])
                  }
                } else {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary'
                      },
                      on: {
                        click: () => {
                          this.Edit(params.row)
                        }
                      }
                    }, this.$t('Edit'))
                  ])
                }
              }
            }
          ]
        },
        '1003003': [
          {
            key: 'item_code',
            title: 'item_code'
          },
          {
            key: 'mac',
            title: 'mac'
          },
          {
            key: 'ip',
            title: 'ip'
          },
          {
            key: 'description',
            title: this.$t('description')
          }
        ]
      }
      if (this.code === '1003002') {
        if (this.type === 0) { return obj[this.code]['0'] } else if (this.type === 1) {
          return obj[this.code]['1']
        }
      } else {
        return obj[this.code]
      }
    },
    columns1: function () {
      return [
        {
          key: 'item_code',
          title: this.$t('item_code'),
          width: 85,
          align: 'center'
        },
        {
          key: 'item_name',
          title: this.$t('SafeItem'),
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('span', {}, this.$t(`${params.row.item_code}_i`))
          }
        },
        {
          key: 'count',
          title: this.$t('count'),
          width: 90,
          align: 'center',
          render: (h, params) => {
            if (this.filterItemCode(params.row.item_code)) {
              return h('span', '-')
            } else {
              return h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: 'blue',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.view(params.row)
                  }
                }
              }, (params.row.count))
            }
          }
        },
        {
          key: 'description',
          title: this.$t('description'),
          minWidth: 400,
          align: 'center',
          render: (h, params) => {
            return h('span', this.$t(`${params.row.item_code}`))
          }
        },
        {
          key: 'Action',
          title: this.$t('operation'),
          minWidth: 450,
          render: (h, params) => {
            if (params.row.item_code === '1003001') {
              return h('div', {}, [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.view(params.row, 0)
                    }
                  }
                }, this.$t('bindServe')),

                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     ghost: true
                //   },
                //   style: {
                //     marginRight: '10px'
                //   }
                // }, '导出客户机MAc地址列表'),
                h('Button', {
                  props: {
                    type: 'primary',
                    disabled: params.row.state === 1
                  },
                  on: {
                    click: () => {
                      this.enabled(params.row, 0)
                    }
                  },
                  style: {
                    marginRight: '10px'
                  }
                }, this.$t('enable')),
                h('Button', {
                  props: {
                    type: 'error',
                    disabled: params.row.state === 0
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.disabled(params.row, 0)
                    }
                  }
                }, this.$t('Closd'))
              ])
            }
            if (params.row.item_code === '1003002') {
              return h('div', {
                style: {
                  display: 'flex'
                }
              }, [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.HandleEditdp(params.row, 0)
                    }
                  },
                  style: {
                    marginRight: '10px'
                  }
                }, this.$t('modifyProteParm')),
                h('Button', { props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.HandleEditdp(params.row, 1)
                  }
                }
                }, this.$t('addProt')),

                h('Button', {
                  props: {
                    type: 'primary',
                    disabled: params.row.state === 1
                  },
                  on: {
                    click: () => {
                      this.enabled(params.row, 0)
                    }
                  },
                  style: {
                    marginRight: '10px'
                  }
                }, this.$t('enable')),
                h('Button', {
                  props: {
                    type: 'error',
                    disabled: params.row.state === 0
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.disabled(params.row, 0)
                    }
                  }
                }, this.$t('Closd'))
              ])
            } else {
              if (this.filterItemCode(params.row.item_code)) {
                return h('div', {}, [
                  h('Button', {
                    props: {
                      type: 'primary',
                      disabled: params.row.state === 1
                    },
                    on: {
                      click: () => {
                        this.enabled(params.row, 0)
                      }
                    },
                    style: {
                      marginRight: '10px'
                    }
                  }, this.$t('enable')),
                  h('Button', {
                    props: {
                      type: 'error',
                      disabled: params.row.state === 0
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.disabled(params.row, 0)
                      }
                    }
                  }, this.$t('Closd'))
                ])
              } else {
                let _this = this
                return h('div', {
                  style: {
                    display: 'flex'
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        _this.view(params.row)
                      }
                    }
                  }, _this.$t('details')),
                  h('Button', {
                    props: {
                      type: 'primary',
                      disabled: params.row.state === 1
                    },
                    on: {
                      click: () => {
                        this.enabled(params.row, 0)
                      }
                    },
                    style: {
                      marginRight: '10px'
                    }
                  }, this.$t('enable')),
                  h('Button', {
                    props: {
                      type: 'error',
                      disabled: params.row.state === 0
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.disabled(params.row, 0)
                      }
                    }
                  }, this.$t('Closd'))
                ])
              }
            }
          }
        }
      ]
    }
  },
  created () {
    this.HandlegetSafeStrategy()
  },
  methods: {
    async HandleRecobery () {
      try {
        await defaultparam()
      } catch (error) {

      } finally {
        this.viewItem = await this.HandleGetSafeStrategybyId('1003002')
      }
    },
    async HandleGetSafeStrategybyId (code, type) {
      try {
        let resp = await getSafeStrategybyId({ item_code: code, type: type })
        return resp.data
      } catch (error) {
        return []
      }
    },
    async disabled (e) {
      try {
        await disableSafeStrategy({ itemcode: e.item_code })
      } catch (error) {
        this.HandlegetSafeStrategy()
      } finally {
        this.HandlegetSafeStrategy()
      }
    },
    async enabled (e) {
      try {
        await enableSafeStrategy({ itemcode: e.item_code })
      } catch (error) {
        this.HandlegetSafeStrategy()
      } finally {
        this.HandlegetSafeStrategy()
      }
    },
    filterItemCode (code) {
      return this.Demo.some(item => { return item === code })
    },
    handleAdd (row) {
      this.addSafeitem = true
      this.code = row.item_code + ''
      this.addItem = this.obj[this.code].items
    },
    async HandlegetSafeStrategy () {
      try {
        let resp = await getSafeStrategy()
        this.SafeStrategy = resp.data
        this.SafeStrategy = this.filterItem(resp.data, ['1002001', '1002002', '1003002', '1003003'])
      } catch (error) {
        console.log(error)
      }
    },
    filterItem (arr, code) {
      code.forEach(codex => {
        for (let i = 0; i < arr.length; i++) {
          let index = arr[i].items.findIndex(item => item.item_code === codex)
          if (index !== -1) {
            arr[i].items.splice(index, 1)
          }
        }
      })
      console.log(arr)
      return arr
    },
    Edit (row) {
      this.$set(row, '$isEdit', true)
    },
    async Add (row) {
      try {
        await addSafeStrategy(row)
        this.$set(row, '$isAdd', false)
        this.addFlag = false
      } catch (error) {
        this.viewItem = await this.HandleGetSafeStrategybyId(this.selectId)
        this.code = row.item_code
      } finally {
        this.viewItem = await this.HandleGetSafeStrategybyId(this.selectId)
        this.code = row.item_code
      }
    },
    async delete (row) {
      try {
        await deleteSafeStrategy(row.id)
        this.$set(row, '$isAdd', false)
      } catch (error) {
        this.viewItem = []
      } finally {
        this.viewItem = await this.HandleGetSafeStrategybyId(this.selectId)
        this.code = row.item_code
      }
    },
    additem () {
      this.viewItem.push({
        'item_code': this.selectId,
        '$isAdd': true
      })
    },
    async Save (row) {
      try {
        await saveSafeStrategybyId(row)
        this.$set(row, '$isEdit', false)
      } catch (error) {

      }
    },
    async view (data) {
      try {
        this.selectId = data.item_code
        this.code = data.item_code
        this.viewItem = await this.HandleGetSafeStrategybyId(data.item_code)
      } catch (error) {
        this.viewItem = []
      }
      this.Safeitem = true
    },
    async HandelSetBind (view) {
      try {
        await autobind({
          'auto_bind_ip_mac': view ? 1 : 0
        })
      } catch (error) {

      }
    },
    async Removal (row) {
      try {
        await deleteSafeStrategybyId(row.id)
      } catch (error) {

      } finally {
        this.view({ item_code: this.selectId })
      }
    },
    async HandleEditdp (row, type) {
      this.type = type
      this.selectId = row.item_code
      this.code = row.item_code
      this.viewItem = await this.HandleGetSafeStrategybyId(row.item_code, this.type)
      this.Safeitem = true
    },
    HandleVisibleChange (show) {
      this.addFlag = !show
    }
  }

}
</script>


<style lang="sass" scoped></style>