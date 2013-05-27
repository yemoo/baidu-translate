xui.extend({
	contain: function(obj) {
		var _this = this[0];
		while (obj && obj.tagName.toUpperCase() != 'BODY') {
			if (obj == _this) {
				return true;
			}
			obj = obj.parentNode;
		}
		return false;
	},
	addClass: function(clsName) {
		if (this[0].className.split(/\s/).indexOf(clsName) == -1) {
			this[0].className += ' ' + clsName;
		}
		return this;
	},
	removeClass: function(clsName) {
		this[0].className = this[0].className.replace(new RegExp('\\s+' + clsName + '|^' + clsName, 'g'), '');
		return this;
	},
	setStyle: function(name, value) {
		if (typeof name == 'object') {
			for (var i in name) {
				if (name.hasOwnProperty(i)) {
					this.setStyle(i, name[i]);
				}
			}
			return this;
		}
		this[0].style[name] = value;
		return this;
	}
});

//默认配置
var config = {};
var getConfig = function() {
	chrome.extension.sendRequest({}, function(response) {
		config = response;
	});
	return config;
};
getConfig(); //先初始化config

var resultBox = document.createElement('div');
resultBox.className = "baidu_translate_result";
resultBox = x$(resultBox);

var timer;
x$(document.body).on('mouseup', function(e) {
	var config = getConfig();
	if (config['closeTrans'] == 1) {
		return true;
	}
	//不允许在翻译内容上再划词
	if (resultBox.contain(e.target)) {
		return true;
	} else {
		resultBox.setStyle('display', 'none');
	}
	clearTimeout(timer);

	var selection = '' + (window.getSelection ? window.getSelection() : document.getSelection());
	if (selection.replace(/(^\s+|\s+$)/g, '') == '') {
		return;
	}
	var pos = [e.pageX, e.pageY];
	resultBox.xhr('http://fanyi.baidu.com/transcontent', {
		method: 'post',
		data: 'ie=utf-8&source=txt&query=' + selection + '&t=' + +new Date + '&token=e26deda5a16ff3bc9e64e26b6cc5133f&from=auto&to=auto',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		callback: function() {
			var json = JSON.parse(this.responseText);
			json.result && (json.result = JSON.parse(json.result));
			var result = '';
			// if (json.from == 'zh' && json.to == 'en') { //中译英
			// 	result = json.result || '';
			// 	resultBox.removeClass('chs');
			// } else if (json.from == 'en' && json.to == 'zh') { //英译中
			if (json.result) {
				result = json.result.content.map(function(content) {
					return content.mean.map(function(mean) {
						return (mean.pre ? '<strong>' + mean.pre + '</strong><br />' : '') + '&nbsp;&nbsp;' + Object.keys(mean.cont).join('<br />&nbsp;&nbsp;');
					}).join('<br/><br/>');
				}).join('<br/><br/>');
				//result += (item.mean || '') + '<br />';
				json.to == 'zh' && (resultBox.addClass('chs'));
			}

			// }

			if (!result) return;

			resultBox.html(result).setStyle({
				'display': 'block',
				'left': pos[0] + 10 + 'px',
				'top': pos[1] + 10 + 'px'
			});
			if (config.hiddenDelay != 0) {
				timer = setTimeout(function() {
					resultBox.setStyle('display', 'none');
				}, config.hiddenDelay * 1000);
			}
		}
	});
})[0].appendChild(resultBox[0]);