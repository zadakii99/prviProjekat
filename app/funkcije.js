
const fs=require('fs');
const datetime=require('date-and-time');
const file="proizvodi.json";
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { type } = require('os');
const exp = require('constants');


// citanje 
let procitajPodatkeIzFajla=()=>{
    let p=fs.readFileSync(file, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        return data;
    });

    p=JSON.parse(p);

    return p;
}

// snimanje
let snimiProizvode=(data)=>{
    fs.writeFileSync(file,JSON.stringify({"proizvodi":data}));
}

let podaci=procitajPodatkeIzFajla();
exports.proizvodi=podaci.proizvodi;


// dodavanje proizvoda
exports.dodajProizvod=(novi_proizvod)=>{
    let id=1;

    if(this.proizvodi.length>0){
         id=this.proizvodi.length+1;
    }

    let proizvod={
        "id":id,
        "naziv":novi_proizvod.naziv,
        "kategorija":novi_proizvod.kategorija,
        "cena":parseFloat(novi_proizvod.cena),
        "tekst":novi_proizvod.tekst,
        "oznake":novi_proizvod.oznake,
    };
    if(novi_proizvod.akcije!=undefined){
        proizvod.akcije=novi_proizvod.akcije;
    }

    this.proizvodi.push(proizvod);
    snimiProizvode(this.proizvodi);
}

// izbacivanje proizvoda 
exports.izbrisiProizvod=(id)=>{
    this.proizvodi=this.proizvodi.filter(p=>p.id!=id);
    snimiProizvode(this.proizvodi);
}

// izmena proizvoda
exports.izmeniProizvod=(id,izmenjen_proizvod)=>{
    for(let i=0;i<this.proizvodi.length;i++){
        if(id==this.proizvodi[i].id){
            if(izmenjen_proizvod.naziv!=undefined) this.proizvodi[i].naziv=izmenjen_proizvod.naziv;
            if(izmenjen_proizvod.kategorija!=undefined) this.proizvodi[i].kategorija=izmenjen_proizvod.kategorija;
            if(izmenjen_proizvod.cena!=undefined) this.proizvodi[i].cena=izmenjen_proizvod.cena;
            if(izmenjen_proizvod.tekst!=undefined) this.proizvodi[i].tekst=izmenjen_proizvod.tekst;
            if(izmenjen_proizvod.oznake!=undefined) this.proizvodi[i].oznake=izmenjen_proizvod.oznake;
            if(izmenjen_proizvod.akcije!=undefined) this.proizvodi[i].akcije=izmenjen_proizvod.akcije;
            break;
        }
    }


    snimiProizvode(this.proizvodi);
}

// filtriranje
exports.filtrirajPoNazivu=(naziv)=>{
    return this.proizvodi.filter(p=>p.naziv==naziv)
}

exports.filtrirajPoKategoriji=(kategorija)=>{
   return this.proizvodi.filter(p=>p.kategorija==kategorija);
}

exports.filtrirajPoOznaci=(oznaka)=>{
    let filtrirani=[];
    for(let i=0;i<this.proizvodi.length;i++){
        let oznake=this.proizvodi[i].oznake.split(",");
        for(let j=0;j<oznake.length;j++){
            if(oznake[j]==oznaka) {
                filtrirani.push(this.proizvodi[i]);
                break;
            }
        }     
        
    }

    return filtrirani;
}
