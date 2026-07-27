<template>
	<!-- prop是自定义的数据字段名，要与chang后的保持一致，h2pRender是renderjs的module名称 -->
	<view class="sp-html2pdf-render" :prop="domId" :change:prop="h2pRender.watchDomId">
		<!-- 导出的PDF会撑满宽度，所以请事先规范好要渲染盒子的宽度，PDF以一般A4纸大小尺寸，会自动分页 -->
		<!-- 默认带有插槽，但是具体是否要将渲染的dom盒子放入插槽中由开发者自行决定，导出结果只与domId有关 -->
		<slot></slot>
		<text :prop="expOver" :change:prop="h2pRender.watchExpOver"></text>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from '../../utils/index.js'
	export default {
		props: {
			// 要渲染dom的id
			domId: {
				type: String,
				default: '',
				require: true
			},
			// 是否显示导出loading
			showLoading: {
				type: Boolean,
				default: true
			},
			// 导出的pdf文件名，默认使用当前时间戳，已自动拼接后缀
			pdfFileName: {
				type: String,
				default: ''
			},
			// 是否自动打开文档
			autoOpen: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				expOver: 0,
				rendering: false,
				// #ifdef VUE2
				// #ifdef APP
				// 只有在Vue2的APP真机中需要先声明h2pRender，否则会报错，若未报错建议删除此处代码
				h2pRender: null
				// #endif
				// #endif
			}
		},
		methods: {
			// renderjs 收到触发后立即回执，把 expOver 置 0，避免 webviewReady 重同步反复截图
			ackRenderStart() {
				this.expOver = 0
			},
			renderOver(e) {
				// canvas渲染图片完成
				this.$emit('renderOver', e)
			},
			renderFail() {
				this.rendering = false
				this.expOver = 0
				uni.hideLoading()
				this.$emit('renderFail')
			},
			savePDF(e) {
				// pdf生成完成
				this.rendering = false
				this.expOver = 0
				this.$emit('beforeSavePDF', e)
				this.openPDF(e)
			},
			/**
			 * 手动打开pdf文档
			 * @param {Object} e pdf的base64字符串
			 */
			openPDF(e) {
				/**
				 * base64ToPath
				 * @param {Object} e base64字符串
				 * @param {String} name 导出的文件名（未命名则以当前时间戳命名，已自动拼接后缀）
				 */
				base64ToPath(e, this.pdfFileName)
					.then((path) => {
						uni.openDocument({
							filePath: path,
							success: () => {
								this.$emit('successSavePDF', path)
							},
							fail: (err) => {
								console.error('openDocument error', err)
							}
						})
					})
					.catch((error) => {
						console.error('base64ToPath error', error)
					})
					.finally(() => {
						this.rendering = false
						if (this.showLoading) uni.hideLoading()
					})
			},
			// 渲染事件
			async h2pRenderDom() {
				if (this.rendering) return
				this.rendering = true
				uni.showLoading({
					title: this.$t("生成中"),
					mask: true
				})

				// #ifdef H5
				await this.renderDom()
				// #endif
				// #ifndef H5
				// 等待视图层就绪后再触发 renderjs，避免 webviewReady / dom 未就绪
				this.$nextTick(() => {
					setTimeout(() => {
						// 使用时间戳而非 ++，并配合 ackRenderStart 置 0，防止视图层重挂载重复触发
						this.expOver = Date.now()
					}, 120)
				})
				// #endif
			}
		}
	}
</script>

