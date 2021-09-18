const express=require('express');
const axios=require('axios');
const fs=require('fs');
//const path=require('path');
const { request } = require('express');
const port = 5001;
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync("./views/"+naziv+".html","utf-8")
}

function vratiProizvode(){
    return axios.get("http://localhost:5000/sviProizvodi");
}

// pocetna
function prikaziProizvode(proizvodi){
    let prikaz="<table border='2px solid black'><tr><th>ID</th></th><th>Naziv</th><th>Kategorija</th><th>Cena</th><th>Tekst</th><th>Oznake</th><th>Akcije</th></tr>";
    
    for(let i=0;i<proizvodi.length;i++){
        prikaz+=`<tr>
        <td>${proizvodi[i].id}</td>
        <td>${proizvodi[i].naziv}</td>
        <td>${proizvodi[i].kategorija}</td>
        <td>${proizvodi[i].cena}</td>
        <td>${proizvodi[i].tekst}</td>      
        <td><table>`;

        prikaz+=`<tr><td>${proizvodi[i].oznake}</td></tr>`;
        prikaz+=`</table></td><td><table>`;

        if(proizvodi[i].akcije!=undefined){
        for(let j=0;j<proizvodi[i].akcije.length;j++)
            {
             prikaz+=`<tr>
                      <td>Cena:${proizvodi[i].akcije[j].nova_cena}
                      Datum isteka:${proizvodi[i].akcije[j].datum_isteka}</td></tr>`; 
            }  
        }

        prikaz+=`</table></td>
        <td><a href="/obrisi/${proizvodi[i].id}">Obrisi</a></td>
        <td><a href="/izmeni/${proizvodi[i].id}">Izmeni</a></td>
        </tr>`;    
    }


    return prikaz;
}

// pocetna
app.get("/",function(req,res){

    Promise.all([vratiProizvode()])
        .then(function (results) {
            let proizvodi=results[0].data;
            res.send(procitajPogledZaNaziv("index").replace("#{data}",prikaziProizvode(proizvodi)));
        }).catch(error => {
            console.log(error);
        });
        
        //res.end();

    
})


// brisanje
app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:5000/izbrisiProizvod/${req.params["id"]}`)
    res.redirect("/");
});

// izmena
app.get("/izmeni/:id",function(req,res){   
    Promise.all([vratiProizvode()])
    .then(function (results) {
        let id=parseInt(req.params["id"]);
        let proizvodi=results[0].data;
        let proizvod=proizvodi.filter(p=>p.id==id)[0];
        
        let akcije="";
        if(proizvod.akcije!=undefined){
            for(let i=0;i<proizvod.akcije.length;i++){
                akcije+=proizvod.akcije[i].id_akcije+" "+proizvod.akcije[i].nova_cena+" "+proizvod.akcije[i].datum_isteka+"<br>"
            }
        }
        

        res.send(procitajPogledZaNaziv("izmena").
        replace("#{id}",proizvod.id+"<input type='hidden' name='id' value='"+proizvod.id+"'>").
        replace("#{naziv}",proizvod.naziv).
        replace("#{kategorija}",proizvod.kategorija).
        replace("#{cena}",parseFloat(proizvod.cena)).
        replace("#{tekst}",proizvod.tekst).
        replace("#{oznake}",proizvod.oznake).
        replace("#{akcije}",akcije));


    }).catch(error => {
        console.log(error);
});
})

app.post("/izmeni",function(req,res){
    let data={};
    let akcije=[];
    if(req.body.naziv!=undefined && req.body.naziv!="") data.naziv=req.body.naziv;
    if(req.body.kategorija!=undefined && req.body.kategorija!="") data.kategorija=req.body.kategorija;
    if(req.body.cena!=undefined && req.body.cena!="") data.cena=req.body.cena;
    if(req.body.tekst!=undefined && req.body.tekst!="") data.tekst=req.body.tekst;
    if(req.body.oznake!=undefined && req.body.oznake!="") data.oznake=req.body.oznake;
    if(req.body.akcije!=undefined && req.body.akcije!=""){
        let words=req.body.akcije.split(';');

        for(let i=0;i<words.length;i++){
            let pom=words[i].split(',');

            akcije.push({
                "id_akcije":pom[0],
                "nova_cena":pom[1],
                "datum_isteka":pom[2]
            });
        }
        
        data.akcije=akcije;
    }

    axios.post("http://localhost:5000/izmeniProizvod/"+req.body.id,data).catch(error => {
        console.log(error);        
    });

    res.redirect("/"); 
});


// dodavanje
app.get("/dodavanje",(req,res)=>{
    res.send(procitajPogledZaNaziv("dodavanje"));
});

app.post("/dodaj",function(req,res){
    let data={};
    let akcije=[];
    if(req.body.naziv!=undefined && req.body.naziv!="") data.naziv=req.body.naziv;
    if(req.body.kategorija!=undefined && req.body.kategorija!="") data.kategorija=req.body.kategorija;
    if(req.body.cena!=undefined && req.body.cena!="") data.cena=req.body.cena;
    if(req.body.tekst!=undefined && req.body.tekst!="") data.tekst=req.body.tekst;
    if(req.body.oznake!=undefined && req.body.oznake!="") data.oznake=req.body.oznake;
    if(req.body.akcije!=undefined && req.body.akcije!=""){
        let words=req.body.akcije.split(';');

        for(let i=0;i<words.length;i++){
            let pom=words[i].split(',');

            akcije.push({
                "id_akcije":pom[0],
                "nova_cena":pom[1],
                "datum_isteka":pom[2]
            });
        }
        
        data.akcije=akcije;
    }

    axios.post("http://localhost:5000/dodajProizvod",data).catch(error => {
        console.log(error);        
    });

    res.redirect("/"); 
});


// filtriranje

app.post("/filtriraj",(req,res)=>{
    if(req.body.naziv!=undefined && req.body.naziv!=""){
        Promise.all([axios.post("http://localhost:5000/filtrirajPoNazivu",{"naziv":req.body.naziv})])
        .then(function (results) {
              res.send(procitajPogledZaNaziv("index").replace("#{data}",prikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
        });

    }else if(req.body.kategorija!=undefined && req.body.kategorija!=""){
        Promise.all([axios.post("http://localhost:5000/filtrirajPoKategoriji",{"kategorija":req.body.kategorija})])
        .then(function (results) {
              res.send(procitajPogledZaNaziv("index").replace("#{data}",prikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
        });
            
    }else if(req.body.oznaka!=undefined && req.body.oznaka!=""){
        Promise.all([axios.post("http://localhost:5000/filtrirajPoOznaci",{"oznaka":req.body.oznaka})])
        .then(function (results) {
              res.end(procitajPogledZaNaziv("index").replace("#{data}",prikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
        });
    }else{
        res.redirect("/"); 
    }

        
});



app.listen(port,()=>{console.log(`startovan klijent na portu ${port}`)});