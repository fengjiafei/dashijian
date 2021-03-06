$(function() {

    $("#link-reg").on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $("#link-login").on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //从layui中获取form对象
    var form = layui.form;
    //通过form.verify()函数自定义校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验密码两次是否一致
        repwd: function(value) {
            //通过形参拿到的是确认密码中的内容
            //还需要拿到密码框中的内容
            //然后进行判断
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '密码不一致！'
            }
        }

    })
    var layer = layui.layer;

    //监听表单提交事件
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
            // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                console.log(res.message);
                return layer.msg(res.message) //layer不能直接使用，var layer = layui.layer;
            }
            layer.msg('注册成功，请登录！')
                // 模拟人的点击行为,点击完注册后自动跳回登录页面
            $('#link-login').click();

        })
    })


    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('账号或密码错误！')
                }
                layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })


})