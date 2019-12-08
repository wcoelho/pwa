'use ActiveXObject'

// Regras de Negócio
var result_offline = document.getElementById("divResult_offline");
var offline = false;

if(typeof(result_offline)!=null && result_offline !=null)
{
    offline = true;
    console.log("Página em modo offline");
    document.getElementById("search").disabled = true;
    document.getElementById("search").style.visibility = "hidden";
    document.getElementById("btnSearch").textContent = "Últimas Pesquisas";
    document.getElementById("search").value = ""; 
    document.getElementById("descText").textContent = "Aplicativo em modo offline";
} else {
    offline = false;
    console.log("Página em modo online");
    document.getElementById("btnSearch").textContent = "Procurar";
    document.getElementById("search").style.visibility = "visible";
    document.getElementById("search").value = "";      
}

//INSTALAÇÃO DO APP
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);
 
function saveBeforeInstallPromptEvent(evt) {
    deferredInstallPrompt = evt;
}


function installPWA() {

    if(typeof (defferredInstallPrompt) == "function")
    {
        
        console.log("clicou em instalar");

        // CODELAB: Add code show install prompt & hide the install button.
        deferredInstallPrompt.prompt();
    
        //Interceptando se o usuário aceitou ou não a instalação
        deferredInstallPrompt.userChoice
            .then((choice) => {
                if (choice.outcome === 'accepted') {
                    console.log('Usuário aceitou', choice);
                } else {
                    console.log('Usuário não aceitou', choice);
                }
                deferredInstallPrompt = null;
            });
        } else {
            console.log("App já instalado");
        }
 
}
 
window.addEventListener('appinstalled', logAppInstalled);
 
function logAppInstalled(evt) {
    console.log('Aplicativo já está instalado.', evt);
 
}


//Função Cache - guarda tudo para ser usado no modo offline
 
var cache_cards = function(data_json){
 
    if(data_json.length > 0){
 
        var files = ['dados.json'];

        //Escrever conteudo no dados.json
    }
 
    
    //agora armazeno os arquivos que foram estruturados
    caches.open('medicines-cards').then(function(cache){
 
        cache.addAll(files).then(function(){
            console.log("Arquivos dinâmicos armazenados em cache.");
        });
 
    });
 
}



//REGRAS DE MENU MOBILE

window.onload = function() {
    if (window.jQuery) {
        $(document).ready(function() {
            $(".sidebarNavigation .navbar-collapse").hide().clone().appendTo("body").removeAttr("class").addClass("sideMenu").show();
            $("body").append("<div class='overlay'></div>");
            $(".navbar-toggle, .navbar-toggler").on("click", function() {
                $(".sideMenu").addClass($(".sidebarNavigation").attr("data-sidebarClass"));
                $(".sideMenu, .overlay").toggleClass("open");
                $(".overlay").on("click", function() {
                    $(this).removeClass("open");
                    $(".sideMenu").removeClass("open")
                })
            });
            $("body").on("click", ".sideMenu.open .nav-item", function() {
                if (!$(this).hasClass("dropdown")) {
                    $(".sideMenu, .overlay").toggleClass("open")
                }
            });
            $(window).resize(function() {
                if ($(".navbar-toggler").is(":hidden")) {
                    $(".sideMenu, .overlay").hide()
                } else {
                    $(".sideMenu, .overlay").show()
                }
            })
        })
    } else {
        console.log("sidebarNavigation Requires jQuery")
    }
}