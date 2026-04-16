/**
 * imageToPdf.js - 5+ 环境终极兼容版
 */

import JsPDF from 'jspdf';

class ImageToPdfConverter {
	readLocalFile(filePath) {
		return new Promise((resolve, reject) => {
			const absolutePath = filePath.startsWith('file://') ? filePath : 'file://' + filePath;
			plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
				entry.file((file) => {
					const reader = new plus.io.FileReader();
					reader.onloadend = (e) => resolve(e.target.result);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				}, reject);
			}, reject);
		});
	}

	savePdfFile(pdfData, fileName) {
		return new Promise((resolve, reject) => {
			const filePath = `_doc/${fileName}`;

			console.log('5.1 请求文件系统...');
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
				console.log('5.2 获取文件条目...');

				fs.root.getFile(filePath, {
					create: true
				}, (fileEntry) => {
					console.log('5.3 创建写入器...');

					fileEntry.createWriter((writer) => {
						console.log('5.4 写入器创建成功');

						writer.onwrite = () => {
							// ✅ 修复：直接使用文件条目的路径，不再重复转换
							let fullPath = fileEntry.fullPath;

							// 如果是 iOS，可能需要转换为可访问的路径
							if (plus.os.name === 'iOS') {
								// fullPath 已经是完整路径，直接使用
								console.log('5.6 PDF保存成功(iOS):', fullPath);
							} else {
								// Android 可能需要转换
								fullPath = plus.io.convertLocalFileSystemURL(
									fileEntry.fullPath);
							}

							console.log('5.6 PDF保存成功:', fullPath);
							resolve(fullPath);
						};

						writer.onerror = (e) => {
							console.error('5.6 写入失败:', JSON.stringify(e));
							reject(new Error('写入失败: ' + JSON.stringify(e)));
						};

						try {
							if (typeof writer.writeBlob !== 'undefined') {
								const blob = new Blob([pdfData], {
									type: 'application/pdf'
								});
								writer.writeBlob(blob);
							} else {
								console.log('5.5 使用备用方案写入...');
								const base64 = this._arrayBufferToBase64Fast(
									pdfData);
								writer.writeAsBinary(base64);
							}
						} catch (e) {
							console.error('写入异常:', e);
							reject(e);
						}
					}, (e) => {
						console.error('创建Writer失败:', e);
						reject(new Error('创建Writer失败: ' + JSON.stringify(e)));
					});
				}, (e) => {
					console.error('获取文件失败:', e);
					reject(new Error('获取文件失败: ' + JSON.stringify(e)));
				});
			}, (e) => {
				console.error('请求文件系统失败:', e);
				reject(new Error('请求文件系统失败: ' + JSON.stringify(e)));
			});
		});
	}




	_arrayBufferToBase64Fast(buffer) {
		const bytes = new Uint8Array(buffer);
		let result = '';
		const chunkSize = 0x8000;

		for (let i = 0; i < bytes.length; i += chunkSize) {
			const chunk = bytes.subarray(i, i + chunkSize);
			result += String.fromCharCode.apply(null, chunk);
		}
		return btoa(result);
	}

	async savePdfFileAlternative(pdfData, fileName) {
		return new Promise((resolve, reject) => {
			const filePath = `_doc/${fileName}`;
			const base64Data = this._arrayBufferToBase64Fast(pdfData);

			plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
				entry.getFile(fileName, {
					create: true
				}, (fileEntry) => {
					fileEntry.createWriter((writer) => {
						writer.onwrite = () => {
							// ✅ 修复：正确获取文档目录路径
							const docDir = plus.io.convertLocalFileSystemURL(
								'_doc/');
							const fullPath = docDir + fileName;
							console.log('PDF保存成功(备选方案):', fullPath);
							resolve(fullPath);
						};
						writer.onerror = reject;
						writer.writeAsBinary(base64Data);
					}, reject);
				}, reject);
			}, reject);
		});
	}
	async convertAndSave(imagePath, pdfFileName) {
		try {
			console.log('1. 读取图片:', imagePath);
			const imageBase64 = await this.readLocalFile(imagePath);
			console.log('2. 图片读取完成, 长度:', imageBase64.length);

			console.log('3. 生成PDF...');

			const pdf = new JsPDF({
				unit: 'pt',
				format: 'a4',
				compress: true
			});

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			console.log('PDF尺寸(pt):', pageWidth, 'x', pageHeight);

			pdf.setFillColor(255, 255, 255);
			pdf.rect(0, 0, pageWidth, pageHeight, 'F');

			const imgProps = pdf.getImageProperties(imageBase64);
			const imgRatio = imgProps.width / imgProps.height;
			const pageRatio = pageWidth / pageHeight;

			let imgWidth, imgHeight, x, y;
			if (imgRatio > pageRatio) {
				imgWidth = pageWidth;
				imgHeight = pageWidth / imgRatio;
				x = 0;
				y = (pageHeight - imgHeight) / 2;
			} else {
				imgHeight = pageHeight;
				imgWidth = pageHeight * imgRatio;
				x = (pageWidth - imgWidth) / 2;
				y = 0;
			}

			let format = 'JPEG';
			if (imageBase64.includes('image/png')) {
				format = 'PNG';
			} else if (imageBase64.includes('image/jpeg')) {
				format = 'JPEG';
			}

			pdf.addImage(imageBase64, format, x, y, imgWidth, imgHeight, undefined, 'FAST');

			const pdfData = pdf.output('arraybuffer');
			console.log('4. PDF生成完成, 长度:', pdfData.byteLength);

			const header = new Uint8Array(pdfData.slice(0, 5));
			const headerStr = String.fromCharCode(...header);
			console.log('PDF头部:', headerStr);

			if (headerStr !== '%PDF-') {
				throw new Error('PDF头部无效: ' + headerStr);
			}

			console.log('5. 开始保存...');

			try {
				return await this.savePdfFile(pdfData, pdfFileName);
			} catch (primaryError) {
				console.warn('主保存方案失败，尝试备选方案:', primaryError);
				return await this.savePdfFileAlternative(pdfData, pdfFileName);
			}
		} catch (error) {
			console.error('转换失败:', error);
			throw error;
		}
	}
}

