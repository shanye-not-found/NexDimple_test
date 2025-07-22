// 初始化数据库
const db = new Dexie('folder_db');
db.version(1).stores({
    folders: '++id, title',
    cards:"++id, folderId, name, relationship, tags, mark, introduction"
});
class Card {
    constructor(name, tags, mark, introduction, relationship, folderId) {
        this.name = name || "";
        this.tags = tags || [];
        this.relationship = relationship || "";
        this.folderId = folderId || "";
        this.introduction = introduction || "";
        this.mark = mark || 0;
    }
}
db.cards.mapToClass(Card);