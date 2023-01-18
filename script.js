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

let Local_load = (foreign_key) => {
    LOCAL_TODO_ARR = foreign_key;
    let lo_arr = JSON.parse(localStorage.getItem(LOCAL_TODO_ARR))
    Todos_arr = lo_arr ? lo_arr: []
    form_todo()
}

let form_todo = () => {
    document.getElementById("frame").innerHTML = `
    <header>
    <h2>Todo: ${LOCAL_TODO_ARR}</h2>
    </header>
    <div id="screen">
    </div>
    <div id="entry">
    <h3>Add Todo</h3>
    <label for="action">Activity: </label>
    <input type="text" name="action" id="entry-action">
    <label for="step">No.</label>
    <input type="number" name="step" id="entry-step">
    <label for="competed">Completed:</label>
    <input type="checkbox" name="competed" id="entry-completed">
    <button class="btns" type="submit" id="entry-add">Add</button>
    <div class="rm-block">
    <button class="btns" id="rm-completed">Delete Completed</button>
    <button class="btns" id="rm-not-completed">Delete Not Completed</button>
    <button class="btns" id="rm-all">Delete All</button>
    </div>
    </div>
    `
    
// Todo Obj Constructor
function Todo_Thing(id, action, completed, step_no) {
    // Constuructor for todo obj
    this.id = id,
    this.action = action,
    this.completed = completed,
    this.step_no = step_no
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
        No. <select class="todo-select" name="step-select" id="step-no-opt${id}">${step_options}</select>
        </h3>
        <p class="todo-action">Activity: <span>${action}</span></P>
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
    let temp_arr = []
    Todos_arr.forEach(todo=>{
        if (todo.id == e_id) todo.completed = !todo.completed
        temp_arr.push(todo)
    })
    Todos_arr = temp_arr;
    render()
}

let update_step = (e_id, step_v) => {
    //complete todo 
    let temp_arr = []
    Todos_arr.forEach(todo=>{
        if (todo.id == e_id) todo.step_no = step_v
        temp_arr.push(todo)
    })
    Todos_arr = temp_arr;
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
render();
}

//Local_load()

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let root_todos = []
let LOCAL_ROOT_ARR;

let root_Local_save = () => {
    localStorage.setItem(LOCAL_ROOT_ARR, JSON.stringify(root_todos));
}

let root_Local_load = () => {
    let root_arr = JSON.parse(localStorage.getItem(LOCAL_ROOT_ARR))
    root_todos = root_arr ? root_arr: []

}

console.log("in main")
let root_sc = () => {
    root_Local_load()
    document.getElementById("frame").innerHTML = `
        <header>
        <p>Each root Todo can hold a list (branch) of todo's which have move functions</p>
        </header>
        <div id="home-screen">
        </div>
        <div class="create-root">
        <h3>Create Root Todo</h3>
        <label for="name">Name: </label>
        <input id="root-name" type="text" name="name" id="">
        <button class="btns" id="make-root" type="submit">Create</button>
        </div>
    `
    let root_scrn = document.getElementById("home-screen")
    
    let root_show = (name) => {
        let root_nd = document.createElement("div")
        root_nd.setAttribute("class", "root-node")
        root_nd.innerHTML = `
        <a id="${name}" class="root-link" href="#">${name}</a>
        <button  class="btns root-delete" id="delete${name}" type="submit">Delete</button>
        `
        root_scrn.append(root_nd)
        document.getElementById(name).addEventListener("click", ()=>Local_load(name))
        document.getElementById(`delete${name}`).addEventListener("click", ()=> rm_root(name))
    }

    let rm_root = (r_name) => {
        //rm todo by id 
        let temp_arr = []
        root_todos.forEach(e_name=>{
            if (e_name != r_name) temp_arr.push(e_name)
        })
        root_todos = temp_arr;
        localStorage.removeItem(r_name)
        root_render();
    }

    let root_render = () => {
        root_Local_save();
        root_scrn.innerHTML = ""
        root_todos.forEach(root=> root_show(root))
    }
    
    let make_root = () => {
        let root_name = document.getElementById("root-name").value
        if (root_name.length < 1) return alert("Lenght of name cannot be les than 1")
        if (root_todos.includes(root_name)) return alert("Name already exists: Enter a different name")
        root_todos.push(root_name)
        root_render()
        root_Local_save()
    }
    root_render()
    //console.log(document.getElementById("make-root"))
    document.getElementById("make-root").addEventListener("click", ()=> make_root())
}


//document.getElementById("screen").innerHTML = `<object type="text/html" data="./main.html"></object>`
document.getElementById("return-home").addEventListener("click", ()=> root_sc())
root_sc()
