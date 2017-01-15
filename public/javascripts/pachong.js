document.querySelector('#buttonBtn').onclick = function(){
    ajax({
        url: "/admin/read",  //请求地址
        type: "POST",                       //请求方式
        data: {
            url:document.querySelector('#url').value || 'http://www.w3cplus.com',
            params:document.querySelector('#params').value || 'page',
            pageStart:document.querySelector('#pageStart').value || 0,
            pageEnd:document.querySelector('#pageEnd').value || 1
        }, //请求参数
        dataType: "json",
        success: function (response, xml) {
            document.querySelector('.tip').innerHTML = response;
        },
        fail: function (status) {
            
        }
    });
};