<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="9" :sm="24">
      <a-card :bordered="false">
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(1)" type="primary">添加一级字典</a-button>
          <a-button @click="handleAdd(2)" type="primary">添加子级字典</a-button>
          <a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>
          <a-button @click="backFlowList" type="default" icon="rollback" :loading="loading">返回</a-button>
        </a-row>
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-alert type="info" :showIcon="true">
            <div slot="message">
              当前选择：
              <a v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</a>
              <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
            </div>
          </a-alert>
          <a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="请输入字典名称"/>
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]">
                <span style="user-select: none">
                  <a-tree checkable multiple @select="onSelect" @check="onCheck" :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys" :treeData="treeData" :checkStrictly="checkStrictly" :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent" @expand="onExpand" />
                </span>
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
      <!---- for:树操作 =======------>
      <div class="drawer-bootom-button">
        <a-dropdown :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
            <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
            <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type="up" />
          </a-button>
        </a-dropdown>
      </div>
      <!---- for:树操作 =======------>
    </a-col>
    <!-- table区域-begin -->
    <a-col :md="15" :sm="24">
      <a-card :bordered="false">
        <a-tabs defaultActiveKey="2">
          <a-tab-pane tab="字典信息" key="2">
            <div class="table-page-search-wrapper">
              <!-- FORM搜索区域 -->
              <a-form layout="inline" :form="screenForm" @submit.prevent="handleScreenSubmit">
                <a-row :gutter="10">
                  <a-col :md="10" :sm="12">
                    <a-form-item label="字典名称" style="margin-left:8px">
                      <a-input placeholder="请输入名称查询" v-decorator="['name',{}]"></a-input>
                    </a-form-item>
                  </a-col>
                  <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <a-col :md="6" :sm="24">
                      <a-button type="primary" icon="search" style="margin-left: 18px" html-type="submit">查询</a-button>
                      <a-button type="primary" icon="reload" style="margin-left: 8px" @click="handleReset">重置</a-button>
                    </a-col>
                  </span>
                  <a-dropdown v-if="selectedRowKeys.length > 0">
                    <a-menu slot="overlay">
                      <a-menu-item key="1" @click="listBatchDel">
                        <a-icon type="delete" />删除
                      </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px">批量操作<a-icon type="down" /></a-button>
                  </a-dropdown>
                </a-row>
              </a-form>
            </div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
              <a style="font-weight: 600">{{selectedRowKeys.length }}</a>项
              <a style="margin-left: 24px" @click="onClearListSelected">清空</a>
            </div>
            <div style="background-color:white">
              <a-table ref="table" size="middle" :bordered="true" rowKey="sysDictId" :columns="columns" :dataSource="listDataSource"
                :pagination="ipagination" :loading="listLoading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange">
                <span slot="state" slot-scope="text">
                  <a-badge :status="text | stateTypeFilter" :text="text | stateFilter" />
                </span>
                <span slot="action" slot-scope="text, record">
                  <a @click="handleEdit(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a v-if="record.state=== 0 " @click="handleState(record.sysDictId,'1')">停用</a>
                  <a-divider v-if="record.state === 0 " type="vertical" />
                  <a v-if="record.state=== 1  " @click="handleState(record.sysDictId,'0')">启用</a>
                  <a-divider v-if="record.state=== 1 " type="vertical" />

                  <a-dropdown>
                    <a class="ant-dropdown-link">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="javascript:;" @click="handleDetail(record)">详情</a>
                      </a-menu-item>

                      <a-menu-item>
                        <a-popconfirm title="确定要删除此字典吗?" @confirm="() => handleDelete(record.sysDictId)">
                          <a>删除</a>
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <dict-modal ref="dictModal" @ok="add_loadTree"></dict-modal>
  </a-row>
</template>
<script>
import { dictTree, childrenDict, deleteById,deleteBatch, saveDict } from '@/api/dict'
import DictModal from './modules/DictModal'
import pick from 'lodash.pick'

const columns = [
  {
    title: '字典名称',
    align: 'center',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '字典项值',
    align: 'center',
    dataIndex: 'value',
    width: 100
  },
  {
    title: '序号',
    align: 'center',
    dataIndex: 'sort',
    width: 80
  },
   {
    title: '状态',
    align: 'center',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 140
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 180
  }
]

