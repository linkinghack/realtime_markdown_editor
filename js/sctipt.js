Vue.filter('date', time => moment(time).format('YYYY/MM/DD, HH:mm'));

new Vue( {
    el:"#notebook",
    name: "Notebook",
    

    data() {
        return {
            // content: 'This is a note.',  // 采用notes列表后不再需要
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId:localStorage.getItem('selectedId'),
        };
    },
 
    methods: {
        addNote() {
            const time = Date.now();
            // 新笔记对象默认值
            const note = {
                id: String(time),
                title: "New note" + (this.notes.length + 1),
                content: "**Hello!** This notebook is using [markdown](https://github.com/adam-p/markdown-here) for formating!",
                created: time,
                favorite: false, // 收藏标记
            }
            // 加入笔记列表
            this.notes.push(note);
        },

        // 采用多Note列表后不再需要
        // saveNote(val) {
        //     console.log("saving note to local");
        //     localStorage.setItem('content',val);
        //     this.reportOperation('saving');
        // },

        saveNotes(){
            localStorage.setItem('notes',JSON.stringify(this.notes));
            console.log("Notes saved locally.");
        },
        reportOperation(opname) {
            console.log('The',opname,'operation was complete');
        },
        selectNote(note) {
            this.selectedId = note.id;
        },
        removeNote() {
            if(this.selectNote && confirm("确认删除笔记？")) {
                const index = this.notes.indexOf(this.selectedNote);
                if( index !== -1){
                    this.notes.splice(index,1);
                }
            }
        },
        favoriteNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite;
        }
    },
    computed: { //计算属性
        notePreview(){
            // 渲染markdown 
            return this.selectedNote ? marked(this.selectedNote.content) :marked(this.content);
        },
        addBtnTitle() {
            return this.notes.length + 'note(s) already';
        },
        selectedNote() { // 返回Notelist 中选中id的条目
            return this.notes.find(note => note.id==this.selectedId);
        },
        sortedNotes() {
            return this.notes.slice()
                .sort( (a,b)=> a.created - b.created )
                .sort( (a,b) => (a.favorite === b.favorite) ? 0 : a.favorite? -1 : 1 )
        },

        linesCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length; // 以换行分隔
            }
        },
        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content;
                // 换行符转换为空格
                s = s.replace(/\n/g, ' ');
                // 排除开头和结尾空格
                s = s.replace(/(^\s*)|(\s*$)/gi, '');
                // 重复空格只留一个
                s = s.replace(/\s\s+/gi, ' ');
                // 返回空格数量
                return s.split(' ').length;

            }
        },
        charactersCount() { //字符数统计
            if( this.selectedNote ) {
                return this.selectedNote.content.split('').length;
            }
        }

    },

    watch: {
        /*
        content: {
            // handler (val, oldval) {
            //     console.log('new note:',val, 'old note:', oldval);
            //     localStorage.setItem('content',val); // 使用html5 localStorage API 保存内容
            // }
            handler: 'saveNote'
        },
        selectedId(val){
            console.log("selected:",val);
        } */
        notes: {
            handler: 'saveNotes',
            deep: true,
        },
        selectedId(val) {
            localStorage.setItem('selectedId',val);
        }
    },

    created() {
        // this.content = localStorage.getItem('content') || "This is default *markdown* content.";
        // this.addNote();
        // this.selectedId = this.notes[0].id;

    },

});

const html = marked('**Bold** *Italic [link](http://linkinghack.com)');
console.log(html);