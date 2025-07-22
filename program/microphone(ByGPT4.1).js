var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert('当前浏览器不支持语音识别，请用最新版 Chrome/Edge');
} else {
    var recognition = new SpeechRecognition();
    recognition.continuous = true; // 可以持续识别直到stop
    recognition.interimResults = false;
    var recognizing = false; // 当前识别状态

    // 检测输入框内容，自动切换识别语言
    function setRecognitionLang() {
        var text = $(".input-box input[type='text']").val();
        // 含a-z自动切英文，不含自动切中文（可根据实际调整规则）
        if(/[a-zA-Z]/.test(text)){
            recognition.lang = 'en-US';
        }else{
            recognition.lang = 'zh-CN';
        }
    }

    $('#voice-btn').on('click', function() {
        if (!recognizing) {
            setRecognitionLang();   // 每次开始前重设语言
            recognition.start();
            recognizing = true;
            $('#mic-icon').css("color", "red");
        } else {
            recognition.stop();
            recognizing = false;
            $('#mic-icon').css("color", "#444");
        }
    });

    recognition.onresult = function(event) {
        var transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        $(".input-box input[type='text']").val(transcript);
        // 你也可以自动发送: $('#send-btn').click();
    };

    recognition.onend = function() {
        // 识别自然结束后，自动复位
        recognizing = false;
        $('#mic-icon').css("color", "#444");
    };

    recognition.onerror = function(event) {
        recognizing = false;
        $('#mic-icon').css("color", "#444");
        alert('语音识别出错: ' + event.error);
    };
}