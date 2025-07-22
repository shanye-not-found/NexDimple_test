$(document).ready(function() {
    // 发送消息的主函数
    const sendMessage = function() {
        const input = $(".input-box input");
        const message = input.val();
        const trimedMessage = message.trim();
        if (trimedMessage === "") {
            return;
        }
        $(".messages-block").append(`
            <div class="user-message-box">
                <div class="user-message"><p class="message-text">${message}</p></div>
                <div class="profile-photo"><i class="fas fa-user" style="font-size: 48px;color: #fff;"></i></div>
                    <div class="event-session">
                    <div class="user-buttons-position">
                        <div class="trash-btn"><i class="fas fa-trash-alt" style="font-size: 26px;color: #fff;"></i></div>
                        <div class="refresh-btn"><i class="fas fa-refresh" style="font-size: 26px;color: #fff;"></i></div>
                        <div class="copy-btn"><i class="fas fa-copy" style="font-size: 26px;color: #fff;"></i></div>
                    </div>
                </div>
            </div>
        `);
        input.val(""); // 清空输入框
        $.ajax({
            url: "",
            method: "POST",
            data: { message: trimedMessage },
            dataType: "json",
            success: function(response) {
                $(".messages-block").append(`
                    <div class="bot-message-box">
                        <div class="profile-photo"><i class="fas fa-robot" style="font-size: 48px;color: #fff;"></i></div>
                        <div class="bot-message"><p class="message-text">${response.data}</p></div>
                        <div class="event-session">
                            <div class="bot-buttons-position">
                                <div class="trash-btn"><i class="fas fa-trash-alt" style="font-size: 26px;color: #fff;"></i></div>
                                <div class="refresh-btn"><i class="fas fa-refresh" style="font-size: 26px;color: #fff;"></i></div>
                                <div class="copy-btn"><i class="fas fa-copy" style="font-size: 26px;color: #fff;"></i></div>
                            </div>
                        </div>
                    </div>
                `);
            },
            error: function(xhr, status, error) {
                $(".messages-block").append(`
                    <div class="bot-message-box">
                        <div class="profile-photo"><i class="fas fa-robot" style="font-size: 48px;color: #fff;"></i></div>
                        <div class="bot-message"><p class="message-text">Error : ${error}</p></div>
                        <div class="event-session">
                            <div class="bot-buttons-position">
                                <div class="trash-btn"><i class="fas fa-trash-alt" style="font-size: 26px;color: #fff;"></i></div>
                                <div class="refresh-btn"><i class="fas fa-refresh" style="font-size: 26px;color: #fff;"></i></div>
                                <div class="copy-btn"><i class="fas fa-copy" style="font-size: 26px;color: #fff;"></i></div>
                            </div>
                        </div>
                    </div>
                `);
            }
        });
    };

    // 事件绑定写在外面，只执行一次即可
    $("#send-btn").on("click", function(e) {
        e.preventDefault();
        sendMessage();
    });
    // 回车键事件，不阻止所有字符输入，仅在按下回车时阻止默认提交
    $(".input-box input").on("keypress", function(e) {
        if (e.which === 13) {
            e.preventDefault();
            sendMessage();
        }
    });
});