const converter = new ImageToPdfConverter();

export async function imageToPdfAndSave(imagePath, fileName) {
	try {
		console.log(`[PDF生成] 开始转换图片: ${imagePath}`);
		console.log(`[PDF生成] 目标文件名: ${fileName}`);
		
		// 调用实际的转换和保存方法
		const savedPath = await converter.convertAndSave(imagePath, fileName);
		
		console.log(`[PDF生成] 保存的路径: ${savedPath}`);
		
		// 验证文件是否存在
		return new Promise((resolve, reject) => {
			// 直接使用返回的路径验证
			plus.io.resolveLocalFileSystemURL(savedPath, (entry) => {
				entry.file((file) => {
					if (file.size > 0) {
						console.log(`[PDF生成] 成功，文件大小: ${file.size}`);
						console.log(`[PDF生成] 文件路径: ${savedPath}`);
						resolve(savedPath);
					} else {
						reject(new Error('生成的PDF文件大小为0'));
					}
				}, (err) => {
					reject(new Error(`无法获取文件信息: ${err.message}`));
				});
			}, (err) => {
				console.error('文件不存在:', savedPath);
				// 尝试备用路径
				const docPath = plus.io.convertLocalFileSystemURL('_doc/');
				const fallbackPath = docPath + fileName;
				console.log('尝试备用路径:', fallbackPath);
				
				plus.io.resolveLocalFileSystemURL(fallbackPath, (entry) => {
					entry.file((file) => {
						if (file.size > 0) {
							console.log(`[PDF生成] 备用路径成功，文件大小: ${file.size}`);
							resolve(fallbackPath);
						} else {
							reject(new Error(`PDF文件未找到: ${err.message}`));
						}
					});
				}, (fallbackErr) => {
					reject(new Error(`PDF文件未找到: ${err.message}`));
				});
			});
		});
	} catch (err) {
		console.error('[PDF生成] 失败:', err);
		throw err;
	}
}




export default ImageToPdfConverter;