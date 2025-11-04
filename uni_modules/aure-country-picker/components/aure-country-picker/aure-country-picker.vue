<template>
  <!-- 当前区号展示区 -->
  <view class="picker-display" @click="open">
    <image v-if="currentSelectInfo.code"  class="flag" :src="getFlagSrc(currentSelectInfo.code)" mode="widthFix" />
    <text class="code">+{{ currentSelectInfo.dial_code || '--' }}</text>
  </view>

  <!-- 遮罩和弹窗 -->
  <view v-if="mounted" class="popup-mask" @touchmove.stop.prevent @click="onMaskClick">
    <view
        class="popup-panel"
        :class="[
        `popup-panel--${position}`,
        { 'popup-panel--show': showPopup }
      ]"
        :style="panelStyle"
        @transitionend="onAnimEnd"
        @click.stop
    >
      <!-- 顶部标题/取消 -->
      <view class="popup-header">
        <text class="title">{{ title }}</text>
        <text class="cancel" @click="close">{{cancelText}}</text>
      </view>
      <!-- 搜索 -->
      <view class="popup-search">
        <input
            class="search-input"
            v-model="search"
            :placeholder="searchPlaceholder"
            @keyup.enter.native="clearSearch"
        />
      </view>
      <!-- 列表 -->
      <scroll-view scroll-y class="popup-list">
        <view
            v-for="item in filteredList"
            :key="item.code + item.dial_code"
            class="popup-item"
            @click="select(item)"
        >
          <image class="flag" :src="getFlagSrc(item.code)" mode="widthFix"></image>
          <text class="name">{{ item.localName }}</text>
          <text class="code">+{{ item.dial_code }}</text>
        </view>
        <view class="safe-area-bottom-height"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import countryListRaw from './country-data.js'

export default {
  name: "aure-country-picker",
  props: {
    /**
     * v-model 当前选中项（对象），结构同 country-data.js
     */
    modelValue: [String, Number],
    /**
     * 国家 Code 默认值（如 'US'、'CA'）
     * 用于 dial_code 重复时辅助定位国家（如 1 可对应多个）
     */
    defaultCountryCode: {
      type: String,
      default: '',
    },
    /**
     * 取消按钮文案
     * */
    cancelText: {
      type: String, default: '取消'
    },
    /**
     * 搜索框占位符
     * */
    searchPlaceholder: {
      type: String, default: '搜索国家或地区'
    },
    /**
     * 弹窗标题
     */
    title: { type: String, default: '选择国家/地区' },
    /**
     * bottom/top弹窗高度（如 '80vh'、'480rpx'、'80%'）
     */
    height: { type: String, default: '80vh' },
    /**
     * left/right弹窗宽度如 '80vw'、'480rpx'、'80%'）
     */
    width: { type: String, default: '80vw' },
    /**
     * 弹窗动画时长（ms）
     */
    duration: { type: Number, default: 300 },
    /**
     * 是否允许点击遮罩关闭弹窗
     */
    maskClosable: { type: Boolean, default: true },
    /**
     * 是否圆角
     */
    round: { type: Boolean, default: true },
    /**
     * 圆角半径
     */
    radius: { type: String, default: '24rpx' },
    /**
     * 弹窗弹出方向
     */
    position: {
      type: String,
      default: 'bottom', // bottom | top | left | right
      validator: v => ['bottom', 'top', 'left', 'right'].includes(v)
    },
    /**
     * （高级）自定义数据源，结构与 country-data.js 相同
     */
    countryList: { type: Array, default: () => countryListRaw }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      currentSelectInfo: {
        name: '',
        code: '',
        dial_code: '',
        localName: ''
      },
      mounted: false,
      showPopup: false,
      search: '',
      realSelected: null
    }
  },
  computed: {
    // 实际展示的国家数据
    realCountryList() {
      return this.countryList && this.countryList.length > 0
          ? this.countryList
          : countryListRaw;
    },
    filteredList() {
      const key = this.search.trim().toLowerCase();
      if (!key) return this.realCountryList;

      return this.realCountryList.filter(item => {
        // 支持本地名、英文名、区号、ISO码
        const name = (item.name || '').toLowerCase();
        const localName = (item.localName || '').toLowerCase();
        const code = (item.code || '').toLowerCase();
        const dial_code = (item.dial_code || '');

        return (
            name.includes(key) ||
            localName.includes(key) ||
            code.includes(key) ||
            (dial_code && dial_code.startsWith(key))
        );
      });
    },
    panelStyle() {
      // 动画/宽高/圆角全部参数驱动
      let style = {
        transition: `transform ${this.duration}ms cubic-bezier(.4,0,.2,1)`
      }
      if (this.position === 'bottom' || this.position === 'top') {
        style.width = '100vw'
        style.height = this.height
      } else {
        style.width = this.width || '80vw'
        style.height = '100vh'
      }
      if (this.round) {
        if (this.position === 'bottom') style.borderRadius = `${this.radius} ${this.radius} 0 0`
        else if (this.position === 'top') style.borderRadius = `0 0 ${this.radius} ${this.radius}`
        else if (this.position === 'left') style.borderRadius = `0 ${this.radius} ${this.radius} 0`
        else if (this.position === 'right') style.borderRadius = `${this.radius} 0 0 ${this.radius}`
      } else {
        style.borderRadius = '0'
      }
      return style
    }
  },
  mounted() {
    // ✅ 优先使用 v-model（即 modelValue）作为 dial_code 筛选依据
    if (this.modelValue) {
      const matchedList = this.realCountryList.filter(
          i => String(i.dial_code) === String(this.modelValue)
      );

      // 1: 若仅匹配到一个，直接选中
      if (matchedList.length === 1) {
        this.currentSelectInfo = matchedList[0];

        // 2: 若匹配到多个（如 +1），则使用 initialCountry 精准定位
      } else if (matchedList.length > 1 && this.defaultCountryCode) {
        const precise = matchedList.find(i => i.code === this.defaultCountryCode.toUpperCase());
        if (precise) {
          this.currentSelectInfo = precise;
        } else {
          // 如果 initialCountry 没找到，默认用第一个匹配项
          this.currentSelectInfo = matchedList[0];
        }

        // 3: 无法匹配则默认空处理
      } else if (matchedList.length > 0) {
        this.currentSelectInfo = matchedList[0];
      }
    }
  },
  methods: {
    open() {
      this.mounted = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.showPopup = true
        }, 20)
      })
    },
    close() {
      this.showPopup = false
    },
    onMaskClick() {
      if (!this.maskClosable) return
      this.close()
    },
    onAnimEnd() {
      if (!this.showPopup) {
        this.mounted = false
        this.search = ''
      }
    },
    select(item) {
      this.$emit('update:modelValue', item.dial_code)
      this.$emit('change', item);
      this.onSelected(item);
      this.close()
    },
    onSelected(selectItem) {
      // 必须 code 和 dial_code 同时一致才算唯一国家
      this.currentSelectInfo = this.realCountryList.find(
          item =>
              String(item.code) === String(selectItem.code) &&
              String(item.dial_code) === String(selectItem.dial_code)
      );
    },
    getFlagSrc(code) {
      return `/uni_modules/aure-country-picker/static/flags/${code.toLowerCase()}.png`
    },
    clearSearch() {
      this.search = ''
    }
  }
}
</script>

