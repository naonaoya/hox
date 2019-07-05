<template>
  <page-view>
    <!-- 表单弹窗 -->
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
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }"></a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div>
      <!-- table -->
      <a-card>
        <a-button type="primary" class="editable-add-btn" @click="newMember">
          <a-icon type="plus-circle" />新增消息
        </a-button>
        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
          <template
            v-for="(col, i) in ['name', 'workId', 'department', 'count', 'createTime']"
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
      </a-card>
    </div>
  </page-view>
</template>
<script>
import RepositoryForm from '../form/advancedForm/AdvancedForm'
import TaskForm from '../form/advancedForm/TaskForm'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'

export default {
  name: 'AdvancedForm',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm,
    PageView
  },
  data() {
    return {
      description: '高级表单常见于一次性输入和提交大批量数据的场景。',
      loading: false,
      memberLoading: false,
      loading: false,
      visible: false,

      // table
      columns: [
        {
          title: '标题信息',
          dataIndex: 'name',
          key: 'name',
          width: '17%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '推送方式',
          dataIndex: 'workId',
          key: 'workId',
          width: '17%',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '推送内容',
          dataIndex: 'department',
          key: 'department',
          width: '17%',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '推送时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: '17%',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '推送人群',
          dataIndex: 'count',
          key: 'count',
          width: '17%',
          scopedSlots: { customRender: 'count' }
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
          department: '行政部',
          createTime: '1998-09-14',
          count: '001'
        },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部',
          createTime: '1998-09-14',
          count: '001'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部',
          createTime: '1998-09-14',
          count: '001'
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
      this.visible = true
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        count: '',
        createTime: '',
        editable: true,
        isNew: true
      })
    },
    handleOk(e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 3000)
    },
    handleCancel(e) {
      this.visible = false
    },
    //删除信息
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(record) {
      this.memberLoading = true
      const { key, name, workId, department, createTime, count } = record
      if (!name || !workId || !department || !createTime || !count) {
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

    //绑定文本框输入的值
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },

    //取消编辑操作
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    }
  }
}
</script>
<style scoped>
.editable-add-btn {
  margin-bottom: 10px;
}
</style>
