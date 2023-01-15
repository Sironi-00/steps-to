console.log("Hi")
// Dir store steps 

// One > 1,2,3,4
// Two > 2,4,6,8
// Three > 3,6,9,12
// #[one, two, three]
// ## [1,2,3,5]
// K:V pair

function Todo_Thing(action, completed, step_no) {
    // Constuructor for todo obj
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

let show = ({action, completed, step_no}) => {
    console.log(action)
    console.log(completed)
    console.log(step_no)
}
//show(asd)

//////////////////////////////////////////////////////
// Arr for containing all todos
let Todos_arr = []

let ta = new Todo_Thing("Born", true, 0)
let tb = new Todo_Thing("Live", true, 1)
let tc = new Todo_Thing("Die", false, 2)

Todos_arr.push(ta,tb,tc)

Todos_arr.forEach(todo=>show(todo))
