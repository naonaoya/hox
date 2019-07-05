<template>
  <div class="analysis">
    <div class="booy"></div>
    <div class="cou">
      <strong>固件列表</strong>
      <a-button type="primary" @click="showModal">
        <a-icon type="plus-circle" />创建新固件
      </a-button>
      <div>
        <a-modal
          title="创建新固件"
          :visible="visible"
          @ok="handleOk"
          :confirmLoading="confirmLoading"
          @cancel="handleCancel"
        >
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item label="APK名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a-input
                placeholder="请输入APK名称"
                v-decorator="[
          'note',
          {rules: [{ required: true, message: 'Please input your note!' }]}
        ]"
              />
            </a-form-item>
            <a-form-item label="版本号" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a-input
                placeholder="请输入版本号"
                v-decorator="[
          'gender',
          {rules: [{ required: true, message: 'Please input your note!' }]}
        ]"
              />
            </a-form-item>

            <a-form-item label="文件" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
              <a
                v-decorator="[
          'gender',
          {rules: [{ required: true, message: 'Please input your note!' }]}
        ]"
              />
              <a-textarea placeholder="Basic usage" :rows="4" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <!-- <a-button type="primary" html-type="submit">Submit</a-button> -->
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
    <div>
      <!-- table -->
      <a-card>
        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
          <template
            v-for="(col, i) in ['name', 'workId', 'department']"
            :slot="col"
            slot-scope="text, record"
          >
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{ text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(record.key)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="newMember"
        >新增成员</a-button>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar
        :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
      >
        <span class="popover-wrapper">
          <a-popover
            title="表单校验信息"
            overlayClassName="antd-pro-pages-forms-style-errorPopover"
            trigger="click"
            :getPopupContainer="trigger => trigger.parentNode"
          >
            <template slot="content">
              <li
                v-for="item in errors"
                :key="item.key"
                @click="scrollToField(item.key)"
                class="antd-pro-pages-forms-style-errorListItem"
              >
                <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
                <div class>{{ item.message }}</div>
                <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
              </li>
            </template>
            <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
              <a-icon type="exclamation-circle" />
              {{ errors.length }}
            </span>
          </a-popover>
        </span>
        <!-- <a-button type="primary" @click="validate" :loading="loading">提交</a-button> -->
      </footer-tool-bar>
    </div>
  </div>
</template>
<script>
import RepositoryForm from '../form/advancedForm/AdvancedForm'
import TaskForm from '../form/advancedForm/TaskForm'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

export default {
  name: 'AdvancedForm',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
      loading: false,
      memberLoading: false,

      // table
      columns: [
        {
          title: '成员姓名',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '工号',
          dataIndex: 'workId',
          key: 'workId',
          width: '20%',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '所属部门',
          dataIndex: 'department',
          key: 'department',
          width: '40%',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '小明',
          workId: '001',
          editable: false,
          department: '行政部'
        },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部'
        }
      ],

      errors: []
    }
  },
  methods: {
    //取消表单默认提交
    handleSubmit(e) {
      e.preventDefault()
    },

    //添加
    newMember() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },

    //删除信息
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(record) {
      this.memberLoading = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        this.memberLoading = false
        this.$message.error('请填写完整成员信息。')
        return
      }

      // 模拟网络请求、卡顿 800ms
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
    },

    //编辑信息
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },

    //取消编辑操作
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    }
  }
}
</script>
<style scoped>
.nav {
  font-size: 19px;
  color: rgb(117, 116, 116);
  margin-left: 20px;
}
.face {
  width: 900px;
  height: 210px;
  border: darkgray 1px solid;
  margin-top: 25px;
  margin-left: 100px;
}
.cou {
  color: rgb(117, 116, 116);
  margin-left: 20px;
  font-size: 19px;
  margin-top: 25px;
}
.sur {
  margin-left: 20px;
  margin-top: 20px;
}
.ant-table-body .ant-table-thead > tr > th {
  background-color: rgb(31, 104, 187);
  border: 0px;
  text-align: center;
  color: aliceblue;
  font-size: 17px;
}
.ant-table-tbody > tr {
  text-align: center;
}
.cou button {
  margin-left: 1162px;
}
</style>
