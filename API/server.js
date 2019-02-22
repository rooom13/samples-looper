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

app.get('/api/getMusic/:bpm', function (req, res) {

  const subfolder = req.params.bpm;
  // console.log(subfolder)


  fs.readdir(musicFolder + "/" + subfolder, (err, folders) => {

    let promises = []
    folders.forEach(folder => promises.push(getFolderContent(musicFolder + "/" + subfolder + "/" + folder)))
    Promise.all(promises)
      .then((a) => {

        let megafiles = []
        for (folder in folders) {
          console.log()
          for (file in a[folder]) {
            megafiles.push(subfolder + "/" + folders[folder] + "/" + a[folder][file])
          }


        }

        res.json({ files: megafiles })
      }
      )

  })



  // folders.forEach((folder) => {
  //   fs.readdir(musicFolder + "/" + subfolder + "/" + folder, (err, files) => {
  //     files.forEach((file) => {
  //       const filename = subfolder + "/" + folder + "/" + file
  //       megafiles.push(filename)
  //     })
  //     console.log(megafiles)

  //   })
  // })
})



app.listen(3001, function () {
  console.log('API listening on port 3001!');
});