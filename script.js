
// TODO: get the XSL stylesheet as a string
var myXslStylesheet;

// TODO: get the XML DOM data document
var myXmlData;

// init a processor
var myXslProc;

// init the final HTML
var finishedHTML = "";

function processXsl()
{
  if(document.implementation.createDocument) {
      // Mozilla has a very nice processor object
      myXslProc = new XSLTProcessor();
      
      // convert the XSL to a DOM object first
      var parser = new DOMParser();
      console.log(myXslStylesheet);
      myXslStylesheet = parser.parseFromString(myXslStylesheet, "text/xml");
      
      //console.log(myXslStylesheet);
      //$('#debug').html('<pre>'+myXslStylesheet+'</pre>');


      // attach the stylesheet; the required format is a DOM object, and not a string
      myXslProc.importStylesheet(myXslStylesheet);
      
      // do the transform (domDocument is the current HTML page you're on)
      var ownerDocument = document.implementation.createDocument("", "test", null);
      var fragment = myXslProc.transformToFragment(myXmlData, ownerDocument);
      console.log(fragment);

      // create a DOM container and insert offline
      var tmpBox = document.createElement("div");
      tmpBox.appendChild(fragment);
      
      // grab the innerHTML and write to output, and insert into HTML document
      finishedHTML = tmpBox.innerHTML;   
      $('#debug').html('<pre>'+finishedHTML+'</pre>');
  }
}


$(document).ready(function(){ // ready document to be loaded

    var xmlMensResults    = 'wimbledon-men-2013.xml';
    var xmlWomensResults  = 'wimbledon-women-2013.xml';
    
    // $.get(xmlMensResults).done(function(data){/// get the xml data from test.xml
    //     xml = $($.parseXML(data));// parse the data to xml
    //     console.log(xml);
    //     // plans= xml.find('plan');// find plans from xml
    //     // renderData(xml,plans);//  call renderdata function to render elements
    // });


    
    $('#filterForm').submit(function(e)
    {
        e.preventDefault();
        processXsl();
    });


    $.ajax({
        type: "GET",
        url: "wimbledon-men-2013.xml",
        dataType: "xml",
        success: function(data) {
          // console.log(data);
          myXmlData = data;
        },
        error: function(data) {
          alert('Could not load the xml file!');
        }
    });

    $.ajax({
        type: "GET",
        url: "results.xsl",
        dataType: "html",
        success: function(data) {
          //console.log(data);
          myXslStylesheet = data;
        },
        error: function(data) {
          alert('Could not load the xml file!');
        }
    });
});
