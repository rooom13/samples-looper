const fs = require('fs');

const folder = "client/public/music"

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

const files = getFiles(folder)

fs.writeFileSync("client/src/musicFiles.json", JSON.stringify(files));
