var express=require("express");
var app=express();
const port=5000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var funkcijeProizvodi=require('./funkcije.js');

// zahtevi ka serveru

//welcome stranica
app.get('/',(request, response)=>{
    response.send("WELCOME");
});

app.get("/sviProizvodi",function(request,response){
    response.send(funkcijeProizvodi.proizvodi);
});





app.listen(port,()=>{console.log(`Startovan server na portu ${port}`)});