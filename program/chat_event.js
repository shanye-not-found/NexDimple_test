$(".messages-block").on("click", ".trash-btn", function(){
    $(this).closest(".bot-message-box, .user-message-box").remove();
})
$(".messages-block").on("click", ".refresh-btn", function(){
    let currentBox=$(this).closest(".bot-message-box, .user-message-box");
    let trimedMessage
    let responseBox;
    if (currentBox.hasClass("user-message-box")){
    trimedMessage=$(currentBox).find(".message-text").text().trim();
    if (currentBox.next().hasClass("bot-message-box")){
        responseBox=$(currentBox).next(".bot-message-box").find(".message-text");
    
        $.ajax({
            url: "",
            method: "POST",
            data: { message: trimedMessage },
            dataType: "json",
            success: function(response) {
                responseBox.text(response.data);
            },
            error: function(xhr, status, error) {
                responseBox.text(`Error : ${error}`);
            } 
        })  
    }else{
        $.ajax({
            url: "",
            method: "POST",
            data: { message: trimedMessage },
            dataType: "json",
            success: function(response) {
                currentBox.after(`
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
                currentBox.after(`
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
    }
    
    }else if (currentBox.hasClass("bot-message-box")){
    responseBox=$(currentBox).find(".message-text");
    if (currentBox.prev().hasClass("user-message-box")){
        trimedMessage=$(currentBox).prev(".user-message-box").find(".message-text").text().trim();
        $.ajax({
            url: "",
            method: "POST",
            data: { message: trimedMessage },
            dataType: "json",
            success: function(response) {
                responseBox.text(response.data);
            },
            error: function(xhr, status, error) {
                responseBox.text(`Error : ${error}`);
            }
        })       
    }else{
        alert("no previous message");
    }
}
})
$(".messages-block").on("click", ".copy-btn", function(){
    let message=$(this).closest(".bot-message-box, .user-message-box").find(".message-text").text();
    navigator.clipboard.writeText(message);
})