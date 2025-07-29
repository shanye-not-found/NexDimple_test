// main
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');
console.log(cardId);
document.querySelector(".bot-btn").href = "./chatbot.html?id=" + cardId;
const createCard = async (cardId) => {
    const card = await db.cards.get(Number(cardId));
    console.log(card);
    const tags = card.tags
    const tagText = tags.join(", ");
    $(".name-block .name").html(card.name);
    $(".relationship-block .data-text").html(card.relationship);
    $(".occupation-block .data-text").html(card.occupation);
    $(".tags-block .data-text").html(tagText);
    $(".introduction-block .introduction").html(card.introduction);
    if (card.mark === 1){
        $(".event-block .bookmark").html(`<i class="fas fa-bookmark" style="font-size: 48px; color: #FFC107;"></i>`);
    }else{
        $(".event-block .bookmark").html(`<i class="far fa-bookmark" style="font-size: 48px; color: #000;"></i>`);
    }
    if (card.recordFalse === 1){
        $(".event-block .microphone").html(`<i class="fas fa-microphone-slash" style="font-size: 48px; color: #CEEEFB;"></i>`);
    }else{
        $(".event-block .microphone").html(`<i class="fas fa-microphone" style="font-size: 48px; color: #000;"></i>`);
    }
}
createCard(cardId);
$(".event-block .bookmark").on("click", async () => {
    const card = await db.cards.get(Number(cardId));
    if (card) {
    const newMark = card.mark === 1 ? 0 : 1;
    await db.cards.update(card.id, {mark: newMark});
    if (newMark === 1) {
        $(".event-block .bookmark").html(`<i class="fas fa-bookmark" style="font-size: 48px; color: #FFC107;"></i>`);
    } else {
        $(".event-block .bookmark").html(`<i class="far fa-bookmark" style="font-size: 48px; color: #000;"></i>`);
    }
    }
})
$(".event-block .microphone").on("click", async () => {
    const card = await db.cards.get(Number(cardId));
    if (card) {
    const newRecordfalse = card.recordFalse === 1 ? 0 : 1;
    await db.cards.update(card.id, {recordFalse: newRecordfalse});
    if (newRecordfalse === 1) {
        $(".event-block .microphone").html(`<i class="fas fa-microphone-slash" style="font-size: 48px; color: #CEEEFB;"></i>`);
    } else {
        $(".event-block .microphone").html(`<i class="fas fa-microphone" style="font-size: 48px; color: #000;"></i>`);
    }
    }
})
$(".event-block .trash").on("click", () => {
    let result = window.confirm("Are you sure to delete this card?");
    if (result) {
        db.cards.delete(Number(cardId));
        window.location.href = "./user_info.html";
    }
});
// 模态框
const openModal = function(){
    const modal = document.getElementById("card-modal");
    const mask = document.getElementById("modal-mask");
    modal.style.display = "flex";
    mask.style.display = "flex"
    const name = $(".name-block .name").text();
    const relationship = $(".relationship-block .data-text").text();
    const occupation = $(".occupation-block .data-text").text();
    const tags = $(".tags-block .data-text").text();
    const introduction = $(".introduction-block .introduction").text();
    $(".modal-body .user-name input").val(name);
    $(".modal-body .user-relation input").val(relationship);
    $(".modal-body .user-occupation input").val(occupation);
    $(".modal-body .user-tags input").val(tags);
    $(".modal-body textarea").val(introduction);
};
const closeModal = function(){
    const modal = document.getElementById("card-modal");
    const mask = document.getElementById("modal-mask");
    modal.style.display = "none";
    mask.style.display = "none"
    $(".modal-body .user-name input").val("");
    $(".modal-body .user-relation input").val("");
    $(".modal-body .user-occupation input").val("");
    $(".modal-body .user-tags input").val("");
    $(".modal-body textarea").val("");
}
$(".event .edit-btn").on("click",function(){           
    openModal();
});
$(".modal-event .save-btn").on("click", async function(){
    const name = $(".modal-body .user-name input").val();
    const relationship = $(".modal-body .user-relation input").val();
    const occupation = $(".modal-body .user-occupation input").val();
    const tags = $(".modal-body .user-tags input").val();
    const introduction = $(".modal-body textarea").val();
    const card = {
        name,
        relationship,
        occupation,
        tags: tags.split(",").map(t => t.trim()).filter(t => t !== ""),
        introduction,
    };
    await db.cards.update(Number(cardId), card);
    createCard(cardId);
    closeModal();
    // 用后端数据库实现同步刷新（未实现）
    });
$(".modal-event .cancel-btn").on("click", function(){
    closeModal();
    });    