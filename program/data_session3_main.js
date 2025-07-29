let isEditing = false;

// ========== 辅助工具 ==========
function pad2(n){return n.toString().padStart(2,"0");}
function toDateInputValue(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}
function toTimeInputValue(ts) {
    const d = new Date(ts);
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function closeScheduleModal() {
    $("#schedule-modal").css("display", "none");
    $("#modal-mask").css("display", "none");
    $(".modal-body .date input").val("");
    $(".modal-body .start-time input").val("");
    $(".modal-body .end-time input").val("");
    $(".modal-body .content-text").val("");
    $(".schedule-modal-event .save-btn").off("click.editSave");
    $(".schedule-modal-event .cancel-btn").off("click.editCancel");
}
function openScheduleModal() {
    $("#schedule-modal").css("display", "flex");
    $("#modal-mask").css("display", "flex");
    $(".schedule-modal-event .save-btn").off("click").on("click", async function(){
        const date = $(".modal-body .date input").val();
        const start = $(".modal-body .start-time input").val();
        const end = $(".modal-body .end-time input").val();
        const content = $(".modal-body .content-text").val();
        if (date === "" || start === "" || end === "" || content === ""){
            alert("Please fill in all fields");
            return;
        }
        const startTime = new Date(date + "T" + start).getTime();
        const endTime = new Date(date + "T" + end).getTime();
        if (startTime >= endTime){
            alert("Start time should be earlier than end time");
            return;
        }
        const schedule = {
            cardId: cardId,
            startTime: startTime,
            endTime: endTime,
            content: content
        };
        await db.schedules.add(schedule);
        closeScheduleModal();
        renderSchedule();
    });
    $(".schedule-modal-event .cancel-btn").off("click").on("click", function(){
        closeScheduleModal();
    });
}

// ========= 普通checkbox操作 ==========
function bindNormalScheduleEvent() {
    $(".schedule-list").off("click.normalEvent").on("click.normalEvent", ".event", async function(e){
        const id = $(this).parent().attr("id");
        if ($(this).hasClass("checkbox")){
            await db.schedules.update(Number(id),{finished:1});
            $(this).removeClass("checkbox").addClass("checked")
            $(this).html(`<i class="far fa-check-square" style="font-size: 40px;color: #000;"></i>`)
        }else if ($(this).hasClass("checked")){
            await db.schedules.update(Number(id),{finished:0});
            $(this).removeClass("checked").addClass("checkbox")
            $(this).html(`<i class="far fa-square" style="font-size: 40px;color: #000;"></i>`)
        }else{
            await db.schedules.delete(Number(id));
            $(this).parent().remove();
        }
        e.stopPropagation(); // 防止冒泡
    });
}

// ========= 编辑模式下，li点击只弹窗，不做删除 ==========
function bindEditScheduleEvent() {
    $(".schedule-list").off("click.editMode").on("click.editMode", ".schedule-item", function(e){
        // 空li无id不响应
        const id = $(this).attr("id");
        if (!id) return;

        // ==== 时间数据直接用data-start/data-end ====
        const startTimestamp = Number($(this).attr("data-start"));
        const endTimestamp = Number($(this).attr("data-end"));
        $(".modal-body .date input").val(toDateInputValue(startTimestamp));
        $(".modal-body .start-time input").val(toTimeInputValue(startTimestamp));
        $(".modal-body .end-time input").val(toTimeInputValue(endTimestamp));
        $(".modal-body .content-text").val($(this).find(".content-block p").text())

        $("#schedule-modal").css("display", "flex");
        $("#modal-mask").css("display", "flex");

        // 编辑保存
        $(".schedule-modal-event .save-btn").off("click.editSave").on("click.editSave", async function(){
            const date = $(".modal-body .date input").val();
            const start = $(".modal-body .start-time input").val();
            const end = $(".modal-body .end-time input").val();
            const content = $(".modal-body .content-text").val();
            if (date === "" || start === "" || end === "" || content === ""){
                alert("Please fill in all fields");
                return;
            }
            const startTime = new Date(date + "T" + start).getTime();
            const endTime = new Date(date + "T" + end).getTime();
            if (startTime >= endTime){
                alert("Start time should be earlier than end time");
                return;
            }
            const schedule = {
                id: Number(id),
                cardId: cardId,
                startTime: startTime,
                endTime: endTime,
                content: content
            };
            await db.schedules.put(schedule);
            closeScheduleModal();
            renderSchedule();
        });
        $(".schedule-modal-event .cancel-btn").off("click.editCancel").on("click.editCancel", function(){
            closeScheduleModal();
        });
    });

    // ！！！重点：只在edit模式下绑定，给垃圾桶单独专用事件！！！
    $(".schedule-list .event.trash").off("click.trashDel").on("click.trashDel", function(e){
        const id = $(this).parent().attr("id");
        if(id){
            db.schedules.delete(Number(id));
            $(this).parent().remove();
        }
        e.stopPropagation();
        return false;
    });
}


const renderSchedule = async () => {
    const ul = document.getElementById("schedule-list");
    ul.innerHTML = "";
    const schedules = await db.schedules.where("cardId").equals(cardId).toArray();
    const positiveDate = []
    const negativeDate = []
    const currentTime = new Date().getTime()
    const currentDate = Math.floor(currentTime/86400000)
    schedules.forEach(schedule => {
        const remainDate = Math.floor(schedule.startTime/86400000) - currentDate
        if (remainDate >= 0){
            positiveDate.push(schedule)
        }else{
            negativeDate.push(schedule)
        }
    });
    positiveDate.sort((a,b) => a.startTime - b.startTime)
    negativeDate.sort((a,b) => b.startTime - a.startTime)
    const mergedDate = positiveDate.concat(negativeDate)
    function parseTimestamp(timestamp) {
        const date = new Date(timestamp);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes()
        };
    }
    function pad(n){ return n < 10 ? '0' + n : n; }
    mergedDate.forEach(schedule => {
        const startTime = schedule.startTime
        const endTime = schedule.endTime
        const formedStartTime = parseTimestamp(startTime)
        const formedEndTime = parseTimestamp(endTime)
        const startDate = Math.floor(startTime/86400000)
        const remainDate = startDate - currentDate
        let remindMessage
        if (remainDate >= 2){
            remindMessage = `in ${remainDate} days`
        }else if (remainDate === 1){
            remindMessage = `in 1 day`
        }else if (remainDate === 0){
            if (startTime - currentTime >= 0){
                remindMessage = `today`
            }else{
                const time = endTime - currentTime;
                if (time > 0){
                    remindMessage = "do it now"
                }else{
                    remindMessage = `Overdue`
                }
            }
        }else if (remainDate === -1){
            remindMessage ="1 day ago"
        }else{
            remindMessage =`${-remainDate} days ago`
        }
        const li = document.createElement("li");
        li.classList.add("schedule-item");
        li.id = `${schedule.id}`
        li.setAttribute("data-start", schedule.startTime); 
        li.setAttribute("data-end", schedule.endTime);     
        li.innerHTML = `
                <div class="event"></div>
                <div class="date-block"><p>${formedStartTime.year}/${formedStartTime.month}/${formedStartTime.day}</p></div>
                <div class="time-block"><p>${pad(formedStartTime.hours)}:${pad(formedStartTime.minutes)} - ${pad(formedEndTime.hours)}:${pad(formedEndTime.minutes)}</p></div>
                <div class="content-block"><p>${schedule.content}</p></div>
                <div class="remind-block"><p>${remindMessage}</p></div>
            `;
        const checkbox = li.querySelector(".event")
        if (remainDate < 0){
            li.classList.add("overdue");
            checkbox.classList.add("trash")
            checkbox.innerHTML=`<i class="fas fa-trash-alt" style="font-size: 40px;color: #000;"></i>`
        }else{
            li.classList.add("upcoming");
            if (schedule.finished === 1){
                checkbox.classList.add("checked")
                checkbox.innerHTML = `<i class="far fa-check-square" style="font-size: 40px;color: #000;"></i>`
            }else{
                checkbox.classList.add("checkbox")
                checkbox.innerHTML =`<i class="far fa-square" style="font-size: 40px;color: #000;"></i>`
            }
        };
        ul.appendChild(li);
    });
    while (ul.children.length < 5){
        const li = document.createElement("li");
        li.classList.add("schedule-item", "overdue");
        ul.appendChild(li);
    }
    if (isEditing) {
        const ulc = document.getElementById("schedule-list").children;
        Array.from(ulc).forEach(li => {
            const checkbox = li.querySelector(".event");
            if(checkbox){
                checkbox.classList.remove("checked","checkbox");
                checkbox.classList.add("trash");
                checkbox.innerHTML = `<i class="fas fa-trash-alt" style="font-size: 40px;color: #000;"></i>`;
            }
        });
        bindEditScheduleEvent();
    } else {
        bindNormalScheduleEvent();
    }
}

