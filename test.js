let file = require('fs')

let file_W = (name, contents) => {
    file.writeFile(name, contents)
    console.log("Done")
}

file_W("text.txt", "Lorem ipsum et")