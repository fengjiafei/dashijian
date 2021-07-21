$(function() {
    //调用getuserinfo获取用户信息
    getUserInfo();



    //退出事件
    //给退出按钮绑定事件
    var layer = layui.layer;
    $("#logout").on('click', function() {
        layer.confirm('确定要退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            //按确定的话执行下面语句
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = 'login.html';

            //关闭询问框
            layer.close(index);
        });
    })


})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        /*  // headers 就是请求头配置对象
         headers: {
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    })
}
//res.data=user
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
        // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}