// ======== 按钮事件 ========
$(".event-block .schedule-add-btn").on("click",function(){ openScheduleModal(); });
$(".event-block").on("click",".schedule-edit-btn",function(){
    if(isEditing) return;
    isEditing = true;
    const editBtn = $(this);
    editBtn.removeClass("schedule-edit-btn").addClass("schedule-finish-btn")
        .html("Finish Editing");
    const ul = document.getElementById("schedule-list").children;
    Array.from(ul).forEach(li => {
        const checkbox = li.querySelector(".event");
        if(checkbox){
            checkbox.classList.remove("checked","checkbox");
            checkbox.classList.add("trash");
            checkbox.innerHTML = `<i class="fas fa-trash-alt" style="font-size: 40px;color: #000;"></i>`;
        }
    });
    $(".schedule-list").off("click.normalEvent");
    bindEditScheduleEvent();
});
$(".event-block").on("click",".schedule-finish-btn",function(){
    if(!isEditing) return;
    isEditing = false;
    const finishBtn = $(this);
    finishBtn.removeClass("schedule-finish-btn").addClass("schedule-edit-btn")
            .html("edit the schedule");
    $(".schedule-list").off("click.editMode",".schedule-item");
    bindNormalScheduleEvent();
    renderSchedule();
});
$(function(){
    bindNormalScheduleEvent();
    renderSchedule();
});