console.log("By Sironi \nhttps://github.com/Sironi-00/")

// Arr for containing all todos
let todos_arr = []
let LOCAL_TODO_ARR;

let Local_save = () => {
    localStorage.setItem(LOCAL_TODO_ARR, JSON.stringify(todos_arr));
}

let Local_load = (foreign_key) => {
    LOCAL_TODO_ARR = foreign_key;
    let lo_arr = JSON.parse(localStorage.getItem(LOCAL_TODO_ARR))
    todos_arr = lo_arr ? lo_arr: []
    form_todo()
}

let form_todo = () => {
    // todos page script
    document.getElementById("frame").innerHTML = `
        <h2 class="frame-head">Children Todo(s): ${LOCAL_TODO_ARR}</h2>
        <div id="screen">
        </div>
        <div id="entry">
        <h3>Add Todo</h3>
        <label for="activity">
            Activity: 
            <input type="text" name="activity" id="entry-activity" placeholder="E.g. Learn to Code" required="true">
        </label>
        <label for="competed">
            Completed:
            <input type="checkbox" name="competed" id="entry-completed">
        </label>
        <button class="btns" type="submit" id="entry-add">Add</button>
        <div class="rm-block">
        <button class="btns rm-btns" id="rm-completed">Delete Completed</button>
        <button class="btns rm-btns" id="rm-not-completed">Delete Not Completed</button>
        </div>
        </div>
    `
        
    // Todo Obj Constructor
    function Todo_obj(id, activity, completed, step_no) {
        // Constuructor for todo obj
        this.id = id,
        this.activity = activity,
        this.completed = completed,
        this.step_no = step_no
    }

    let to_screen = document.getElementById("screen");
    let show = ({id, activity, completed, step_no}) => {
        // Display a todo obj
        let to_node = document.createElement("div")
        to_node.setAttribute("class", "todo")
        // Creates Step selector options
        let step_options = ""
        for (let i = 0; i <= todos_arr.length; i++) {
            step_options += `<option value="${i}">${i}</option>`
        }
        to_node.innerHTML = `
            <h4 class="td-e todo-step">
            No. <select class="todo-select" name="step-select" id="step-no-opt${id}">${step_options}</select>
            </h3>
            <p class="td-e todo-activity">Activity: <span>${activity}</span></P>
            <label class="todo-complete" for="todo-Completed">
                Completed:
                <input class="todo-complete-check" type="checkbox" name="todo-competed" id="todo-completed${id}">
            </label>
            <button class="btns todo-remove" id="rm${id}">Remove</button>
            <div class="clear"></div>
        `;
        to_screen.append(to_node);

        // Todo Ev
        document.getElementById(`rm${id}`).addEventListener("click", ()=>rm_todo(id))
        document.getElementById(`todo-completed${id}`).checked = completed;
        document.getElementById(`todo-completed${id}`).addEventListener("change", ()=>toggle_completed(id))
        document.getElementById(`step-no-opt${id}`).value = step_no
        document.getElementById(`step-no-opt${id}`).addEventListener("change", ()=> update_step(id, document.getElementById(`step-no-opt${id}`).value))
    }
    // internal Remove
    let rm_todo = (e_id) => {
        //rm todo by id 
        todos_arr = todos_arr.filter((todo)=> {
            if (todo.id != e_id) return todo
        })
        return render()
    }
    let toggle_completed = (e_id) => {
        //complete todo 
        todos_arr.map((todo)=> {
            if (todo.id == e_id) todo.completed = !todo.completed
            return todo
        })
        return render()
    }

    let update_step = (e_id, step_v) => {
        //complete todo 
        todos_arr.map((todo)=> {
            if (todo.id == e_id) todo.step_no = step_v
            return todo
        })
        return render()
    }

    let render = () => {
        // clears and shows familys in screen
        let sort_fn = (a, b) => {
            // sort todo objs by step no
            if (a.no == "" && b.no != "") return 1
            if (a.no != "" && b.no == "") return -1
            
            if (a.step_no < b.step_no) return -1
            if (a.step_no > b.step_no) return 1
            return 0
        }
        todos_arr.sort(sort_fn)
        Local_save()
        to_screen.innerHTML = ""
        todos_arr.forEach(todo=>show(todo))
    }

    // Entry
    let entry_add = document.getElementById("entry-add")
    let todo_entry = () => {
        // get info from input and create a todo
        let entry_activity = document.getElementById("entry-activity").value
        let entry_completed = document.getElementById("entry-completed").checked
        let create_uid = (new_id) => {
            // unique todo id fn
            todos_arr.forEach(todo=>{
                if (todo.id == new_id) new_id = create_uid(new_id + 1)
            })
            return new_id
        }
        let entry_id = create_uid(todos_arr.length)
        // Create a todo with input
        let new_todo = new Todo_obj(entry_id, entry_activity, entry_completed, "")
        todos_arr.push(new_todo)

        render()
        // Reset input contents
        document.getElementById("entry-activity").value = ""
    }
    entry_add.addEventListener("click", ()=>todo_entry())

    //////////////////////////////////////////////////////////////////////
    // Remove todos
    let rm_completed = document.getElementById("rm-completed")
    let rm_not_completed = document.getElementById("rm-not-completed")
    let remove_completed = (not=false) => {
        //rm ?completed todos
        let rm_confirm = confirm(`Delete all ${not?"not ":""}completed todos`)
        if (!rm_confirm) {
            // confirmation
            return
        }
        todos_arr = todos_arr.filter(todo=>{
            // rm not completed
            if (todo.completed & not) return todo
            // rm completed
            if (!todo.completed & !not) return todo
        })
        render();
    }
    rm_completed.addEventListener("click", ()=> remove_completed())
    rm_not_completed.addEventListener("click", ()=> remove_completed(true))
    render();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// parent

let parents_arr = []
let LOCAL_PARENT_ARR = "Parent-Name";

let parent_Local_save = () => {
    localStorage.setItem(LOCAL_PARENT_ARR, JSON.stringify(parents_arr));
}
let parent_Local_load = () => {
    let parent_arr = JSON.parse(localStorage.getItem(LOCAL_PARENT_ARR))
    parents_arr = parent_arr ? parent_arr: []
}

let form_parent = () => {
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    // I/O
    // Export
    let export_steps = (the_parents) => {
        // Export Todos
        function Family_obj(parent, children) {
            // an obj that stores a parent and its children 
            this.parent = parent,
            this.children = children
        }

        family_arr = []
        parent_names = the_parents.forEach(parent=> {
            // Using the arr of parents to access children from localStorage
            let childs = JSON.parse(localStorage.getItem(parent.name)? localStorage.getItem(parent.name): -1)        
            family_arr.push(new Family_obj(parent.name, childs))
        })

        // *StackOverflow +
        let time = Date.now()
        let filename = `steps_todo_export ${time}.json`;
        const jsonOutput = JSON.stringify(family_arr);
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonOutput));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        
        document.body.removeChild(element);
    }
    // Import
    let import_steps = (event) => {
        // *StackOverflow + ***
        let read_file = (event) => {
            let data;
            let reader = new FileReader()
            
            function onReaderLoad(event){
                let jsonInput = JSON.parse(event.target.result)
                // Import Adding + Storing logic
                jsonInput.forEach(family=> {
                    if (family.parent == "Parent-Name") return
                    if (parents_arr.find(parent=> parent.name == family.parent)) return
                    parents_arr.push(new Parent_obj(family.parent, ""))
                    if (family.children == "-1") family.children = []
                    localStorage.setItem(family.parent, JSON.stringify(family.children));
                })
                parent_render()
            }
            reader.onload = onReaderLoad;
            reader.readAsText(event.target.files[0])
            return data
        }
        //let file = read_file(event)
        // arr of Family obj
        read_file(event)
    }
    // parent page script
    function Parent_obj(name, no) {
        this.name = name,
        this.no = no
    }
    parent_Local_load()
    let recover = () => {
        // Recover todos - If Children exist witout a parent, then the parent is recreated.
        let local_keys = Object.keys(localStorage)
        local_keys.forEach(key=> {
            if (key == "Parent-Name") return
            if (parents_arr.find(parent=> parent.name== key)) return
            parents_arr.push(new Parent_obj(key, ""))
        })
    }
    
    document.getElementById("frame").innerHTML = `
        <h2 class="frame-head">PARENT TODO (s)</h2>
        <div id="screen">
        </div>
        <div id="create-parent">
        <h3>Create parent Todo</h3>
        <label for="name">
            Name: 
            <input id="parent-name" type="text" name="name" id="" placeholder="E.g. Shopping List">
        </label>
        <button class="btns" id="make-parent" type="submit">Create</button>
        <button class="btns rm-btns" id="rm-all">Delete All</button>
        <div id="backup">
            <button class="btns"><label for="import">Import</label></button>
            <input id="import" type="file" accept=".json"/>
            <button id="export" class="btns">Export</button>
        </div>
        </div>
    `
    let to_screen = document.getElementById("screen")
    
    let parent_show = ({name, no}) => {
        let parent_nd = document.createElement("div")
        parent_nd.setAttribute("class", "parent-node")
        let parent_no_opt = ""
        for (let i = 1; i <= parents_arr.length; i++) {
            parent_no_opt += `<option value="${i}">${i}</option>`
        }
        parent_nd.innerHTML = `
            <label class="parent-no" for="parent-no">
            No. <select class="parent-select" name="parent-no" id="parent-opt-${name}">${parent_no_opt}</select>
            </label>
            <a id="${name}" class="parent-link" href="#" title="${name}">${name}</a>
            <button  class="btns parent-delete" id="delete${name}" type="submit">Delete</button>
        `
        to_screen.append(parent_nd)
        document.getElementById(name).addEventListener("click", ()=> Local_load(name))
        document.getElementById(`delete${name}`).addEventListener("click", ()=> rm_parent(name))
        // Parent No
        document.getElementById(`parent-opt-${name}`).value = no
        document.getElementById(`parent-opt-${name}`).addEventListener("change", ()=> update_parent_no(name, document.getElementById(`parent-opt-${name}`).value))
    }
    let update_parent_no = (name, new_no) => {
        // update parent's position
        parents_arr.map((parent)=> {
            if (parent.name == name) parent.no = new_no
            return parent
        })
        return parent_render()
    }
    let rm_parent = (r_name) => {
        //rm todo by id 
        let rm_confirm = confirm("This will also delete all the children")
        if (!rm_confirm) {
            return
        }
        parents_arr = parents_arr.filter(parent=>{
            if (parent.name != r_name) return parent
        })
        localStorage.removeItem(r_name);
        parent_render();
    }
    let parent_render = () => {
        // renders parent elements to the screen
        let sort_parents = (a, b) => {
            // sort todo objs by step no
            if (a.no == "" && b.no != "") return 1
            if (a.no != "" && b.no == "") return -1

            if (a.no < b.no) return -1
            if (a.no > b.no) return 1
            return 0
        }
        parents_arr.sort(sort_parents)
        parent_Local_save();
        to_screen.innerHTML = ""
        parents_arr.forEach(parent=> parent_show(parent))
    }
    
    let make_parent = () => {
        let parent_name = document.getElementById("parent-name").value
        if (parent_name.length < 1) return alert("Length of name cannot be les than 1")
        //if (parents_arr.includes(parent_name)) return alert("Name already exists: Enter a different name")
        parents_arr.push(new Parent_obj(parent_name, ""))
        parent_render()
        // Reset input contents
        document.getElementById("parent-name").value = ""
    }
    recover()
    parent_render()
    document.getElementById("make-parent").addEventListener("click", ()=> make_parent())
    document.getElementById("export").addEventListener("click", ()=> export_steps(parents_arr))
    document.getElementById('import').addEventListener('change', (event)=>import_steps(event));
    
    ////////////////////////////////////////////////////////
    // Remove all todos 
    let rm_all = document.getElementById("rm-all")
    let remove_all = () => {
        // rm all todos and clear local storage
        let rm_confirm = confirm("Delete all stored todos")
        if (!rm_confirm) {
            // confirmation
            return
        }
        localStorage.clear()
        parents_arr = []
        parent_render()
    }
    rm_all.addEventListener("click", ()=> remove_all())

}
document.getElementById("return-home").addEventListener("click", ()=> form_parent())
form_parent()
//////////////////////////////////////////////////////////////
// Theme
let theme = () => {
    // "username=Lorem; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    let theme_save = (boo) => {
        // set cookie mode depending on arg (bool)
        if (boo) return document.cookie = "theme-mode=dark; SameSite=Lax; expires=Sun, 01 Jan 2051 23:59:59 UTC; path=/;"
        return document.cookie = "theme-mode=light; SameSite=Lax; expires=Sun, 01 Jan 2051 23:59:59 UTC; path=/;"
    }
    let theme_load = () => {
        // load theme from cookie
        let get_val = document.cookie.split('; ').find((row) => row.startsWith('theme-mode='))?.split('=')[1]
        if (get_val == "dark") return false
        return true
    }
    // Dark & Light Mode
    let toggle_theme = (save=false) => {
        if (save) theme_save(theme_load())
        if (theme_load()) {
            document.documentElement.style.setProperty("--color1", "#FFF")
            document.documentElement.style.setProperty("--color2", "#000")
            document.documentElement.style.setProperty("--color3", "#265879")
            document.documentElement.style.setProperty("--rad-color", "var(--color1)")
        } else {
            document.documentElement.style.setProperty("--color1", "#265879")
            document.documentElement.style.setProperty("--color2", "#FFF")
            document.documentElement.style.setProperty("--color3", "#000")
            document.documentElement.style.setProperty("--rad-color", "radial-gradient(at 50% 50%, var(--color1) ,var(--color3))")
        }
    }
    toggle_theme()
    document.getElementById("theme-color").addEventListener("click", ()=> toggle_theme(true))
}
theme()