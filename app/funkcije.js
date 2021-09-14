const fs=require('fs');
const datetime=require('date-and-time');
const file="proizvodi.json";
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


// citanje 
let procitajPodatkeIzFajla=()=>{
    let p=fs.readFileSync(file, (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        return data;
    });
    return JSON.parse(p);
}

// snimanje
let snimiProizvode=(data)=>{
    fs.writeFileSync(file,JSON.stringify(data));
}

exports.proizvodi=procitajPodatkeIzFajla();

// dodavanje proizvoda
exports.dodajProizvod=(noviproizvod)=>{
    let id=1;
    let proizvod={};
    let oznake=noviproizvod.oznake.split(',');
    if(proizvodi.length>0){
         id=proizvodi.length+1;
    }
   
    // izmeniti ovo treba preko for petlje
    let akcije= [];
    let akcija={"id_akcije":1,"nova_cena":parseFloat(noviproizvod.nova_cena),
                "datum_isteka":noviproizvod.datum_isteka};
    akcije.push(akcija);

    proizvod={
        "id":id,
        "naziv":noviproizvod.naziv,
        "kategorija":noviproizvod.kategorija,
        "cena":parseFloat(noviproizvod.cena),
        "tekst":noviproizvod.tekst,
        "oznake":oznake,
        "akcije":akcije
    };

    proizvodi.push(proizvod);
    snimiProizvode(proizvodi);
}

// izbacivanje proizvoda sa odredjenim id-em
exports.izbrisiProizvod=(id)=>{
    for(let i=0;i<proizvodi.length;i++){
        if(proizvodi[i].id==id){
            proizvodi.remove(i)
            snimiProizvode(proizvodi);
            break;
        }
    }
}

exports.izmeniProizvod=(izmenaProizvod)=>{
    for(let i=0;i<proizvodi.length;i++){
        if(izmenaProizvod.id==proizvodi[i].id){
            proizvodi[i].naziv=izmenaProizvod.naziv;
            proizvodi[i].kategorija=izmenaProizvod.kategorija;
            proizvodi[i].cena=izmenaProizvod.cena;
            proizvodi[i].tekst=izmenaProizvod.tekst;
            proizvodi[i].oznake=izmenaProizvod.oznake;
            if(proizvodi[i].akcije!=undefined){
                for(let j=0;j<proizvodi[i].akcije.length;j++){
                    proizvodi[i].akcije[j].nova_cena=izmenaProizvod.nova_cena;
                    proizvodi[i].akcije[j].datum_isteka=izmenaProizvod.datum_isteka;
        
                }
            }
        }
    }
    snimiProizvode(proizvodi);
}