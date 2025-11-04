class LogManager {
	constructor() {
		this.logPath = '_doc/log.txt';
		this.maxFileSize = 5 * 1024 * 1024; // 5MB
	}

	// 写入日志
	writeLog(logContent, level = 'INFO') {
		if (typeof logContent !== 'string') {
			logContent = JSON.stringify(logContent, null, 2);
		}

		const timestamp = new Date().toISOString();
		const finalContent = `[${timestamp}] [${level}] ${logContent}\n`;

		this._appendToFile(finalContent);
	}

	// 快捷方法
	info(content) {
		this.writeLog(content, 'INFO');
	}

	error(content) {
		this.writeLog(content, 'ERROR');
	}

	warn(content) {
		this.writeLog(content, 'WARN');
	}

	debug(content) {
		this.writeLog(content, 'DEBUG');
	}

	// 追加到文件
	_appendToFile(content) {
		plus.io.resolveLocalFileSystemURL(this.logPath, (entry) => {
			// 文件存在，检查大小
			this._checkFileSize(entry, () => {
				this._doWrite(entry, content);
			});
		}, (e) => {
			// 文件不存在，创建并写入
			this._createAndWrite(content);
		});
	}

	// 执行写入操作
	_doWrite(fileEntry, content) {
		fileEntry.createWriter((writer) => {
			writer.onerror = (e) => {
				console.error("Write failed: " + e.message);
			};
			writer.onwrite = () => {
				console.log("Log write success");
			};
			writer.seek(writer.length);
			writer.write(content);
		}, (e) => {
			console.error("Create writer failed: " + e.message);
		});
	}

	// 创建文件并写入
	_createAndWrite(content) {
		plus.io.resolveLocalFileSystemURL('_doc', (rootEntry) => {
			rootEntry.getFile('log.txt', {
				create: true
			}, (fileEntry) => {
				this._doWrite(fileEntry, content);
			}, (e) => {
				console.error("Create file failed: " + e.message);
			});
		}, (e) => {
			console.error("Resolve doc directory failed: " + e.message);
		});
	}

	// 检查文件大小，如果过大则轮转
	_checkFileSize(fileEntry, callback) {
		fileEntry.file((file) => {
			if (file.size > this.maxFileSize) {
				this._rotateLogFile(fileEntry, callback);
			} else {
				callback();
			}
		}, (e) => {
			console.error("Get file info failed: " + e.message);
			callback();
		});
	}

	// 日志文件轮转
	_rotateLogFile(fileEntry, callback) {
		const backupPath = `_doc/log_${Date.now()}.txt`;

		// 重命名当前文件
		fileEntry.moveTo(plus.io.resolveLocalFileSystemURL('_doc'), 'log_backup.txt', (backupEntry) => {
			// 创建新文件
			this._createAndWrite('', () => {
				console.log("Log file rotated");
				callback();
			});
		}, (e) => {
			console.error("Rotate log file failed: " + e.message);
			callback();
		});
	}

	// 读取日志
	readLog(callback) {
		plus.io.resolveLocalFileSystemURL(this.logPath, (entry) => {
			entry.file((file) => {
				const reader = new plus.io.FileReader();
				reader.onload = () => {
					callback(null, reader.result);
				};
				reader.onerror = (e) => {
					callback(e, null);
				};
				reader.readAsText(file);
			}, (e) => {
				callback(e, null);
			});
		}, (e) => {
			callback(e, null);
		});
	}

	// 清空日志
	clearLog(callback) {
		plus.io.resolveLocalFileSystemURL(this.logPath, (entry) => {
			entry.createWriter((writer) => {
				writer.onwrite = () => {
					console.log("Log cleared");
					if (callback) callback(true);
				};
				writer.onerror = (e) => {
					console.error("Clear log failed: " + e.message);
					if (callback) callback(false);
				};
				writer.truncate(0); // 清空文件内容
			});
		}, (e) => {
			console.error("Clear log failed: " + e.message);
			if (callback) callback(false);
		});
	}

	// 获取日志文件信息
	getLogInfo(callback) {
		plus.io.resolveLocalFileSystemURL(this.logPath, (entry) => {
			entry.file((file) => {
				callback({
					size: file.size,
					lastModified: file.lastModifiedDate,
					path: entry.fullPath
				});
			}, (e) => {
				callback(null);
			});
		}, (e) => {
			callback(null);
		});
	}
}

// 创建全局实例
const logManager = new LogManager();

// 导出使用
export default logManager;