x$.ready( function() {
	//关闭划词翻译
	x$('#closeTrans').click( function() {
		localStorage['closeTrans'] = this.checked ? 1 : 0;
	})[0].checked = localStorage['closeTrans'] == 1;
	
	//延时关闭翻译内容
	x$('#hiddenDelay').on('change', function() {
		localStorage['hiddenDelay'] = this.value;
	})[0].value = localStorage['hiddenDelay'] || 3;
	
	//输入框自动获取焦点，并捕获回车事件查询
	x$('#query').on('keyup',function(e){
		if(e.keyCode == 13){
			x$('#searchBtn').fire('click');
		}
		return true;
	})[0].focus();
	
	//search form
	x$('#searchBtn').click( function() {
		x$('#query').xhr('http://fanyi.baidu.com/transcontent', {
			method:'post',
			data:'ie=utf-8&source=txt&query='+ x$('#query')[0].value +'&t='+ +new Date +'&token=e26deda5a16ff3bc9e64e26b6cc5133f&from=auto&to=auto',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded'
			},
			callback: function() {
				var json = JSON.parse(this.responseText);
				var result = '';
				if(json.type == 1) {	//详细解释
					result = json.result || '';
				} else {	//简译
					for(var i = 0, l = json.data.length; i < l; i++ ) {
						var item = json.data[i];
						result += (item.dst || '') + '<br />';
					}
				}
				x$('#result').html(result);
			}
		});
	});
});