<!-- renderjs目前仅支持内联使用 -->
<script module="h2pRender" lang="renderjs">
	import html2canvas from 'html2canvas';
	import JsPDF from 'jspdf'

	export default {
		data() {
			return {
				domIdValue: '',
				rendering: false,
				lastTrigger: 0
			}
		},
		methods: {
			async renderDom(retry = 0) {
				// app无法通过传参获取domId,也无法直接获取到script中data或props数据
				// 必须通过特定的监听方式,与script通信,获取其data
				try {
					const id = this.domIdValue || 'render-dom'
					const el = document.getElementById(id);
					if (!el) {
						if (retry < 8) {
							setTimeout(() => {
								this.renderDom(retry + 1)
							}, 250)
							return
						}
						console.error('dom盒子未加载成功，请先确保dom渲染完成，再检查你的domId是否有误');
						this.rendering = false
						this.$ownerInstance.callMethod('renderFail')
						return
					}

					// 截图前：只处理克隆层，不改真实页面，避免失败后图表被隐藏
					try {
						const main = document.querySelector('.render-main')
						if (main) main.scrollTop = 0
						window.scrollTo(0, 0)
						el.scrollTop = 0
					} catch (e) {}

					const contentH = Math.max(el.scrollHeight || 0, el.offsetHeight || 0)
					let scale = 2
					if (contentH > 9000) scale = 1
					else if (contentH > 6000) scale = 1.25
					else if (contentH > 3500) scale = 1.5

					const canvas = await html2canvas(el, {
						width: el.offsetWidth,
						height: contentH,
						windowWidth: el.offsetWidth,
						windowHeight: contentH,
						x: 0,
						y: 0,
						logging: false,
						useCORS: true,
						allowTaint: false,
						scale,
						backgroundColor: '#ffffff',
						imageTimeout: 5000,
						onclone: (clonedDoc) => {
							const clonedRoot = clonedDoc.getElementById(id)
							if (!clonedRoot) return
							// 非 dataURL 图片隐藏，防止 SecurityError
							clonedRoot.querySelectorAll('img').forEach((img) => {
								const src = img.getAttribute('src') || img.src || ''
								if (!src || src.indexOf('data:image') === 0) return
								img.style.display = 'none'
							})
							// 图表：从真实页面 canvas 导出一张图塞进克隆，避免双 canvas / 空白
							const liveBoxes = el.querySelectorAll('.charts-box')
							const cloneBoxes = clonedRoot.querySelectorAll('.charts-box')
							for (let i = 0; i < cloneBoxes.length; i++) {
								const liveBox = liveBoxes[i]
								const cloneBox = cloneBoxes[i]
								if (!cloneBox) continue
								let target = null
								if (liveBox) {
									const canvases = liveBox.querySelectorAll('canvas')
									for (let j = 0; j < canvases.length; j++) {
										const c = canvases[j]
										if ((!c.querySelector || !c.querySelector('canvas')) && c.width > 0 && c.height > 0) {
											target = c
										}
									}
								}
								cloneBox.innerHTML = ''
								if (target) {
									try {
										const img = clonedDoc.createElement('img')
										img.src = target.toDataURL('image/png')
										img.style.display = 'block'
										img.style.width = '100%'
										img.style.height = '280px'
										cloneBox.appendChild(img)
									} catch (e) {}
								}
							}
							// 其余 canvas 全部隐藏，防止截出两张图
							clonedRoot.querySelectorAll('canvas').forEach((c) => {
								c.style.display = 'none'
							})
						}
					});

					let base64 = ''
					try {
						base64 = canvas.toDataURL('image/png', 1)
					} catch (secErr) {
						base64 = canvas.toDataURL('image/jpeg', 0.92)
					}
					this.$ownerInstance.callMethod('renderOver', base64);
					this.createPDF(canvas)
					this.rendering = false
				} catch (err) {
					console.log('==== err :', err);
					this.rendering = false
					this.$ownerInstance.callMethod('renderFail')
				}
			},
			// 监听方式,与script通信,获取其data
			watchDomId(newValue, oldValue, ownerInstance, instance) {
				if (newValue) {
					this.domIdValue = newValue
				}
			},
			watchExpOver(newValue, oldValue, ownerInstance, instance) {
				// 初始 0 不触发；同值重同步 / 置 0 回执 不触发，避免 webviewReady not match 死循环
				if (!newValue || newValue === oldValue) return
				if (this.rendering || newValue === this.lastTrigger) return
				this.lastTrigger = newValue
				this.rendering = true
				// 立刻回执逻辑层清零，防止视图层重挂载后再次带入旧值触发截图
				ownerInstance.callMethod('ackRenderStart')
				this.renderDom(0)
			},
			createPDF(canvas) {
				const a4width = 592.28
				const a4height = 841.89
				const margin = 12
				const usableH = a4height - margin * 2
				const contentWidth = canvas.width
				const contentHeight = canvas.height
				const imgWidth = a4width - margin * 2
				// 一页可放的内容高度（canvas 像素）
				const pageHeight = (contentWidth / imgWidth) * usableH
				const pdf = new JsPDF('', 'pt', 'a4')

				// 不可断开区域（趋势图等）
				const keepRanges = []
				try {
					const root = document.getElementById(this.domIdValue || 'render-dom')
					if (root && root.offsetWidth) {
						const scale = canvas.width / root.offsetWidth
						const rootRect = root.getBoundingClientRect()
						root.querySelectorAll('.pdf-keep-together').forEach((node) => {
							const r = node.getBoundingClientRect()
							keepRanges.push({
								top: (r.top - rootRect.top) * scale,
								bottom: (r.bottom - rootRect.top) * scale
							})
						})
					}
				} catch (e) {}

				const adjustKeep = (startY, endY) => {
					let y = endY
					for (let i = 0; i < keepRanges.length; i++) {
						const range = keepRanges[i]
						if (startY < range.top && y > range.top && y < range.bottom) {
							if (range.bottom - startY <= pageHeight) {
								y = range.bottom
							} else {
								y = range.top
							}
						} else if (startY >= range.top && startY < range.bottom && y < range.bottom) {
							if (range.bottom - startY <= pageHeight) {
								y = range.bottom
							}
						}
					}
					if (y <= startY + 8) {
						y = Math.min(startY + pageHeight, contentHeight)
					}
					return Math.min(y, contentHeight)
				}

				// 在理想分页线附近找空白行，避免切断文字
				const findQuietBreak = (startY, idealEndY) => {
					if (idealEndY >= contentHeight) return contentHeight
					let ctx
					try {
						ctx = canvas.getContext('2d')
						if (!ctx) return adjustKeep(startY, idealEndY)
					} catch (e) {
						return adjustKeep(startY, idealEndY)
					}
					const searchFrom = Math.max(startY + Math.floor(pageHeight * 0.55), idealEndY - 120)
					let bestY = idealEndY
					let bestInk = Infinity
					const step = 2
					const sampleStep = Math.max(4, Math.floor(contentWidth / 80))
					for (let y = idealEndY; y >= searchFrom; y -= step) {
						let row
						try {
							row = ctx.getImageData(0, Math.floor(y), contentWidth, 1).data
						} catch (e) {
							return adjustKeep(startY, idealEndY)
						}
						let ink = 0
						for (let x = 0; x < contentWidth; x += sampleStep) {
							const i = x * 4
							if (row[i] < 248 || row[i + 1] < 248 || row[i + 2] < 248) ink++
						}
						if (ink < bestInk) {
							bestInk = ink
							bestY = y
							if (ink <= 1) break
						}
					}
					return adjustKeep(startY, bestY)
				}

				const addSlice = (startY, endY, pageIndex) => {
					const h = Math.max(1, Math.floor(endY - startY))
					const slice = document.createElement('canvas')
					slice.width = contentWidth
					slice.height = h
					const sctx = slice.getContext('2d')
					sctx.fillStyle = '#ffffff'
					sctx.fillRect(0, 0, contentWidth, h)
					sctx.drawImage(canvas, 0, startY, contentWidth, h, 0, 0, contentWidth, h)
					let data
					try {
						data = slice.toDataURL('image/jpeg', 0.92)
					} catch (e) {
						data = slice.toDataURL('image/png', 1)
					}
					const hPt = (imgWidth / contentWidth) * h
					if (pageIndex > 0) pdf.addPage()
					pdf.addImage(data, 'JPEG', margin, margin, imgWidth, hPt)
				}

				if (contentHeight <= pageHeight) {
					addSlice(0, contentHeight, 0)
				} else {
					let startY = 0
					let pageIndex = 0
					while (startY < contentHeight - 1) {
						const idealEnd = Math.min(startY + pageHeight, contentHeight)
						const endY = findQuietBreak(startY, idealEnd)
						addSlice(startY, endY, pageIndex)
						startY = endY
						pageIndex++
						if (pageIndex > 60) break
					}
				}

				// #ifdef H5
				let base64Str = pdf.output('dataurlstring');
				this.$ownerInstance.callMethod('savePDF', base64Str)
				// #endif

				// #ifdef APP
				if (plus.os.name == 'Android') {
					let base64Str = pdf.output('dataurlstring');
					this.$ownerInstance.callMethod('savePDF', base64Str)
				} else {
					let base64Str = pdf.output('dataurlstring');
					this.$ownerInstance.callMethod('savePDF', base64Str)
				}
				// #endif
			}
		}
	}
</script>

<style>
	.sp-html2pdf-render {
		position: relative;
	}
</style>