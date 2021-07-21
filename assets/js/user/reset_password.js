$(function() {
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        //校验密码两次是否一致
        repwd: function(value) {
            //通过形参拿到的是确认密码中的内容
            //还需要拿到密码框中的内容
            //然后进行判断
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })


    //重置密码表单提交事件
    var layer = layui.layer;
    $(".layui-form").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息


            }

        })
    })
})