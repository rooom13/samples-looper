const fs = require('fs');


// List all files
function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function listDir(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).filter(i => i.isDirectory()).map(dirent => dirent.name)
}

const demoProjectsDir = "public/music/"
const projectsFolders = listDir(demoProjectsDir)
let projects = {
}

projectsFolders.forEach(project => {
    projects[project] = {
        name: project,
        turntables: listDir(demoProjectsDir + project)
            .map(turntable => {
                return {
                    name: turntable,
                    disks: getFiles(demoProjectsDir + project + "/" + turntable)
                        .map(src => {
                            return {
                                src: src.replace("public/", ""),
                                name: src.split("/").pop().split(".")[0]
                            }
                        }
                    )
                }
            }
        )
    }
})


fs.writeFileSync("src/demoProjects.json", JSON.stringify(projects));
