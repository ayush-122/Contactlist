const express =require('express');
const path =require('path');
const port=8000;
const bodyparser =require('body-parser');

const db =require('./config/mongoose');

const Contact =require('./models/contact.js')

const app =express();
// body parser middle ware
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static('assets'));

// view engine setup
app.set('view engine', 'ejs');
app.set('views' ,path.join(__dirname,'views'));

let contactList= [
            {
                name: "Ayush Singh",
                phone: "9450216181"
            },

            {
                name:"Piyush Singh",
                phone:"7388801606"
            },

            {
                name:"Virendra Bahadur Singh",
                phone: "8173079917"
            }
]


app.get('/', async function(req, res)
{

    try
    {
        const contacts=  await Contact.find({});
         res.render('home',{
            title:'My contact list',
            contact_list:contacts
         });
     
    }
    catch (err)
    {
        console.error('Error fetching contacts from DB:', err);
        res.status(500).send('Internal Sever error');
    }
    
});


app.get('/practice',function(req,res)
{
    res.render('practice',
    {
      title:"Let's pracetice"  
    });
})

app.post('/create-contact' ,function(req, res)
{
//     console.log(req.body);
//    contactList.push(req.body);

  Contact.create({
    name:req.body.name,
    phone:req.body.phone
  })
  .then(function(newContact)
  {
    console.log('******',newContact);
    return res.redirect('back');
  })
  .catch(function(err)
  {
    console.error('Error creating Contact',err);
    return res.status(500).send('Internal Server Error');
  });
   

});

app.get('/contact-delete/' , async function(req ,res)
{
    let id =req.query.id;
    try
    {
   await Contact.findByIdAndDelete(id);
     return res.redirect('back');
    }
    catch(err)
    {
        console.error('Error deleting the record');
        return res.status(500).send('Internal Server Error');
    }


});



app.listen(port ,function(error)
{
    if(error)
    {
        console.log('error on running the server',port);
        return;
    }
    console.log('my express server is running on port',port);
})