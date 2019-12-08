var result={};

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

function openMedicineData(medicine){

    try {

        var mapForm = document.createElement("form");
        mapForm.id = "hiddenForm";
        mapForm.target = "Map";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = "http://www.anvisa.gov.br/datavisa/fila_bula/frmResultado.asp";


        var mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = "txtMedicamento";
        mapInput.value = medicine;
        mapInput.id = "txtMedicamento";
        mapInput.style = "visibility: hidden";
        mapForm.appendChild(mapInput);

        document.body.appendChild(mapForm);

        map = window.open("", "Map", "status=0,title=0,scrollbars=1");

        if (map) {
            mapForm.submit();
        } else {
            alert('Você deve permitir popup para o correto funcionamento do aplicativo.');
        }

    }catch (Exception) {
        document.getElementById("divResult").innerHTML = "Houve problema de conexão";
        document.getElementById("divResult").style.visibility = 'visible';
    }
}

async function getData()
{  
    if(!offline)
    {
        try{
            document.getElementById("loading").style.visibility='visible';
            document.getElementById("search").disabled=true;
            var client = new HttpClient();
            var medicine = document.getElementById('search').value;
            var url = "https://figgy.com.br/ws/products/" + medicine + "/-19/-43";
            await client.get(url, function(response) {
                this.result=response;                
                prepareResult();                
                document.getElementById("loading").style.visibility='hidden';
                document.getElementById("search").disabled=false;
            });
        }catch (Exception) {
            document.getElementById("divResult").innerHTML = "Houve problema de conexão";
            document.getElementById("divResult").style.visibility = 'visible';
        }
    }else {

        getDataOffline();
    }
    
}

function getDataOffline()
{
    console.log("Lendo arquivo de dados offline");
    var ajax = new XMLHttpRequest();
 
    ajax.open("GET", "dados.json",true);
    ajax.send();
    
    ajax.onreadystatechange = function(){
    
        //Verificar se JSON foi baixado com sucesso
        if(ajax.readyState == 4 && ajax.status == 200){
    
            var data = ajax.responseText;
            var data_json = JSON.parse(data);
    
            if(data_json.length == 0){
                document.getElementById("divResult").innerHTML = "Houve problema de ao ler os dados em modo offline";
                document.getElementById("divResult").style.visibility = 'visible';
               
            }else{

                this.result = data_json;
                prepareResult();
            }
        }
    }
}

function clearSearch(){
    document.getElementById("divResult").style.visibility='hidden';
    document.getElementById("search").value="";
    document.getElementById("search").disabled=false;
    document.getElementById("divResult").innerHTML="";
    if(document.getElementById("hiddenForm")!=undefined)
        document.getElementById("hiddenForm").innerHTML="";
    this.result={};
}

var prepareResult = () =>
{
    var jsonResult = JSON.parse(this.result.toString().replace("\"{","{").replace("}\"","}"));
    var str = "<span class='center'><strong>%%</strong></span>";

    var counter=jsonResult.products.length;
    for (var item of jsonResult.products) {
        if(item.priceRange==0)
        {
            counter--;
            continue;
        } 
        str += "<div class='card-body'>";
        str += "<strong>Nome Comercial:</strong> " + item.comercial_name + "<br>";
        str += "<strong>Laboratório:</strong> " + item.laboratory + "<br>";
        str += "<strong>Apresentação: </strong>" + item.presentation + "<br>";
        

        priceRange = parseFloat(Math.round(item.priceRange * 100) / 100).toFixed(2);
        str += "Encontrado em " + item.foundDrugstores;
        if(item.foundDrugstores>1)
            str+= " drogarias <br>";
         else
            str += " drogaria <br>";

        str += "<strong>Preço Médio:</strong> R$ " + priceRange + "<br>";
        str += "<strong><a src='#' onclick='openMedicineData(\"" + item.comercial_name + "\")'>Acesso à bula</a></strong><br>";
        str += "</div>"

    } 
        
    if(counter>0)
    {
        if(counter==1)
            msg = "<br>Encontrado 1 produto"        
        else
            msg = "<br>Encontrados " + counter + " produtos"

        
    } else {
        msg = "Nenhum produto encontrado";
    }
    
    str = str.replace("%%", msg);

    document.getElementById("divResult").innerHTML = str;
    document.getElementById("divResult").style.visibility = 'visible';

    setTimeout(function(){
        cache_cards(jsonResult.products);
    },2000);

}