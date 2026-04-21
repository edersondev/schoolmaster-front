import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { ElButtonStub, ElInputStub } from '@/__tests__/adminTestUtils'

const pushMock = vi.hoisted(() => vi.fn())
const fetchSchoolsMock = vi.hoisted(() => vi.fn())
const fetchReferenceDataMock = vi.hoisted(() => vi.fn())
const fetchSchoolAddressesMock = vi.hoisted(() => vi.fn())
const deleteSchoolMock = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())
const confirmMock = vi.hoisted(() => vi.fn())

const storeState = vi.hoisted(() => ({
  schools: [],
  schoolAddressesBySchoolId: {},
  referenceData: {
    administrativeTypes: [],
  },
  loading: false,
  error: null,
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/stores/schoolStore', () => ({
  useSchoolStore: () => ({
    ...storeState,
    fetchSchools: fetchSchoolsMock,
    fetchReferenceData: fetchReferenceDataMock,
    fetchSchoolAddresses: fetchSchoolAddressesMock,
    deleteSchool: deleteSchoolMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    error: messageError,
  },
  ElMessageBox: {
    confirm: confirmMock,
  },
}))

vi.mock('@/components/admin/schools/AdminSchoolsTable.vue', () => ({
  default: defineComponent({
    name: 'AdminSchoolsTable',
    props: {
      schools: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['edit', 'delete'],
    setup(props, { emit }) {
      return () =>
        h('div', [
          h('p', `Rows: ${props.schools.length}`),
          h('button', { onClick: () => emit('edit', props.schools[0]) }, 'Emit Edit'),
          h('button', { onClick: () => emit('delete', props.schools[0]) }, 'Emit Delete'),
        ])
    },
  }),
}))

import AdminSchoolsListPage from './AdminSchoolsListPage.vue'

describe('AdminSchoolsListPage', () => {
  beforeEach(() => {
    pushMock.mockReset()
    fetchSchoolsMock.mockReset()
    fetchReferenceDataMock.mockReset()
    fetchSchoolAddressesMock.mockReset()
    deleteSchoolMock.mockReset()
    messageSuccess.mockClear()
    messageError.mockClear()
    confirmMock.mockReset()

    storeState.schools = [
      { id: 1, name: 'School A', email: 'a@test.com', document: '11111111000111', administrative_type_id: 1 },
      { id: 2, name: 'School B', email: 'b@test.com', document: '22222222000122', administrative_type_id: 2 },
    ]
    storeState.schoolAddressesBySchoolId = {
      '1': { city: 'Campinas', state: 'SP' },
      '2': { city: 'Santos', state: 'SP' },
    }
    storeState.referenceData = {
      administrativeTypes: [
        { id: 1, label: 'Public' },
        { id: 2, label: 'Private' },
      ],
    }
    storeState.loading = false
    storeState.error = null

    fetchSchoolsMock.mockResolvedValue(storeState.schools)
    fetchReferenceDataMock.mockResolvedValue(storeState.referenceData)
    fetchSchoolAddressesMock.mockResolvedValue(storeState.schoolAddressesBySchoolId)
    deleteSchoolMock.mockResolvedValue(null)
    confirmMock.mockResolvedValue(true)
  })

  it('loads all school dependencies on mount', async () => {
    const wrapper = mount(AdminSchoolsListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    expect(fetchSchoolsMock).toHaveBeenCalledTimes(1)
    expect(fetchReferenceDataMock).toHaveBeenCalledTimes(1)
    expect(fetchSchoolAddressesMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Rows: 2')
  })

  it('filters schools by city and navigates to edit page', async () => {
    const wrapper = mount(AdminSchoolsListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('campinas')
    await flushPromises()

    expect(wrapper.text()).toContain('Rows: 1')

    const editButton = wrapper.findAll('button').find((node) => node.text() === 'Emit Edit')
    await editButton.trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/admin/schools/1/edit')
  })

  it('deletes a school from table action', async () => {
    const wrapper = mount(AdminSchoolsListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const deleteButton = wrapper.findAll('button').find((node) => node.text() === 'Emit Delete')
    await deleteButton.trigger('click')
    await flushPromises()

    expect(confirmMock).toHaveBeenCalledTimes(1)
    expect(deleteSchoolMock).toHaveBeenCalledWith(1)
    expect(messageSuccess).toHaveBeenCalledWith('School deleted successfully!')
  })
})
