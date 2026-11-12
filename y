X  Check the log lists location areas

 > Command: cat repl.log
 ├─  ✓  Expect exit code 0
 ├─  X  Expect stdout to contain all of:
 │       - 'canalave-city-area'         
 │       - 'eterna-city-area'           

 > Command exit code: 0
 > Command stdout:

                                      
> pokedex_ts@1.0.0 dev                
> npx tsc && node dist/main.js        
                                      
Pokedex > Your command was: charmander
Pokedex > Your command was: pikachu   
Pokedex >                             


Tests failed! ❌              
              
Failed Step: 1                                                    
Error: expected stdout to contain canalave-city-area

