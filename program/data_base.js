// 初始化数据库
const db = new Dexie('folder_db');
db.version(1).stores({
    folders: '++id, title',
    cards:"++id, folderId, name, relationship, tags, mark, introduction"
});

db.version(2).stores({
    folders: '++id, title',
    cards: '++id, folderId, name, relationship, tags, mark, introduction, occupation'  // 新增 occupation 字段
}).upgrade(trans => {
    return trans.table('cards').toCollection().modify(card => {
        if (card.occupation === undefined) {
            card.occupation = "";  
        }
    });
});

db.version(3).stores({
    folders: '++id, title',
    cards: '++id, folderId, name, relationship, tags, mark, introduction, occupation, recordFlase'
}).upgrade(trans => {
    return trans.table('cards').toCollection().modify(card => {
        if (card.recordFlase === undefined) {
            card.recordFlase = 0;
        }
    });
});



db.version(4).stores({
    folders: '++id, title',
    cards: '++id, folderId, name, relationship, tags, mark, introduction, occupation, recordFalse, preservedMemories',
    schedules: '++id, cardId, date, time, content'
}).upgrade(trans => {
    return trans.table('cards').toCollection().modify(card => {
        card.recordFalse = card.recordFlase;
        delete card.recordFlase;
        if (card.preservedMemories === undefined) {
            card.preservedMemories = "";
        }
    });
});

db.version(5).stores({
    folders: '++id, title',
    cards: '++id, folderId, name, relationship, tags, mark, introduction, occupation, recordFalse, preservedMemories',
    schedules: "++id, cardId, startTime, endTime, content"
}).upgrade(trans => {
    return trans.table('schedules').toCollection().modify(schedule => {
        delete schedules.date
        delete schedules.time
        if(schedules.startTime === undefined){
            schedules.startTime = "";
        }
        if(schedules.endTime === undefined){
            schedules.endTime = "";
        }
    })
});
db.version(6).stores({
    folders: '++id, title',
    cards: '++id, folderId, name, relationship, tags, mark, introduction, occupation, recordFalse, preservedMemories',
    schedules: "++id, cardId, startTime, endTime, content, finished"
}).upgrade(trans => {
    return trans.table('schedules').toCollection().modify(schedule => {
        if (schedule.finished === undefined){
            schedule.finished = 0;
        }
    });
});
class Schedule {
    constructor(cardId, startTime, endTime, content, finished) {
        this.cardId = cardId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.content = content;
        this.finished = finished !== undefined ? finished : 0;
    }
}
db.schedules.mapToClass(Schedule);


class CardV4 {
    constructor(name, tags, mark, introduction, relationship, folderId, occupation, recordFalse, preservedMemories) {
        this.name = name || "";
        this.tags = tags || [];
        this.relationship = relationship || "";
        this.folderId = folderId || "";
        this.introduction = introduction || "";
        this.mark = mark || 0;
        this.occupation = occupation || "";  
        this.recordFalse = recordFalse || 0;
        this.preservedMemories = preservedMemories || [];
    }
}

db.cards.mapToClass(CardV4);