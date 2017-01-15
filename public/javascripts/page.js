document.querySelector('.my-page').onclick = function(event){
    e = event || window.event;
    var tar = e.target || e.srcElement;
    let pageNum = window.location.href.match(/\?page=(\d+)/)?window.location.href.match(/\?page=(\d+)/)[1]*1:0;
    let total = document.querySelector('.my-hidden-total').value*1;

    if (tar.tagName.toUpperCase() === "LI") {
        if (parseFloat(tar.innerHTML) === pageNum) {
            //->说明当前就是这一页
            return;
        }
        pageNum = parseFloat(tar.innerHTML);
        window.location.href = '?page='+pageNum;
    }

    if(tar.tagName.toUpperCase() === "DIV"){
        var inn = tar.innerHTML;
        if (inn === "FIRST") {
            if (pageNum === 0) {
                return;
            }
            pageNum = 0;
        } else if (inn === "LAST") {
            if (pageNum === total) {
                return;
            }
            pageNum = total;
        } else if (inn === "PREV") {
            if (pageNum > 0) {
                pageNum--;
            }
        } else if (inn === "NEXT") {
            if (pageNum < total) {
                pageNum++;
                console.log(2,pageNum);
            }
        }
        window.location.href = '?page='+pageNum;
    }

};