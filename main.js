let todolist=JSON.parse(localStorage.getItem('todos'))||[];
let make_todos_form=document.querySelector('.make-todos-form');
let form=document.querySelector('form');
let submit=document.querySelector('.submit-button');
let main_todo=document.querySelector('#create-title');
let date=document.querySelector('input[type="date"]');
let create_button=document.querySelector('.new-todo');
class todo{
    constructor(title,priority,date,steps=[],checked){
        this.title=title;
        this.priority=priority;
        this.date=date;
        this.steps=steps;   
        this.checked=checked;
    }
}
class step{
    constructor(title,checked){
        this.title=title;
        this.checked=checked;
    }
}
function create_el(el,class_name,id_name,content){
    a=document.createElement(el);
    if (class_name) a.className=class_name;
    else if(id_name)a.setAttribute('id',id_name);
    a.innerText=content;
    return a
}
function create_todo_card(content,priority,date,check,steps,todo){
    //main title
    let todo_cards=document.querySelector('.todo-cards');
    let title_wrapper=create_el('div','title-wrapper','','')
    let priority_card=create_el('span','material-icons '+priority,'','radio_button_unchecked');
    let new_card=create_el('div','todo-card','','');
    let title=create_el('div','title','','');
    let todo_title=create_el('input','','','');
    todo_title.setAttribute('type','text');
    todo_title.value=content;
    todo_title.readOnly=true;
    let icons=create_el('div','icons','','');
    icons.innerHTML=` <p class="material-icons">edit</p>
    <label class="container-checkmark">
        <input type="checkbox" class="check">
        <span class="checkmark"></span>
    </label>
    <p class="delete flex">X</p>`
    icons.querySelector('.check').checked=check;
    if(check)todo_title.className='finished';
    let deadline=create_el('div','deadline','',`Deadline:${(date)?date:'none'}`);
    let step_cards=create_el('div','steps','','');
    title.appendChild(title_wrapper);
    title.appendChild(priority_card);
    title.appendChild(todo_title);
    title.appendChild(icons);
    title.appendChild(deadline);
    new_card.appendChild(title);
    steps.forEach((card)=>{
        let step_card=create_el('div','title','','');
        let step_title=create_el('input','','','');
        step_title.readOnly=true;
        step_title.setAttribute('type','text');
        step_title.value=card.title;
        let step_icons=icons.cloneNode(true);
        step_icons.querySelector('.check').checked=card.checked;
        if(card.checked)step_title.className='finished';
        step_icons.querySelector('.material-icons').addEventListener('click',()=>{
            step_title.readOnly=false;
            step_title.focus()
            step_title.style.borderBottom='solid black 1px';
            step_title.addEventListener('blur',e=>{
                card.title=e.target.value;
                localStorage.setItem('todos',JSON.stringify(todolist));
                step_title.style.borderBottom='none';
            })
        })
        step_icons.querySelector('.check').addEventListener('input',()=>{
            card.checked=step_icons.querySelector('.check').checked;
            step_title.classList.toggle('finished');
            localStorage.setItem('todos',JSON.stringify(todolist));
        })
        step_icons.querySelector('.delete').addEventListener('click',()=>{
            let step_index=Array.prototype.indexOf.call(document.querySelectorAll('.steps>.title'),step_card);
            steps.splice(step_index,1);
            localStorage.setItem('todos',JSON.stringify(todolist));
            if(steps.length===0) step_cards.remove();
            else step_card.remove();
        })
        step_card.appendChild(step_title);
        step_card.appendChild(step_icons);
        step_cards.appendChild(step_card);
    })
    if(steps.length>0) new_card.appendChild(step_cards);
    todo_cards.appendChild(new_card);
    title_wrapper.addEventListener('click',()=>{
        step_cards.classList.toggle('open');
    })
    icons.querySelector('.material-icons').addEventListener('click',()=>{
        todo_title.readOnly=false;
        todo_title.focus();
        todo_title.style.borderBottom='solid black 1px';
        todo_title.addEventListener('blur',e=>{
            let index=Array.prototype.indexOf.call(todo_cards.querySelectorAll('.todo-card'),new_card);
            todolist[index].title=e.target.value;
            localStorage.setItem('todos',JSON.stringify(todolist));
            todo_title.style.borderBottom='none';
        })
    })
    icons.querySelector('.check').addEventListener('input',()=>{
        let index=Array.prototype.indexOf.call(todo_cards.querySelectorAll('.todo-card'),new_card);
        todolist[index].checked=icons.querySelector('.check').checked;
        todo_title.classList.toggle('finished');
        localStorage.setItem('todos',JSON.stringify(todolist));
    })
    icons.querySelector('.delete').addEventListener('click',()=>{
        let index=Array.prototype.indexOf.call(todo_cards.querySelectorAll('.todo-card'),new_card);
        todolist.splice(index,1);
        localStorage.setItem('todos',JSON.stringify(todolist));
        new_card.remove();
    })
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    steps_list=[];
    document.querySelectorAll('.new-steps input').forEach(value=>steps_list.push(new step(value.value,false)));
    const todo_card=new todo(main_todo.value,document.querySelector("input[name='priorities']:checked").value,date.value,steps_list,false);
    todolist.push(todo_card);
    localStorage.setItem('todos',JSON.stringify(todolist));
    make_todos_form.style.display='none';
    form.reset();
    document.querySelectorAll('.new-step').forEach(e=>e.remove());
    display_cards();
})
function display_cards(){
    document.querySelector('.todo-cards').innerHTML='';
    todolist.forEach((todo)=>create_todo_card(todo.title,todo.priority,todo.date,todo.checked,todo.steps));
}
//create button for the form
create_button.addEventListener('click',()=>make_todos_form.style.display='block');
//delete button for the form
document.querySelector('.form>.delete').addEventListener('click',()=>make_todos_form.style.display='none');
//create new step
document.querySelector('.create-step').addEventListener('click',()=>{
    let new_step=create_el('div','new-step flex','','');
    new_step.innerHTML=`<input type="text">
    <p class="delete flex">X</p>`;
    document.querySelector('.new-steps').appendChild(new_step);
    //delete button for the new steps
    document.querySelectorAll('.new-step .delete').forEach(node=>{
        node.addEventListener('click',()=>node.parentElement.remove())
    })
})
display_cards();
