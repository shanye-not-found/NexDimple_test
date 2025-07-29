// 创造卡片
const createCards =async function(cards){
    console.log(cards);
    $("#card-body").empty();
    cards.forEach(card => {
        const cardBody = document.getElementById("card-body");
        const li = document.createElement("li");
        li.classList.add("card-item");
        li.id = `${card.id}`;
        li.innerHTML = `
        <div class="name-block">
            <div class="name">${card.name}</div>
            <div class="mark-btn"></div>
        </div>
        <ul class="tag-block" ></ul>
        <div class="event-block">
            <a class="data-btn" href="./personal_data.html?id=${card.id}" target="_blank">
                <span><i class="fas fa-user" style="font-size: 16px;color: #757575;"></i></span>
                <p>Personal Data</p>
            </a>
            <a class="bot-btn" href="./chatbot.html?id=${card.id}" target="_blank">
                <span><i class="fa fa-desktop" style="font-size: 16px;color: #757575;"></i></span>
                <p>ChatBot</p>
            </a>
        </div>
        `;
        cardBody.appendChild(li);
        const tagBlock = li.querySelector(".tag-block");
        if (card.tags.length > 0){
            card.tags.forEach(tag => {
                if (tag === "") return;
                const createTag = document.createElement("li");
                createTag.classList.add("tag");
                createTag.innerHTML = tag;
                tagBlock.appendChild(createTag);
            });
        }

        if (card.mark === 1){
            li.querySelector(".mark-btn").innerHTML = `<i class="fas fa-bookmark" style="font-size: 24px; color: #FFC107;"></i>`
        }else{
            li.querySelector(".mark-btn").innerHTML = `<i class="far fa-bookmark" style="font-size: 24px; color: #000;"></i>`
        }
    });
    if ($(".folder-title").length > 0){
        const cardBody = document.getElementById("card-body");
        const li = document.createElement("li");
        li.classList.add("card-add");
        li.innerHTML = `<div class="file-plus"></div>`
        cardBody.appendChild(li);           
    }
    
};


// 网页中添加卡片
let cards=[]
$(".folder-session").on("click",".folder-card", async function(){
    if ($(this).hasClass("folder-add")) return;
    const getTitle = $(this).text();
    const targetFolder= await db.folders.where("title").equals(getTitle).first();
    const folderId = targetFolder.id;
    cards = await db.cards.where("folderId").equals(folderId).toArray();
    cards.sort((a, b) => (b.mark === 1 ? 1 : 0) - (a.mark === 1 ? 1 : 0));
    console.log(cards);
    $("#card-header").empty();
    $("#card-body").empty();
    $(".card-header").html(`
        <div class="folder-title" id="current-title">${getTitle}</div>
        <div class="edit-btn"><i class="fas fa-edit" style="font-size: 32px; color: #000;"></i></div>
        <div class="trash-btn"><i class="fas fa-trash-alt" style="font-size: 32px;color: #000;"></i></div>
        <div class="filter-session">
            <input type="text" placeholder="Search by name or tag">
            <div class="search-btn"><i class="fas fa-search" style="font-size: 16px; color: #ADADAD;"></i></div>
        </div>               
        `);
    createCards(cards);

    });
// 模态框方法
const openModal = function(){
    const modal = document.getElementById("card-modal");
    const mask = document.getElementById("modal-mask");
    modal.style.display = "flex";
    mask.style.display = "flex"
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
// 新增卡片
$(".card-body").on("click",".card-add",function(){           
    openModal();
});
$(".save-btn").on("click", async function(){
    const name = $(".modal-body .user-name input").val();
    const relationship = $(".modal-body .user-relation input").val();
    const occupation = $(".modal-body .user-occupation input").val();
    const tags = $(".modal-body .user-tags input").val();
    const introduction = $(".modal-body textarea").val();
    const getTitle = $("#current-title").text();
    const targetFolder= await db.folders.where("title").equals(getTitle).first();
    const folderId = targetFolder.id;
    const card = {
        name,
        relationship,
        occupation,
        tags: tags.split(",").map(t => t.trim()).filter(t => t !== ""),
        introduction,
        folderId
    };
    await db.cards.add(card)
    cards.push(card);
    createCards(cards);
    closeModal();
    });
$(".cancel-btn").on("click", function(){
    closeModal();
    });