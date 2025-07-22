
// 初始化folder列表
const folderList = document.getElementById('folder-body');
const renderFolders = function(){
    folderList.innerHTML = "";
    db.folders.toArray().then(folders => {
        folders.forEach(folder => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="folder-card">${folder.title}</div>`;
            folderList.appendChild(li);
        })
        const li = document.createElement('li');
        li.innerHTML = `<div class="folder-card folder-add"><i class="fas fa-plus-circle"style="font-size: 57px;color: #000;"></i></div>`;
        folderList.appendChild(li);
    })
};
renderFolders();

// function to add folder to database
const addFolder = async (title)  => {
        const sameFolder = await db.folders.where("title").equals(title).first();
        if (sameFolder) {
            alert("Folder already exists!");
            return;
        }
        db.folders.add({title: title});
        }
// 按钮功能
$(".folder-session").on("click",".folder-add", function(){
    if ($("#folder-name").length > 0) return;
    $(this).html(`<input type="text" placeholder="Enter a Title" class="folder-input" id="folder-name" ">`);
    $("#folder-name").focus();
    // 回车保存、失焦保存，二选一
    let saved = false;
    $("#folder-name").on("blur",async function () {
        if (saved) return;
        saved = true;
        const title = $(this).val();
        if (title.trim() === "") return;
        await addFolder(title);
        renderFolders();
        const folderBody = document.getElementById("folder-body");
        setTimeout(() => {
            folderBody.scrollTo({
                top: folderBody.scrollHeight,
                behavior: 'smooth' // 可选：平滑滚动
            });
        },50);
    });
    $("#folder-name").on("keyup",async function (e) {
        if (saved) return;
        if (e.keyCode === 13) {
            saved = true;
            const title = $(this).val();
            if (title.trim() === "") return;
            await addFolder(title);
            renderFolders();
            const folderBody = document.getElementById("folder-body");
            setTimeout(() => {
                folderBody.scrollTo({
                    top: folderBody.scrollHeight,
                    behavior: 'smooth' // 可选：平滑滚动
                });
            },50);
            
            }
        })
    });

