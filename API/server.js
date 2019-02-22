var express = require('express');
var app = express();
const musicFolder = "../client/public/music";
const fs = require('fs');




async function getFolderContent(folder) {
  return new Promise(resolve => {

    fs.readdir(folder, (err, files) => {

      resolve(files)
    })
  })

}

app.get('/api/loops/inFolders/:bpm', function (req, res) {
  const subfolder = req.params.bpm;

  fs.readdir(musicFolder + "/" + subfolder, (err, folders) => {
    let promises = []
    folders.forEach(folder => promises.push(getFolderContent(musicFolder + "/" + subfolder + "/" + folder)))
    Promise.all(promises).then(a => {

      let final = []
      for (folder in folders) {
        const name = folders[folder]
        final.push({
          name: name, loops: a[folder].map(a => subfolder + "/" + name + "/" + a)
        })
      }

      res.json({ folders: final })

    })

  })


})

app.get('/api/loops/fullList/:bpm', function (req, res) {

  const subfolder = req.params.bpm;
  // console.log(subfolder)


  fs.readdir(musicFolder + "/" + subfolder, (err, folders) => {

    let promises = []
    folders.forEach(folder => promises.push(getFolderContent(musicFolder + "/" + subfolder + "/" + folder)))
    Promise.all(promises)
      .then((a) => {

        let megafiles = []
        for (folder in folders) {
          for (file in a[folder]) {
            megafiles.push(subfolder + "/" + folders[folder] + "/" + a[folder][file])
          }


        }

        res.json({ files: megafiles })
      }
      )

  })

})



app.listen(3001, function () {
  console.log('API listening on port 3001!');
});