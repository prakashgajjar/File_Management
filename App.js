const express = require('express');
const path = require('path')
const fs = require('fs');
const { name } = require('ejs');
const { isUtf8 } = require('buffer');
const app = express();

app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.get('/',(req,res)=>{
    fs.readdir('./DataFiles', (err , file)=>{
            if(file){
                res.render('index' , {file:file});
            }
            else{
                console.log('Error reading directory');
            }
    })
})

const dataFilesPath = path.join(__dirname, '/DataFiles');


app.post('/create',(req,res)=>{
    const {title , description} = req.body;
    const cleanedTitle = title.replace(/\s+/g, '_');
    const newPath = path.join(dataFilesPath , `${cleanedTitle}.txt`)
   fs.writeFile(newPath, `${description}`,(err)=>{
    console.log(err);
   })
   res.redirect('/');
})

app.get('/DataFiles/:filename',(req,res)=>{
        fs.readFile(`./DataFiles/${req.params.filename}`,"utf-8",(err , data)=>{
                res.render('detail' , {header : req.params.filename , data: data})
        })
})
app.get('/DataFiles/delete/:filename',(req,res)=>{
        fs.unlink(`./DataFiles/${req.params.filename}`,(err)=>{
         console.log(err)
        })

        res.redirect('/')
})
app.get('/DataFiles/edit/:filename',(req,res)=>{
   res.render('edit',{filename : req.params.filename})
})

app.post('/edit/result',(req,res)=>{
    const oldName = req.body.oldName.trim();
    const newName = req.body.newName.trim();
    const oldPath = path.join(dataFilesPath, oldName);
    const newPath = path.join(dataFilesPath, newName);
   fs.rename(oldPath , newPath,(err,data)=>{
    console.log(oldName , newName)
    res.redirect('/')
   })
})



app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})