<style scoped>
/* 选择显示区 */
.picker-display {
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  border-radius: 12rpx;
  background: #fff;
  cursor: pointer;
}
.flag {
  width: 36rpx;
  margin-right: 12rpx;
}
.code {
  font-size: 28rpx;
}
.arrow {
  margin-left: auto;
  color: #bbb;
  font-size: 30rpx;
}
/* 遮罩层 */
.popup-mask {
  position: fixed;
  z-index: 9999;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
/* 弹窗内容：四方向动画（无三方依赖） */
.popup-panel {
  background: #fff;
  box-shadow: 0 -8rpx 32rpx 0 rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 默认底部弹窗初始状态 */
  transform: translateY(100%);
  opacity: 1;
}
.popup-panel--bottom {
  position: relative;
}
.popup-panel--bottom.popup-panel--show {
  transform: translateY(0);
}
.popup-panel--top {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
}
.popup-panel--top.popup-panel--show {
  transform: translateY(0);
}
.popup-panel--left {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80vw;
  transform: translateX(-100%);
}
.popup-panel--left.popup-panel--show {
  transform: translateX(0);
}
.popup-panel--right {
  position: absolute;
  right: 0;
  top: 0;
  height: 100vh;
  width: 80vw;
  transform: translateX(100%);
}
.popup-panel--right.popup-panel--show {
  transform: translateX(0);
}
.popup-header {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
}
.title {
  font-size: 28rpx;
}
.cancel {
  color: #222222;
  font-size: 28rpx;
}
.popup-search {
  padding: 20rpx 32rpx;
  background: #fafafa;
}
.search-input {
  height: 68rpx;
  padding: 0 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #eeeeee;
  border: none;
  outline: none;
}
.popup-list {
  flex: 1;
  min-height: 0;
  background: #fff;
}
.popup-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f4f4f4;
  font-size: 30rpx;
  cursor: pointer;
}
.safe-area-bottom-height {
  height: env(safe-area-inset-bottom);
}
.popup-item .flag {
  width: 48rpx;
  margin-right: 18rpx;
}
.popup-item .name {
  flex: 1;
  font-size: 28rpx;
  color: #222222;
}
.popup-item .code {
  color: #222222;
  font-size: 28rpx;
}
</style>