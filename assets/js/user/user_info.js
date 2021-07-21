$(function() {
        //调用getuserinfo获取用户信息
        getUserInfo();
        /*******************************************创建验证规则*********************************************/
        //从layui中获取form对象
        var form = layui.form;
        //通过form.verify()函数自定义校验规则
        form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return '昵称长度必须在1-6个字符之间！'
                }
            }

        })



        /******************************************重置表单事件*************************************** */
        $('#user_infoReset').on('click', function(e) {
            e.preventDefault();
            getUserInfo(); //重新获取表单信息，赋值给表单
        })




        /*******************************************更新表单事件******************************************* */
        var layer = layui.layer;
        //监听登录表单的提交事件
        $('#form_user_info').submit(function(e) {
            // 阻止默认提交行为
            e.preventDefault()
            $.ajax({
                url: '/my/userinfo',
                type: 'POST',
                // 快速获取表单中的数据
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('修改用户信息失败！')
                    }
                    layer.msg('修改用户信息成功！')
                        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    window.parent.getUserInfo();

                }
            })

        })
    })
    /*******************************获取表单用户信息***************************************** */
var form = layui.form;

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
            form.val('formuser_info', res.data);

        }
    })
}