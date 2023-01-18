console.log("in main")
let root_todos = []

function root_obj(name, bind) {
    this.name = name,
    this.bind = bind
}

let root_scrn = document.getElementById("home-screen")

let root_show = ({name, bind}) => {
    let root_nd = document.createElement("div")
    root_nd.setAttribute("class", "root-node")
    root_nd.innerHTML = `
    <a id="${name}" href="">${name}</a>
    <button type="submit">Delete</button>
    `
    
    root_scrn.append(root_nd)
    document.getElementById(name).addEventListener("click", ()=>Local_load())
}
let root_render = () => {
    root_scrn.innerHTML = ""
    root_todos.forEach(root=> root_show(root))
}

let make_root = () => {
    let root_name = document.getElementById("root-name").value
    if (root_name.length < 1) return "404"
    let new_obj = new root_obj(root_name, "#")
    root_todos.push(new_obj)
    root_render()
}
document.getElementById("make-root").addEventListener("click", ()=> make_root())
