console.log("Hi")
// Dir store steps 

// One > 1,2,3,4
// Two > 2,4,6,8
// Three > 3,6,9,12
// #[one, two, three]
// ## [1,2,3,5]
// K:V pair

// Arr for containing all todos
let Todos_arr = []
let LOCAL_TODO_ARR;

let Local_save = () => {
    localStorage.setItem(LOCAL_TODO_ARR, JSON.stringify(Todos_arr));
}

let Local_load = () => {
    let lo_arr = JSON.parse(localStorage.getItem(LOCAL_TODO_ARR))
    Todos_arr = lo_arr ? lo_arr: []
    render();
}

// Todo Obj Constructor
function Todo_Thing(id, action, completed, step_no) {
    // Constuructor for todo obj
    this.id = id,
    this.action = action,
    this.completed = completed,
    this.step_no = step_no,
    this.update = (key, new_value) => {
        // Change value of obj based on key passed
        switch (key) {
            case "action":
                this.action = new_value
                break;
            case "completed":
                this.completed = new_value
                break;
            case "step_no":
                this.step_no = new_value
                break;
            default:
                break;
        }
    }
}

let show = ({id, action, completed, step_no}) => {
    let to_node = document.createElement("div")
    to_node.setAttribute("class", "todo")
    // Creates Step selector options
    let step_options = ""
    for (let i = 0; i <= Todos_arr.length; i++) {
        step_options += `<option value="${i}">${i}</option>`
    }

    to_node.innerHTML = `
        <h4 class="todo-step">
        STEP: <select class="todo-select" name="step-select" id="step-no-opt${id}">${step_options}</select>
        </h3>
        <p class="todo-action">Action: <span>${action}</span></P>
        <label class="todo-complete" for="todo-Completed">
            Completed:
            <input class="todo-complete-check" type="checkbox" name="todo-competed" id="todo-completed${id}">
        </label>
        <button class="btns todo-remove" id="${id}">Remove</button>
    `;
    let scrn = document.getElementById("screen");
    scrn.append(to_node);

    // Ev
    document.getElementById(id).addEventListener("click", ()=>rm_todo(id))
    document.getElementById(`todo-completed${id}`).checked = completed;
    document.getElementById(`todo-completed${id}`).addEventListener("change", ()=>toggle_completed(id))
    document.getElementById(`step-no-opt${id}`).value = step_no
    document.getElementById(`step-no-opt${id}`).addEventListener("change", ()=> update_step(id, document.getElementById(`step-no-opt${id}`).value))
}
// in Remove
let rm_todo = (e_id) => {
    //rm todo by id 
    let temp_arr = []
    Todos_arr.forEach(todo=>{
        if (todo.id != e_id) temp_arr.push(todo)
    })
    Todos_arr = temp_arr;
    render();
}
let toggle_completed = (e_id) => {
    //complete todo 
    Todos_arr.forEach(todo=>{
        if (todo.id == e_id) todo.update("completed", !todo.completed)
    })
    render()
}

let update_step = (e_id, step_v) => {
    //complete todo 
    Todos_arr.forEach(todo=>{
        if (todo.id == e_id) todo.update("step_no", step_v)
    })
    render()
}

let render = () => {
    // clears and shows items in screen
    document.getElementById("screen").innerHTML = ""
    let sort_fn = (a, b) => {
        // sort todo objs by step no
        if (a.step_no < b.step_no) return -1
        if (a.step_no > b.step_no) return 1
        return 0
    }
    Todos_arr.sort(sort_fn)
    Local_save()
    Todos_arr.forEach(todo=>show(todo))
}


// Entry
let entry_add = document.getElementById("entry-add")
let todo_entry = () => {
    let entry_action = document.getElementById("entry-action").value
    let entry_step = document.getElementById("entry-step").value
    let entry_completed = document.getElementById("entry-completed").checked
    let entry_id = Todos_arr.length+1
    
    let new_todo = new Todo_Thing(entry_id, entry_action, entry_completed, entry_step)
    Todos_arr.push(new_todo)

    render()
    //add clear fields on sub
}
entry_add.addEventListener("click", ()=>todo_entry())


//////////////////////////////////////////////////////////////////////
// Remove todos
let rm_all = document.getElementById("rm-all")
let remove_all = () => {
    // rm all todos and clear local storage
    console.log("S",Todos_arr)
    localStorage.clear()
    Todos_arr = []
    render()
}
rm_all.addEventListener("click", ()=> remove_all())

let rm_completed = document.getElementById("rm-completed")
let rm_not_completed = document.getElementById("rm-not-completed")
let remove_completed = (not=false) => {
    //rm ?completed todos
    let temp_arr = []
    Todos_arr.forEach(todo=>{
        // rm not completed
        if (todo.completed & not) temp_arr.push(todo)
        // rm completed
        if (!todo.completed & !not) temp_arr.push(todo)
    })
    Todos_arr = temp_arr;
    render();
}
rm_completed.addEventListener("click", ()=> remove_completed())
rm_not_completed.addEventListener("click", ()=> remove_completed(true))


Local_load()