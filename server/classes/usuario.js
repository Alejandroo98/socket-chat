class Usuarios {

    constructor(){
        this.personas = [];
    }

    agregarPersona( id , nombre , sala ){

        let persona = { id , nombre , sala }

        this.personas.push( persona );

        return this.personas;
 
    }

    getPersona ( id ){

        let persona = this.personas.filter( persona => {
            return persona.id === id;
        })[0]; //Segun entendi esto lo ponemos por que filter regresa un nuevo arreglo por lo cual yo necesito siempre la primera posicion por eso ponemos las llaves en la posicion cero

        return persona;
        
    }


    getPersonas(){
        return this.personas;
    };

    getPersonasPorSala( sala ){
        let personasEnSala = this.personas.filter( persona =>  persona.sala === sala)
        console.log('getPersonasPorSala'  , personasEnSala);
        return personasEnSala
    }


    borrarPersona( id ){
        
        let personaBorrada = this.getPersona( id )
        
        this.personas = this.personas.filter( persona =>  persona.id != id ); 
        
        return personaBorrada;

    }
    
    
    
}


module.exports = {
    Usuarios
}