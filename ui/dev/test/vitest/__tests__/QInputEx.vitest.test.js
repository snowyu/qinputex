import { config, mount } from '@vue/test-utils'
// import QInputExComponent from 'quasar-ui-qinputex/src/components/QInputEx/QInputEx.vue' // Import the component
import * as QInputExPlugin from 'quasar-ui-qinputex/src/vue-plugin'

import { nextTick } from 'vue';
import { QInput, QSelect, QBtn, QPopupProxy, QChip, QDate } from 'quasar';
// import QInputHistory from 'quasar-ui-qinputex/src/components/QInputEx/QInputHistory.vue';

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createI18n } from 'vue-i18n'
import messages from '../../../src/i18n'

const QInputExComponent = QInputExPlugin.QInputEx
const QInputHistory = QInputExPlugin.QInputHistory;

installQuasarPlugin({
  components: {
    QInput, QSelect, QBtn, QPopupProxy, QDate, QChip, // QInputHistory // Explicitly register components
  }
})

// Create a mock i18n instance
const i18n = createI18n({
  legacy: false, // For Composition API
  allowComposition: true, // For Composition API
  locale: 'zh-hans',
  fallbackLocale: 'en-us',
  messages,
});

// Set it as a global plugin in Vue Test Utils config
config.global.plugins.push(i18n);
config.global.plugins.push(QInputExPlugin);

describe('QInputEx', () => {
  test('should mount successfully', async () => {
    const wrapper = mount(QInputExComponent)
    expect(wrapper.exists()).to.be.true;
  })

  test('should have default type "text" and render QInput', async () => {
    const wrapper = mount(QInputExComponent);
    const qInput = wrapper.findComponent(QInput);
    expect(qInput.exists()).to.be.true;
    expect(qInput.props('type')).to.equal('text');
  });

  test('should update modelValue', async () => {
    const wrapper = mount(QInputExComponent, { props: { modelValue: 'initial' } });
    expect(wrapper.props('modelValue')).to.equal('initial');

    await wrapper.setProps({ modelValue: 'updated' });
    expect(wrapper.props('modelValue')).to.equal('updated');
  });

  test('should emit update:modelValue when internal value changes', async () => {
    const wrapper = mount(QInputExComponent);
    const qInput = wrapper.findComponent(QInput);

    await qInput.setValue('new value');
    const emitted = wrapper.emitted()['update:modelValue']
    expect(emitted[0][0]).to.equal('');
    expect(emitted[1][0]).to.equal('new value');
  });

  test('should change type to "number" and render QInput with type number', async () => {
    const wrapper = mount(QInputExComponent, { props: { type: 'number' } });
    const qInput = wrapper.findComponent(QInput);
    expect(qInput.exists()).to.be.true;
    expect(qInput.props('type')).to.equal('number');
  });

  test('should change type to "date" and render QInput with append icon', async () => {
    const wrapper = mount(QInputExComponent, { props: { type: 'date' } });
    const qInput = wrapper.findComponent(QInput);
    expect(qInput.exists()).to.be.true;
    expect(qInput.props('type')).to.equal('text'); // QInput type remains text for date
    expect(qInput.find('.q-field__append .q-icon').exists()).to.be.true;
    expect(qInput.find('.q-field__append .q-icon').text()).to.equal('event');
  });

  test('should open QDate popup when append icon is clicked for date type', async () => {
    const wrapper = mount(QInputExComponent, { props: { type: 'date' } });
    const qInput = wrapper.findComponent(QInput);
    const appendButton = qInput.findComponent(QBtn);

    expect(appendButton.exists()).to.be.true;
    await appendButton.trigger('click');
    await nextTick();

    const popup = wrapper.findComponent(QPopupProxy);
    expect(popup.exists()).to.be.true;

    const qDate = wrapper.findComponent(QDate);
    expect(qDate.exists()).to.be.true;
  });

  test('should change type to "select" and render QSelect', async () => {
    const wrapper = mount(QInputExComponent, { props: { type: 'select' } });
    const qSelect = wrapper.findComponent(QSelect);
    expect(qSelect.exists()).to.be.true;
  });

  test('should call focus method on QInput', async () => {
    const wrapper = mount(QInputExComponent);
    const qInput = wrapper.findComponent(QInput);
    const focusSpy = vi.spyOn(qInput.vm, 'focus');

    wrapper.vm.focus();
    await nextTick();
    expect(focusSpy).toHaveBeenCalled();
  });

  test('should call resetValidation method on QInput', async () => {
    const wrapper = mount(QInputExComponent);
    const qInput = wrapper.findComponent(QInput);
    const resetValidationSpy = vi.spyOn(qInput.vm, 'resetValidation');

    wrapper.vm.resetValidation();
    await nextTick();
    expect(resetValidationSpy).toHaveBeenCalled();
  });

  test('should return popup reference via getPopup method', async () => {
    const wrapper = mount(QInputExComponent, { props: { type: 'date' } });
    const qInput = wrapper.findComponent(QInput);
    const appendButton = qInput.findComponent(QBtn);

    await appendButton.trigger('click');
    await nextTick();

    const popupRef = wrapper.vm.getPopup();
    expect(popupRef).to.not.be.null;
    expect(popupRef.hide).to.be.a('function');
  });

  test('should handle "search" type correctly', async () => {
    const onSearch = vi.fn();
    const wrapper = mount(QInputExComponent, {
      props: {
        type: 'search',
        modelValue: 'test search',
        onSearch,
      }
    });
    const qInput = wrapper.findComponent(QInput);
    const qInputHistory = wrapper.findComponent(QInputHistory);
    expect(qInputHistory.exists()).to.be.true;

    // Test keyup.enter
    await qInput.trigger('keyup.enter');
    expect(onSearch).toHaveBeenCalledWith('test search');

    // Test append icon click
    onSearch.mockClear();
    const appendButton = qInput.findComponent(QBtn);
    await appendButton.trigger('click');
    expect(onSearch).toHaveBeenCalledWith('test search');

    // Test QInputHistory click
    onSearch.mockClear();

    // Simulate history data and click
    await wrapper.setProps({ type: { name: 'search', history: ['old search', 'another search'] } });
    await nextTick();

    const historyChip = wrapper.find('.q-chip');
    expect(historyChip.exists()).to.be.true;
    await historyChip.trigger('click');
    await nextTick();

    expect(qInput.props('modelValue')).toBe('old search');
    expect(onSearch).toHaveBeenCalledWith('old search');
  });
});