const stateMap = {
  '0': {
    state: 'success',
    text: '启用'
  },
  '1': {
    state: 'warning',
    text: '停用'
  }
}

export default {
  name: 'DepartList_view',
  components: {
    DictModal
  },
  data() {
    return {
      columns,
      treeData: [],
      listDataSource: [],
      selectionRows: [],
      form: this.$form.createForm(this),
      screenForm: this.$form.createForm(this),
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共 ' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      iExpandedKeys: [],
      loading: false,
      listLoading: false,
      autoExpandParent: true,
      hiding: true,
      model: {},
      dropTrigger: '',
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      currSelected: {},
      allTreeKeys: [],
      checkStrictly: true,
      selectedRowKeys: []
    }
  },
  filters: {
    stateFilter(type) {
      return stateMap[type].text
    },
    stateTypeFilter(type) {
      return stateMap[type].state
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    // 加载字典树
    async loadTree() {
      var that = this
      that.loading = true
      that.treeData = []
      try {
        let { code, data, msg } = await dictTree()
        if (code === 200) {
          let handleTreeData = this.handleDictTreeData(data)
          for (let i = 0; i < handleTreeData.length; i++) {
            let temp = handleTreeData[i]
            that.treeData.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
          }
        } else {
          that.$message.error(msg || '数据获取失败,请联系系统管理员')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    // 处理字典树数据 ====== loadTree 子方法 ======
    handleDictTreeData(tree) {
      for (let node of tree) {
        node.key = node.id
        node.value = node.id
        if(node.value === 'root'){
          node.disableCheckbox = true
        }
        node.scopedSlots = {
          icon: 'icon',
          title: 'title'
        }
        if (node.children) node.children = this.handleDictTreeData(node.children)
      }
      return tree
    },
    setThisExpandedKeys(node) {
      if (node.id === 'root' ) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    getAllKeys(node) {
      this.allTreeKeys.push(node.key)
      if (node.children && node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          this.getAllKeys(node.children[a])
        }
      }
    },
    // 刷新
    refresh() {
      this.loading = true
      this.onClearSelected()
      this.loadTree()
    },
    // 展开/收起节点时触发
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 点击复选框触发 -切换父子勾选模式
    onCheck(checkedKeys, info) {
      this.hiding = false
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
    },
    // 点击树节点触发
    onSelect(selectedKeys, e) {
      this.hiding = false
      let record = e.node.dataRef
      this.selectedKeys = [record.key]
      this.currSelected = Object.assign({}, record)
      let obj = {
        current: this.ipagination.current,
        size: this.ipagination.pageSize,
        parentId: record.id
      }
      this.queryChildrenDict(obj)
    },
    //  触发onSelect事件时,查询右侧list
    queryChildrenDict(obj) {
      let that = this
      this.listLoading = true
      try {
        childrenDict(obj).then(res => {
          if (res.code === 200) {
            that.listDataSource = res.data
            that.ipagination.total = res.page.total
          } else {
            that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
          }
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.listLoading = false
      }
    },
    // 返回上一页
    backFlowList() {
      this.$router.back(-1)
    },
    // 全选单选后的回调
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    // 初始化 清空选中数据
    onClearListSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      let screenData = this.screenForm.getFieldsValue()
      this.queryChildrenDict({
        parentId: this.currSelected.key,
        current: pagination.current,
        size: this.ipagination.pageSize,
        ...screenData
      })
    },
    // 字典搜索
    onSearch(value) {
      let that = this
      that.loading = true
      that.treeData = []
      if (value) {
        let obj = {
          name: value
        }
        try {
          dictTree(obj).then(res => {
            if (res.code === 200) {
              that.onClearSelected()
              that.listDataSource = []
              that.ipagination.total = 0
              let handleTreeData = this.handleDictTreeData(res.data)
              for (let i = 0; i < handleTreeData.length; i++) {
                let temp = handleTreeData[i]
                that.treeData.push(temp)
                that.setThisExpandedKeys(temp)
                that.getAllKeys(temp)
              }
            } else {
              that.$message.error(res.msg || '数据获取失败,请联系系统管理员')
            }
          })
        } catch (e) {
          that.$message.error(msg || '查询失败！')
        } finally {
          this.loading = false
        }
      } else {
        that.loadTree()
      }
    },
    // 当前选择
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    // 取消选择
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.form.resetFields()
      this.selectedKeys = []
    },
    // 字典新增
    handleAdd(num) {
      this.$refs.dictModal.title = '新增'
      this.$refs.dictModal.addFlag = true
      if (num == 1) {
        this.$refs.dictModal.add()
      } else {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先选中一条记录!')
          return false
        }
        this.$refs.dictModal.add(key)
      }
    },
    // 字典新增后的回调
    add_loadTree() {
      this.loadTree()
      let obj = {
        parentId: this.currSelected.key,
        current: 1,
        size: this.ipagination.pageSize
      }
      this.queryChildrenDict(obj)
    },
    // 删除单条信息
    handleDelete(sysDictId) {
      let that = this
      deleteById({ sysDictId: sysDictId }).then(resp => {
        if (resp.code === 200) {
          that.$message.success('删除成功!')
          that.loadTree()
          that.queryChildrenDict({ parentId: that.currSelected.key })
        } else {
          that.$message.error(resp.msg || '删除失败!')
        }
      })
    },
    //list 条件查询
    handleScreenSubmit(e) {
      e.preventDefault()
      let { ...others } = this.screenForm.getFieldsValue()
      let obj = {
        ...others,
        current: 1,
        size: this.ipagination.pageSize,
        parentId: this.currSelected.key
      }
      this.queryChildrenDict(obj)
    },
    // 重置
    emptyCurrForm() {
      this.form.resetFields()
    },
    // list重置
    handleReset() {
      this.screenForm.resetFields()
      let obj = {
        current: 1,
        size: this.ipagination.pageSize,
        parentId: this.selectedKeys[0]
      }
      this.queryChildrenDict(obj)
    },
    // list 编辑
    handleEdit: function(record) {
      this.$refs.dictModal.title = '编辑'
      this.$refs.dictModal.addFlag = false
      this.$refs.dictModal.disableSubmit = false
      this.$refs.dictModal.edit(record)
    },
    // list 详情
    handleDetail(record) {
      this.$refs.dictModal.title = '详情'
      this.$refs.dictModal.addFlag = false
      this.$refs.dictModal.disableSubmit = true
      this.$refs.dictModal.edit(record)
    },
    // 启用停用
    handleState(sysDictId, state) {
      let msg = '启用'
      if (state === '1') {
        msg = '停用'
      }
      let _this = this
      _this.$confirm({
        title: '提示',
        content: '您确定要' + msg + '此字典吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let obj = {
            sysDictId,
            state
          }
          saveDict(obj).then(resp => {
            if (resp.code === 200) {
              _this.$message.success('操作成功!')
              _this.queryChildrenDict({ parentId: _this.currSelected.key })
            } else {
              _this.$message.error(resp.msg || '操作失败!')
            }
          })
        },
        onCancel() {}
      })
    },
    // 多选删除
    listBatchDel: function() {
      let that = this
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            deleteBatch({ ids: ids }).then(res => {
              if (res.code === 200) {
                that.$message.success('删除成功!')
                that.loadTree()
                that.queryChildrenDict({
                  parentId: that.currSelected.key,
                  current: 1,
                  size: that.ipagination.pageSize
                })
                that.selectedRowKeys = []
                that.selectionRows = []
              } else {
                that.$message.warning(msg || '删除失败!')
              }
            })
          }
        })
      }
    },
    // <!---- for:切换父子勾选模式 =======------>
    expandAll() {
      this.iExpandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.iExpandedKeys = []
    },
    checkALL() {
      this.checkStriccheckStrictlytly = false
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    }
    //  <!---- for:切换父子勾选模式 =======------>
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin: 15px;
}

.anty-form-btn {
  width: 100%;
  text-align: center;
}

.anty-form-btn button {
  margin: 0 5px;
}

.anty-node-layout .ant-layout-header {
  padding-right: 0;
}

.header {
  padding: 0 8px;
}

.header button {
  margin: 0 3px;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

#app .desktop {
  height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.drawer-bootom-button {
  /*position: absolute;*/
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>