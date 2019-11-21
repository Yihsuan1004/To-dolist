class Schedule{
    constructor(title,date,place){
    this.title = title;
    this.date = date;
    this.place = place;  
    }
}

class UI{
    static displayTodoLists(){
    const schedules = Store.getSchedule();
    schedules.forEach((schedule) => UI.addScheduleToList(schedule));
    }
    
    //新增待辦事項到list裡面
    static addScheduleToList(schedule){
        //從DOM裡面抓取to-dolist 節點
        const list = document.querySelector('#to-dolist');
        //在to-dolist下面創造新的element'tr'
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${schedule.title}</td>
        <td>${schedule.date}</td>
        <td>${schedule.place}</td>
        <td><a href="#" class="btn btn-danger delete">X</a></td>
        `;
     list.appendChild(row);
    }
    
    //刪除schedule
    static deleteSchedule(el) {
        if(el.classList.contains('delete')){
        //parentElement兩次 選到<tr>
          el.parentElement.parentElement.remove();
        }
    }
    
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#list-form');
        
        //insertBefore(指定插入的節點，插入的節點位置) 在指定的已有子節點之前插入新的子節點。
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
    }
    
    //清除輸入框欄位裡面已經輸入的資料   
    static clearFields(){
        document.querySelector('#title').value="";
        document.querySelector('#date').value="";
        document.querySelector('#place').value="";
    }
}

//處理儲存的資料，使資料能存在local storage裡，避免重新整理後資料不見，
//我們不能將物件存於local storage 必須要是string才行,透過JSON方法進行轉換
class Store{
    static getSchedule(){
        let schedules;
        if(localStorage.getItem('schedules') === null){
            schedules = [];
        }
        else{
            //JSON.parse() 方法把會把一個JSON字串轉換成 JavaScript的數值或是物件
            schedules = JSON.parse(localStorage.getItem('schedules'));
        }
        return schedules;
    }
    
    static addSchedule(schedule){
        const schedules = Store.getSchedule();
        schedules.push(schedule);
        //reset local storage
        //JSON.stringify() 方法是將一個JavaScript值(物件或者陣列)轉換為一個 JSON字串
        localStorage.setItem('schedules',JSON.stringify(schedules))
    }
    
    static removeSchedule(place){
        const schedules = Store.getSchedule();
        schedules.forEach((schedule, index) => {
            if(schedule.place === place){
                schedules.splice(index, 1);
            }
        });
        //reset local storage
        localStorage.setItem('schedules',JSON.stringify(schedules));
    }
}



//Display schedules
//DOMContentLoaded事件是當document被完整的讀取跟解析後就會被觸發,不會等待 stylesheets, 圖片和subframes完成讀取
document.addEventListener('DOMContentLoaded',UI.displayTodoLists);

document.querySelector('#list-form').addEventListener('submit',(e)=>{
    //Prevent actual submit
    e.preventDefault();
    
    //Get form value
    const title = document.querySelector('#title').value;
    const date = document.querySelector('#date').value;
    const place = document.querySelector('#place').value;
  
    //若這三個欄位有一個為空則跳出警告
    if(title ==='' || date ==='' || place === ''){
        UI.showAlert('請填寫全部的欄位','');
    }
    else{
        const schedule = new Schedule(title,date,place);
        
        //Add Schedule to UI
        UI.addScheduleToList(schedule);
        
        //Add Schedule to store
        Store.addSchedule(schedule);
        
        //show success message
        UI.showAlert('待辦事項已新增成功','success');
    
        //清除輸入框欄位裡面已經輸入的資料
        UI.clearFields();
    }
});


//移除已新增至列表的事項
document.querySelector('#to-dolist').addEventListener('click',(e)=>{
    //Remove schedule from UI
    UI.deleteSchedule(e.target);
    
    //Remove schedule from local storage
    //e.target選到button; parentElement選到<td>標籤; previousElementSibling選到place所在的<td>
    Store.removeSchedule(e.target.parentElement.previousElementSibling.textContent);
    
    
    //Show success message
    UI.showAlert('已成功移除','success');
})

