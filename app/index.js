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

// svi proizvodi
app.get("/sviProizvodi",function(request,response){
    response.send(funkcijeProizvodi.proizvodi);
});

// dodavanje proizvoda
app.post("/dodajProizvod",function(request,response){
    funkcijeProizvodi.dodajProizvod(request.body);
    response.send("Dodat proizvod!");
 });

// brisanje proizvoda
app.delete('/izbrisiProizvod/:id',(request, response)=>{
    funkcijeProizvodi.izbrisiProizvod(request.params["id"]);
    response.send("Izbrisan proizvod");
});

// izmena proizvoda
app.post("/izmeniProizvod/:id",(request,response)=>{
    funkcijeProizvodi.izmeniProizvod(request.params["id"],request.body);
    response.send("Izmenjen proizvod!");
});

// filtriranje
app.post("/filtrirajPoNazivu",function(request,response){
    response.send(funkcijeProizvodi.filtrirajPoNazivu(request.body.naziv));
});

app.post("/filtrirajPoKategoriji",function(request,response){
    response.send(funkcijeProizvodi.filtrirajPoKategoriji(request.body.kategorija)); 
});

app.post("/filtrirajPoOznaci",function(request,response){
    response.send(funkcijeProizvodi.filtrirajPoOznaci(request.body.oznaka)); 
});



app.listen(port,()=>{console.log(`Startovan server na portu ${port}`)});