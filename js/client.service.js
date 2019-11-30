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

async function getData()
{
    var client = new HttpClient();
    var medicine = document.getElementById('search').value;
    var url = "https://figgy.com.br/ws/products/" + medicine + "/-19/-43";
    await client.get(url, function(response) {
        this.result=response;
    });
    
    prepareResult();
    
}

function clearSearch(){
    document.getElementById("divResult").style.visibility='hidden';
    document.getElementById("search").value="";
    document.getElementById("divResult").innerHTML="";
}

var prepareResult = () =>
{
    var jsonResult = JSON.parse(this.result.toString().replace("\"{","{").replace("}\"","}"));
    var str = "<span class='center'><strong>Nenhum produto encontrado</strong></span>";
    if(jsonResult.products.length>0)
        str = "<br><span class='center'><strong>%%</strong></span>";

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
        str += "</div>"

    } 
        
    if(counter>0)
    {
        if(counter==1)
            msg = "Encontrado 1 produto"        
        else
            msg = "Encontrados " + counter + " produtos"

        str = str.replace("%%", msg);
    }

    document.getElementById("divResult").innerHTML = str;
    document.getElementById("divResult").style.visibility = 'visible';
}