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
}

async function getData()
{    
    document.getElementById("loading").style.visibility='visible';
    var client = new HttpClient();
    var medicine = document.getElementById('search').value;
    var url = "https://figgy.com.br/ws/products/" + medicine + "/-19/-43";
    await client.get(url, function(response) {
        this.result=response;
        prepareResult();
        document.getElementById("loading").style.visibility='hidden';
    });   
    
}

function clearSearch(){
    document.getElementById("divResult").style.visibility='hidden';
    document.getElementById("search").value="";
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
}