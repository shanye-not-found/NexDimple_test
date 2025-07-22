// header-edit-btn
$(".card-header").on("click", ".edit-btn", async function(){
    const folderTitle = $(".card-header").find(".folder-title");
    if (folderTitle.find("input").length > 0) return;
    const oldTitle = folderTitle.text();
    const folder = await db.folders.where("title").equals(oldTitle).first();
    if (!folder) {
        alert("找不到文件夹数据");
        return;
    }
    const id = folder.id;

    folderTitle.html(`<input type="text" placeholder="Enter Title" value="${oldTitle}">`);
    const $input = folderTitle.find("input").focus();

    let saved = false;

    async function saveFunc() {
        if (saved) return;
        saved = true;
        const val = $input.val().trim();
        if (val === "") {
            folderTitle.html(oldTitle); //空则还原
            return;
        }
        await db.folders.update(id, {title: val});
        folderTitle.html(val);
        renderFolders();
    }

    $input.on("blur", saveFunc);
    $input.on("keyup", function(e){
        if (e.key === "Enter") {
            saveFunc();
        }
    });
});
// header-delete-btn
$(".card-header").on("click", ".trash-btn", async function(){
    const folderTitle = $(".card-header").find(".folder-title");
    let result = window.confirm("Are you sure to delete this folder?");
    if (result) {
        const folder = await db.folders.where("title").equals(folderTitle.text()).first();
        const id = folder.id;
        await db.folders.delete(id);
        await db.cards.where("folderId").equals(id).delete();
        renderFolders();
        $(".card-session").html(`
        <div class="card-header" id="card-header">
            <div class="default-message">Please select a folder</div> 
        </div>
        <ul class="card-body" id="card-body"></ul>
        `);
    };
});
// chatbot-btn
$(".card-body").on("click",".bot-btn",function(){
    window.open("./chatbot.html","_blank")
});

//filter-session
let targetCards = [];
const searchFunc =async function(){
    const inputVal = $(".filter-session input").val();
    $(".filter-session input").val("")
    if (inputVal.trim() === "" ) return;
    const targetCards1 = await db.cards.where("name").startsWithIgnoreCase(inputVal).toArray();
    const targetCards2 = await db.cards.filter(card => card.tags.some(tag => tag.toLowerCase().startsWith(inputVal.toLowerCase()))).toArray();
    targetCards = targetCards1.concat(targetCards2);
    targetCards.sort((a, b) => (b.mark === 1 ? 1 : 0) - (a.mark === 1 ? 1 : 0));
    $("#card-body").html("");
    $(".card-header").html(`
        <div class="search-text">Search Result</div>
        <div class="filter-session">
            <input type="text" placeholder="Search by name or tag">
            <div class="search-btn"><i class="fas fa-search" style="font-size: 16px; color: #ADADAD;"></i></div>
        </div>
    `)
    createCards(targetCards);

}


$(".card-header").on("click",".search-btn", function(){
    searchFunc();
});
$(".card-header").on("keyup",".filter-session input", function(e){
    if (e.keyCode === 13) {
        searchFunc();
    };
})
// mark-btn
$(".card-body").on("click", ".mark-btn", async function(){
    const cardId = $(this).closest(".card-item").attr("id");
    const card = await db.cards.get(Number(cardId));
    const folderId = card.folderId;
    if($(".folder-title").length > 0){
        if(card){
            const newMark = card.mark === 1 ? 0 : 1;
            await db.cards.update(card.id, {mark: newMark});
            targetCards=await db.cards.where("folderId").equals(folderId).toArray();
            targetCards.sort((a, b) => (b.mark === 1 ? 1 : 0) - (a.mark === 1 ? 1 : 0));
            createCards(targetCards);   
        }
    }else{
        if (card) {
            const newMark = card.mark === 1 ? 0 : 1;
            await db.cards.update(card.id, {mark: newMark});
            let idx = targetCards.findIndex(c => c.id == card.id);
            if (idx > -1) {
                targetCards[idx].mark = newMark;
            }
            targetCards.sort((a, b) => (b.mark === 1 ? 1 : 0) - (a.mark === 1 ? 1 : 0));
            createCards(targetCards);
        };
    }
    
});