var app={

  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;

 
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    alert('RING CAPTURE\nThere are 10 Levels\nTake a Ring +100\nAsteroid Collision -2 per seconds\nScore under -200 You Lose\nENJOY !!!!');
    app.vigilaSensores();
    app.iniciaJuego();

    
  },
//-------------------------------------------------------------------------------------------
  iniciaJuego: function(){

    function preload() {
        game.load.image('flor', 'assets/flor.jpg');
        game.load.audio('blaster', 'assets/blaster.mp3');
        game.load.audio('nextlevel','assets/pickup.wav');
        game.load.audio('explode', 'assets/explode1.wav');
        game.load.image('nave', 'assets/player.png');
        game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
        game.load.image('starfield', 'assets/starfield.png');
        game.load.image('piedra', 'assets/stone.png');
        game.load.image('ring', 'assets/ring.png');
  }


    var player;            var aliens;               var asteroides;             var piedra;
    var bullets;           var bulletTime = 0;       var cursors;                var fireButton;
    var explosions;        var explosiones;          var starfield;              var puntuacion = 0;
    var scoreString = '';  var scoreText;            var rings;                  var anillo;
    var datoNavex='';      var datoNavey= '';        var datosText;              var lives;
    var enemyBullet;       var firingTimer = 0;      var stateText='';           var livingEnemies = [];
    var anillosquedan=0;   var cantidadanillos = 5;  var cantidaaasteroides = 5; var fase=1; 
    var faseString ='';    var faseText;             var  ringsString='';        var ringsText;
    var blaster;           var explode;              var nextlevel;              var flor;



    function create() {


        game.physics.startSystem(Phaser.Physics.ARCADE);

        //*.- Sound
        blaster = game.add.audio('blaster');
        explode = game.add.audio('explode');
        nextlevel = game.add.audio('nextlevel');
        
        //*.-Scroll de Fondo
        starfield = game.add.tileSprite(0, 0, ancho, alto, 'starfield');
  
        //*.-El Score
       scoreString = 'Score : ';
       scoreText = game.add.text(10, 10, scoreString + puntuacion, { font: '34px Arial', fill: '#fff' });

        //*.-Informe fase
       faseString = 'Level: ';
       faseText = game.add.text(200, 20, faseString + fase, { font: '20px Arial', fill: '#fff' });

        //*.-Informe rings
       ringsString = 'Rings: ';
       ringsText = game.add.text(275, 20, ringsString + cantidadanillos, { font: '20px Arial', fill: '#fff' });

  
        //*.-The asteroides
        asteroides = game.add.group();
        asteroides.physicsBodyType = Phaser.Physics.ARCADE;
        asteroides.enableBody = true;
        createAsteroides(cantidaaasteroides);
        function createAsteroides (cantidaaasteroides) {
            for (var x = 0; x < cantidaaasteroides; x++){
                  var piedra = asteroides.create(app.inicioX(), app.inicioY(), 'piedra'); 
            }
        };
        asteroides.x = 10;
        asteroides.y = 10;
        
        //*.-The rings  
        rings = game.add.group();
        rings.physicsBodyType = Phaser.Physics.ARCADE;
        rings.enableBody = true;  
        createRings(cantidadanillos);
        function createRings (cantidadanillos) {
            for (var x = 0; x < cantidadanillos; x++)
            { 
                var anillo = rings.create(app.inicioX(), app.inicioY(), 'ring',0,true);
                anillo.enableBody = true;  
            }
        };
        rings.x = 10;  
        rings.y = 10;
        var tween = game.add.tween(asteroides).to( { x: 100,y:100 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true); 
        var tween2 = game.add.tween(rings).to( { x: 100,y:-100 }, 5000, Phaser.Easing.Linear.None, true, 0, 1000, true); 

         //*.-La Nave
        player = game.add.sprite(400, 500, 'nave');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds=true;



    } // del create
//-------------------------------------------------------------------------------------------------//
        function update(){

                if (velocidadX < 0){
                  player.body.rotation= 90;
                };
                if (velocidadX > 0){
                  player.body.rotation= 270;
                };
                if (velocidadY < 0){
                  player.body.rotation= 0;
                };

                var factorDificultad = (300 + (dificultad * 100));
                player.body.velocity.y = (velocidadY * factorDificultad);
                player.body.velocity.x = (velocidadX * (-1 * factorDificultad));

                //  Scroll the background
                starfield.tilePosition.y += 2;

                game.physics.arcade.overlap(player, asteroides, decrementaPuntuacion, null, this);
                game.physics.arcade.overlap(player, rings, incrementaPuntuacion, null, this);

                function decrementaPuntuacion (){
                    explode.play();
                    puntuacion = puntuacion-2;     
                    scoreText.text = 'Score: '+puntuacion;
                    var myVar = setInterval(function(){ setColor() }, 300);
                    if (puntuacion <= -200){
                      alert('SORRY YOU LOSE !!! Score under -200 ');
                      cantidadanillos =5
                      cantidaaasteroides =5
                      fase =1;
                      puntuacion=0;
                      app.recomienza();
                    };
                };

                function incrementaPuntuacion(player,anillo){
                  blaster.play();
                  puntuacion = puntuacion+100;
                  scoreText.text = 'Score: '+ puntuacion;
                  cantidadanillos = cantidadanillos - 1;
                  anillo.kill();
                  ringsText.text = 'Rings: ' + cantidadanillos;
                          if (cantidadanillos <= 0){
                            nextlevel.play();
                            alert('WELL DONE NEXT LEVEL !!');
                            fase++;
                            if (fase > 10){
                              nextlevel.play();
                              alert('YOU WIN !!! with Score: '+ puntuacion);
                              cantidadanillos =5
                              cantidaaasteroides =5
                              fase =1;
                              app.recomienza();
                            }
                            cantidadanillos = 5 +fase*2;
                            cantidaaasteroides = 5 + fase;
                            create(cantidaaasteroides,cantidadanillos);
                          };
                    
                      };
        } //update



      var estados = { preload: preload, create: create, update: update };
      var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);



}, //iniciajuego


//-------------------------------------------------------------------------------
  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;
    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();
    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

//--------------------------------------------------------------------------------
  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

//--------------------------------------------------------------------------------
  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

//--------------------------------------------------------------------------------
  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

//--------------------------------------------------------------------------------
  vigilaSensores: function(){

        function onError() {
            console.log('onError!');
            alert('Error de SENSORES');
        }

        function onSuccess(datosAceleracion){
          app.detectaAgitacion(datosAceleracion);
          app.registraDireccion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });

  },

  detectaAgitacion: function(datosAceleracion){
        var agitacionX = datosAceleracion.x > 10;
        var agitacionY = datosAceleracion.y > 10;

        if (agitacionX || agitacionY){
          setTimeout(app.recomienza, 1000);
        }
  },
//--------------------------------------------------------------------------------
  recomienza: function(){
    document.location.reload(true);
  },
//--------------------------------------------------------------------------------
  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  },

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}