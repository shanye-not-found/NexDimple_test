const renderMemories = async () => {
    const card = await db.cards.get(Number(cardId));
    const memories = card.preservedMemories || [];
    const ul = document.getElementById("memories-list");

    // Clear existing memories
    ul.innerHTML = '';

    // Render each memory
    memories.forEach(memory => {
        const li = document.createElement("li");
        li.classList.add("memories-item");
        li.innerHTML = `
            <div class="memory-content">
                <span class="memory-text">${memory}</span>
                <span class="memory-edit-btn"><i class="fas fa-edit" style="font-size: 40px; color: #9E7CA1;"></i></span>
                <span class="memory-delete-btn"><i class="fas fa-trash-alt" style="font-size: 40px; color: #9E7CA1;"></i></span>
            </div>
            <hr style="width: 100%; height: 3px; background: #AD87B0;">
        `;
        ul.appendChild(li);
    });

    // Ensure there are at least 6 items, some can be empty
    while (ul.children.length < 6) {
        const li = document.createElement("li");
        li.classList.add("memories-item", "empty-memory");
        li.innerHTML = `<div class="empty-placeholder"></div><hr style="width: 100%; height: 3px; background: #AD87B0;">`;
        ul.appendChild(li);
    }
};

// Initialize the first render of memories
renderMemories();
// 添加memory
$(".memories-add-btn").on("click", async () => {
    const ul = document.getElementById("memories-list");
    const emptyLi = Array.from(ul.children).find(li => li.classList.contains('empty-memory'));
    const existInput = Array.from(ul.children).some(li => li.querySelector('.memory-input'));
    if (existInput) return;

    if (emptyLi) {
        emptyLi.innerHTML = `
            <input type="text" class="memory-input" placeholder="Add new memory">
            <hr style="width: 100%; height: 3px; background: #AD87B0;">
        `
        const input = emptyLi.querySelector('.memory-input');
        input.focus();
    } else {
        const li = document.createElement("li");
        li.classList.add("memories-item");
        li.innerHTML = `
            <input type="text" class="memory-input" placeholder="Add new memory">
            <hr style="width: 100%; height: 3px; background: #AD87B0;">            
        `;
        ul.appendChild(li);
        const input = li.querySelector('.memory-input');
        input.focus();
        // Scroll to the new item
        ul.scrollTo({
            top: ul.scrollHeight,
            behavior: 'smooth'
        });
    }
    let saved = false
    $(".memories-list").off("blur",".memory-input").on("blur", ".memory-input", async function() {
        if ($(this).val().trim() === ''){
            renderMemories();
            return;
        }
        if (saved) return;
        saved = true;
        const card = await db.cards.get(Number(cardId));
        const memories = card.preservedMemories || [];
        const newMemory = $(this).val();
        await db.cards.update(Number(cardId),{ preservedMemories: [...memories, newMemory] });
        renderMemories();
    });
    $(".memories-list").off("keydown",".memory-input").on("keydown", ".memory-input", async function(e) {
        if (e.keyCode === 13) {
            if ($(this).val().trim() === ''){
                renderMemories();
                return;
            }
            if (saved) return;
            saved = true;
            const card = await db.cards.get(Number(cardId));
            const memories = card.preservedMemories || [];
            const newMemory = $(this).val();
            await db.cards.update(Number(cardId), { preservedMemories: [...memories, newMemory] });
            renderMemories();
        }
    });
})
// Function to save memory
const saveMemory = async (memoryText, index) => {
    const card = await db.cards.get(Number(cardId));
    const memories = card.preservedMemories || [];
    memories[index] = memoryText;
    await db.cards.update(Number(cardId),{ preservedMemories: memories });
    renderMemories();
};

// Function to delete memory
const deleteMemory = async (index) => {
    const card = await db.cards.get(Number(cardId));
    const memories = card.preservedMemories || [];
    if (index >= 0) {
        memories.splice(index, 1);
        await db.cards.update(Number(cardId),{ preservedMemories: memories });
        renderMemories();
    }
};
// Function to edit memory
const editMemory = async (index) => {
    const card = await db.cards.get(Number(cardId));
    const memories = card.preservedMemories || [];
    const ul = document.getElementById("memories-list");
    const li = ul.children[index];

    const memoryContent = li.querySelector('.memory-content');
    const memoryTextSpan = li.querySelector('.memory-text');

    // Create input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = memoryTextSpan.textContent;
    input.classList.add("memory-input");

    // Replace span with input
    li.replaceChild(input, memoryContent);
    input.focus();
    // save memory when input loses focus
    let saved = false
    $(".memories-list").off("blur",".memory-input").on("blur", ".memory-input", async function() {
        if (saved) return;
        saved = true
        inputVal = $(this).val();
        await saveMemory(inputVal, index);

    });
    $(".memories-list").off("keydown",".memory-input").on("keydown", ".memory-input", async function(e) {
        if (e.key === 'Enter') {
            if (saved) return;
            saved = true
            inputVal = $(this).val();
            await saveMemory(inputVal, index);
        }
    });
}
document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.memory-edit-btn');
    const deleteBtn = e.target.closest('.memory-delete-btn');
    if (editBtn) {
        const li = editBtn.closest('li');
        const index = Array.from(li.parentNode.children).indexOf(li);
        const memoryTextSpan = li.querySelector('.memory-text');
        editMemory(index);
    } else if (deleteBtn) {
        const li = deleteBtn.closest('li');
        const index = Array.from(li.parentNode.children).indexOf(li);
        deleteMemory(index);
    }
});
let tooltip = null;
let tooltipTimer = null; // 定时器句柄

document.addEventListener('mouseover', function(e){
const target = e.target;
if(target.classList.contains('memory-text')) {
    // 判断是否真的溢出
    if(target.scrollWidth > target.clientWidth) {
    // 定时1秒后显示
    tooltipTimer = setTimeout(function() {
        if(!tooltip){
        tooltip = document.createElement('div');
        tooltip.className = 'memory-tooltip';
        document.body.appendChild(tooltip);
        }
        tooltip.textContent = target.textContent;
        const rect = target.getBoundingClientRect();
        tooltip.style.top = (rect.bottom + window.scrollY + 6) + 'px';
        tooltip.style.left = (rect.left + window.scrollX) + 'px';
        tooltip.style.display = 'block';
    }, 1000);
    }
}
});

document.addEventListener('mouseout', function(e){
const target = e.target;
if(target.classList.contains('memory-text')) {
    // 鼠标移开时取消定时任务&隐藏提示框
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
    if(tooltip) tooltip.style.display = 'none';
}
});