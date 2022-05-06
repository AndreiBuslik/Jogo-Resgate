const start_Button = document.getElementById('inicio');
start_Button.addEventListener("click", start);

function start() {

    $("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var jogo = {};
    var fimdejogo = false;
    var velocidadeInimigo = 5; // Velocidade inicia com valor de 5 unidades
    var posicaoY = parseInt(Math.random() * 334); // Gera um valor aleatório para o inimigo 1 surgir no lado direito da tela
    var podeAtirar = true;
    var inimigoPodeAtirar = true;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var velocidadeDisparoJogador = 15;
    var velocidadeModificador = 17;
    var velocidadeDisparoInimigo = 15;
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");
    var aparecer = true;
    //var altura = window.screen.height;
    var largura = window.screen.width;
    var TECLA = {

        W: 87, /* Valor em decimal da tecla W */
        S: 83,
        D: 68

    }

    jogo.pressionou = [];
    jogo.timer = setInterval(loop, 30); // Função de tempo 'setInterval' chama a função 'loop' e roda por 30 ms

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usuário pressionou alguma tecla	
	
	$(document).keydown(function(e){

        jogo.pressionou[e.which] = true;

    });
    
    
    $(document).keyup(function(e){

        jogo.pressionou[e.which] = false;

    });

    function loop() {
	
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
        selecionaModificador();
        
    }
    
    function movefundo() {
        
        esquerda = parseInt($("#fundoGame").css("background-position")); // Pega o valor da posição da div e transforma em inteiro
        $("#fundoGame").css("background-position",esquerda-1); // A div tem sua posição diminuida em 1 px para a esquerda
        
    }

    function movejogador() {
        
        var topo = parseInt($("#jogador").css("top"));
        
        if (jogo.pressionou[TECLA.W]) {  // Move jogador para cima se a tecla W foi pressionada

            if(topo >= 15){
            
                $("#jogador").css("top",topo-10); // Move 10 unidades para cima

            }
        
        }
        
        if (jogo.pressionou[TECLA.S]) { // Move jogador para baixo se a tecla S foi pressionada
            
            if(topo <= 434){

                $("#jogador").css("top",topo+10);	 // Move 10 unidades para baixo
            
            }
            
        }
        
        if (jogo.pressionou[TECLA.D]) {
            
            disparoJogador();

        }
    
    }

    function moveinimigo1() {

        posicaoX = parseInt($("#inimigo1").css("left")); // Busca a posição horizontal do inimigo 1
        $("#inimigo1").css("left",posicaoX-velocidadeInimigo); // O inimigo 1 caminha para a esquerda
        $("#inimigo1").css("top",posicaoY); // Mantem o inimigo 1 na mesma altura onde ele surgiu
            
        if (posicaoX < - 256) { // Caso o inimigo 1 chegue no final da tela, reaparece no lado direito em alguma altura aleatória
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", largura + 128);
            $("#inimigo1").css("top",posicaoY);
                
        }

        disparoInimigo();

    }

    function moveinimigo2() {

        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX - 3);
				
		if (posicaoX < -165) {
			
		    $("#inimigo2").css("left", largura + 140);

            var amigo = document.getElementById('amigo');

            if(amigo === null){

                reposicionaAmigo();

            }
					
		}

    }

    function moveamigo() {
	
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
    
    }

    function disparoJogador() {
	
        if (podeAtirar == true) {
            
            podeAtirar = false;
        
            topo = parseInt($("#jogador").css("top"))  // Recebe a altura do jogador
            posicaoX= parseInt($("#jogador").css("left")) // Recebe o comprimento do jogador
            tiroX = posicaoX + 190; // Indica que o tiro é criado na frente do jogador
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div"); 
            $("#disparo").css("top",topoTiro); // O disparo aparece na posição indicada
            $("#disparo").css("left",tiroX);   // 
            
            somDisparo.play();

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        
        } //Fecha podeAtirar
     
        function executaDisparo() {

            posicaoX = parseInt($("#disparo").css("left")); // Recebe a posição inicial do disparo
            $("#disparo").css("left", posicaoX + velocidadeDisparoJogador); // Disparo caminha para a direita 15 unidades
    
            if (posicaoX > largura) {  // Caso chegue no final da tela
                            
                window.clearInterval(tempoDisparo); // para o cronômetro
                tempoDisparo = null; // indica que o tempo foi reiniciado
                $("#disparo").remove(); // remove o disparo da tela
                podeAtirar = true; // indica que o jogador pode atirar novamente
                        
            }

        }

    }

    function disparoInimigo(){

        if(inimigoPodeAtirar == true){

            inimigoPodeAtirar = false;
            topo = parseInt($("#inimigo1").css("top"))  // Recebe a altura do jogador
            tiroX = parseInt($("#inimigo1").css("left")) // Recebe o comprimento do jogador
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo2'></div"); 
            $("#disparo2").css("top", topoTiro); // O disparo aparece na posição indicada
            $("#disparo2").css("left", tiroX);   //

            //somDisparo.play();

            var tempoDisparo = window.setInterval(executaDisparo2, 30);

        }
       
        function executaDisparo2(){

            posicaoX = parseInt($("#disparo2").css("left")); // Recebe a posição inicial do disparo
            $("#disparo2").css("left", posicaoX - velocidadeDisparoInimigo); // Disparo caminha para a direita 15 unidades
            
            if (posicaoX < - 256) {  // Caso chegue no final da tela
                            
                window.clearInterval(tempoDisparo); // para o cronômetro
                tempoDisparo = null; // indica que o tempo foi reiniciado
                $("#disparo2").remove(); // remove o disparo da tela
                inimigoPodeAtirar = true; // indica que o jogador pode atirar novamente
                        
            }

        }
    }

    function colisao() {

        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        var colisao7 = ($("#jogador").collision($("#disparo2")));
        var colisao8 = ($("#jogador").collision($("#powerUp")));
        var colisao9 = ($("#jogador").collision($("#powerDown")));

        if (colisao1.length > 0) { // Caso ocorra uma colisão entre o jogador e o inimigo 1
		
            inimigo1X = parseInt($("#inimigo1").css("left")); // recebe a posição do inimigo
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);    // e chama a função que mostra a explosão
            energiaAtual--;
            posicaoY = parseInt(Math.random() * 334); // O inimigo 1 surge em um local aleatório na parte direita
            $("#inimigo1").css("left", largura + 128);
            $("#inimigo1").css("top",posicaoY);

        }

        if (colisao2.length > 0) {
	
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            energiaAtual--;    
            $("#inimigo2").remove();
                
            reposicionaInimigo2();
                
        }

        if (colisao3.length > 0) {
		
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            
            explosao1(inimigo1X, inimigo1Y);
            pontos = pontos + 100;
            velocidadeInimigo = velocidadeInimigo + 0.3;
            velocidadeDisparoInimigo += 0.3;
            $("#disparo").css("left", largura + 1);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", largura + 128);
            $("#inimigo1").css("top",posicaoY);
                
        }

        if (colisao4.length > 0) {
		
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            
            explosao2(inimigo2X, inimigo2Y);
            pontos = pontos + 50;
            $("#disparo").css("left", largura + 1);
            
            reposicionaInimigo2();
                
        }

        if (colisao5.length > 0) {
            
            somResgate.play();
            reposicionaAmigo();
            salvos++;
            pontos += 25;
            $("#amigo").remove();
        
        }

        if (colisao6.length > 0) {
	    
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            somPerdido.play();
            explosao3(amigoX, amigoY);
            perdidos++;

            if(pontos >= 25){

                pontos -= 25;

            }

            $("#amigo").remove();
        
            reposicionaAmigo();
                    
        }

        if(colisao7.length > 0){

            energiaAtual--;
            $("#disparo2").css("left", - 257);

        }

        if(colisao8.length > 0){

            velocidadeDisparoJogador += 5;
            $("#powerUp").css("left", - 100);

            $("#fundoGame").append("<div id='aumentoVelocidadeTiro' class='anima5'></div>");
            
            var posicaoXJogador = parseInt($("#jogador").css("left"));
            var posicaoYJogador = parseInt($("#jogador").css("top"));

            $("#aumentoVelocidadeTiro").css("left", posicaoXJogador + 80);
            $("#aumentoVelocidadeTiro").css("top", posicaoYJogador);

            var tempoAnimacao = window.setInterval(executaAnimacao, 500);

            function executaAnimacao(){

                var posicaoXJogador = parseInt($("#jogador").css("left"));
                var posicaoYJogador = parseInt($("#jogador").css("top"));

                $("#aumentoVelocidadeTiro").css("left", posicaoXJogador + 100);
                $("#aumentoVelocidadeTiro").css("top", posicaoYJogador);

                if(tempoAnimacao >= 1.5){

                    window.clearInterval(tempoAnimacao); // para o cronômetro
                    tempoAnimacao = null;

                    $("#aumentoVelocidadeTiro").remove();

                }

            }
            
        }

        if(colisao9.length > 0){

            velocidadeDisparoJogador -= 5;
            $("#powerDown").css("left", - 100);

            $("#fundoGame").append("<div id='diminuiVelocidadeTiro' class='anima6'></div>");
            
            var posicaoXJogador = parseInt($("#jogador").css("left"));
            var posicaoYJogador = parseInt($("#jogador").css("top"));

            $("#diminuiVelocidadeTiro").css("left", posicaoXJogador + 80);
            $("#diminuiVelocidadeTiro").css("top", posicaoYJogador);

            var tempoAnimacao = window.setInterval(executaAnimacao2, 500);

            function executaAnimacao2(){

                var posicaoXJogador = parseInt($("#jogador").css("left"));
                var posicaoYJogador = parseInt($("#jogador").css("top"));

                $("#diminuiVelocidadeTiro").css("left", posicaoXJogador + 100);
                $("#diminuiVelocidadeTiro").css("top", posicaoYJogador);

                if(tempoAnimacao >= 1.5){

                    window.clearInterval(tempoAnimacao); // para o cronômetro
                    tempoAnimacao = null;

                    $("#diminuiVelocidadeTiro").remove();

                }

            }
        }

    }

    function explosao1(inimigo1X, inimigo1Y) {
        
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);  // A explosão aparece no mesmo local onde o inimigo 1 estava
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow"); // Tamanho da explosão de 200, opacidade vai aumentando e ocorre lentamente
        somExplosao.play();

        var tempoExplosao = window.setInterval(removeExplosao, 1000); // A explosão deve ficar na tela durante 1 segundo
        
        function removeExplosao() {
                
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
                
        }
            
    }

    function explosao2(inimigo2X, inimigo2Y) {
	
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        somExplosao.play();

        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
                
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
                
        }
                 
    }

    function reposicionaInimigo2() {
	
        var tempoColisao4 = window.setInterval(reposiciona4, 30);
            
        function reposiciona4() {

            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;
                
            if (fimdejogo == false) {
                
                $("#fundoGame").append("<div id=inimigo2></div");
                $("#inimigo2").css("left", largura + 200);

            }
                
        }

    }

    function reposicionaAmigo() {
	
        var tempoAmigo = window.setInterval(reposiciona6, 30);
        
        function reposiciona6() {

            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            var inimigo2X = parseInt($("#inimigo2").css("left"));

            if (fimdejogo == false && inimigo2X > 200) {
            
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
                $("#amigo").css("left", -150);

            }
            
        }
        
    }

    function explosao3(amigoX, amigoY) {

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        
        function resetaExplosao3() {
        
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
                
        }
        
    }

    function placar() {
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    }

    function energia() {
	
		if (energiaAtual == 3) {
			
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if (energiaAtual == 2) {
			
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if (energiaAtual == 1) {
			
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if (energiaAtual == 0) {
			
			$("#energia").css("background-image", "url(imgs/energia0.png)");
			
			gameOver();

		}
	
	}

    function selecionaModificador(){

        var geraModificador = getRandomInt(1, 80);
        var posicaoYModificador;

        if(geraModificador === 1  && velocidadeDisparoJogador <= 25 && aparecer === true){

            aparecer = false;
            $("#fundoGame").append("<div id='powerUp'></div");
            posicaoYModificador = parseInt(Math.random() * 334);
            $("#powerUp").css("top",posicaoYModificador);
            $("#powerUp").css("left", largura - 100);

        }

        if(geraModificador === 1  && velocidadeDisparoJogador > 15 && aparecer === true){

            aparecer = false;
            $("#fundoGame").append("<div id='powerDown'></div");
            posicaoYModificador = parseInt(Math.random() * 334);
            $("#powerDown").css("top",posicaoYModificador);
            $("#powerDown").css("left", largura - 100);

        }

        movimentaModificador();

        if(buscaModificador() === null){

            aparecer = true;

        }

    }

    function movimentaModificador(){

        if(document.getElementById("powerUp")){

            posicaoX = parseInt($("#powerUp").css("left"));
            $("#powerUp").css("left", posicaoX - velocidadeModificador);

        }

        if (posicaoX < - 100) {
                
            $("#powerUp").remove();
                
        }

        if(document.getElementById("powerDown")){

            posicaoX = parseInt($("#powerDown").css("left"));
            $("#powerDown").css("left", posicaoX - velocidadeModificador);

        }

        if (posicaoX < - 100) { 
                
            $("#powerDown").remove();
                
        }

    }

    function buscaModificador(){

        var modificador = null;

        modificador = document.getElementById('powerUp');

        if(modificador === null){

            modificador = document.getElementById('powerDown');

        }

        return modificador;

    }

    function gameOver() {

        fimdejogo = true;
        musica.pause();
        somGameover.play();
        velocidadeDisparoJogador = 15;
        energiaAtual = 3
        velocidadeInimigo = 5;
        pontos = 0;
        salvos = 0;
        perdidos = 0;
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        var modificador = buscaModificador();

        if(modificador !== null){

            modificador.remove();

        }
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia'><h3>Jogar Novamente</h3></div>");
        
        const restart_Button = document.getElementById('reinicia');
        restart_Button.addEventListener("click", reiniciaJogo);

        function reiniciaJogo() {

            somGameover.pause();
            $("#fim").remove();
            start();
            
        }
        
    } 

    function getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
    
        return Math.floor(Math.random() * (max - min)) + min;
    
    }
}