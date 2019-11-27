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

    mountTable();
    
}

var mountTable = () =>
{
    var jsonResult = JSON.parse(this.result.toString().replace("\"{","{").replace("}\"","}"));
    var str = "<table><tr><td>Apresentação</td><td>Preço</td></tr>";
    for (var item of jsonResult.products) {
        str += "<tr><td>" + item.presentation + "</td>"
        str += "<td>" + item.regular_price + "</td></tr>"
    } 
    str += "</table>"
    console.log(str);
    document.getElementById("table").innerHTML = str;
}