const express = require('express');
const path = require('path');
const fs = require('fs');
const { resolve } = require('path');

const port = 3000;
const app = express()

 app.use(`/assets`,express.static(path.resolve("static-assets")))


var popularity = { pop :[] }; // array that presents the pokemons popularity

    if(fs.existsSync('popularity.json')){  // if there is a saved popularity information, get it
        const jsonString = fs.readFileSync('popularity.json')
        popularity = JSON.parse(jsonString)       
     }
     else{  // unsaved infomation, so initialize popularity
         for(var i=1;i<=151;i++) {
             popularity.pop.push(0);
             }
        }

app.get('/pokemons/:id', (req, res) => {  // pokemon profile
    
    var id = parseInt( req.params.id )
    popularity.pop[id- 1] = popularity.pop[id- 1] + 1;
    fs.writeFileSync("popularity.json", JSON.stringify( popularity))
    res.sendFile(path.resolve('profile.html'));
});

app.get('/pokemons', (req, res) => {  // all pokemons page

    res.sendFile(path.resolve('view.html'));
});


// app.get("/assets/pokemons/:id.png", (req, res) => {  //images
    
//         // check to make sure the file was properly read
//         // obj is the object from the pokedex json file
//         // extract input data from request
//         let inputId =  parseInt( req.params.id );
  
//         if(inputId < 10 && inputId > 0)
//         res.sendFile(path.resolve(`images/00${inputId}.png`));
//         else if(inputId > 9 && inputId < 100)
//         res.sendFile(path.resolve(`images/0${inputId}.png`));
//         else if(inputId > 99 && inputId < 152)
//         res.sendFile(path.resolve(`images/${inputId}.png`));
//         else{
//             res.status(404);
//             res.send("not found");
//         }
//     });

    app.get('/api/pokemons/:id', (req, res) => {  // pokemon data json object

        fs.readFile('pokemons.json', (err, obj) => {
        var pokemon;
         var currentPokemon
        let inputId =  parseInt( req.params.id );
        // find pokemon by id from the pokedex json file
        var pokemons = JSON.parse(obj);
        for( let i=0; i < pokemons.length; i++ ){
    
         currentPokemon = pokemons[i];
   
          if( currentPokemon.id === inputId )
            pokemon = currentPokemon;
          
        }
    
        if (pokemon === undefined) {
    
           // send 404 back
           res.status(404);
           res.send("not found");
         } else {

          res.send(pokemon);
         }
      });
    });

app.get('/popularity', (req, res) => { 

        res.send(popularity);
  
});

app.get('/', (req, res) => {  // main page

    res.sendFile(path.resolve('./pokemon.html'));
});

    


    // listen for requests
    app.listen(port, () => console.log(`server running on http://localhost:${port}`));

