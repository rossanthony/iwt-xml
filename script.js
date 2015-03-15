
/**
 *
 */
var resultsXmlMens, resultsXmlWomens, resultsXsl;

/**
 *
 */
function processXsl()
{
  if(document.implementation.createDocument) 
  {
      // Part 2(a) switch the xml data set depending on the users choice
      switch($('#filterForm select[name="result_set"]').val())
      {
        case 'mens':
          var xmlData = resultsXmlMens;
          break;

        case 'womens':
          var xmlData = resultsXmlWomens;
          break;
      }
      
      var parser = new DOMParser();
      modifiedXsl = parser.parseFromString(resultsXsl, "text/xml");
      
      // Now lets modify the Xsl according to the users choice of filters
      // 
      // Part 2(b) filter by name of player, either using contains or equals
      var search_name = $('#filterForm input[name="search_name"]').val();
      if(search_name !== '')
      {
        switch($('#filterForm select[name="search_name_comparison"]').val())
        {
          case 'equals':
            var search_query = "player[name='" + search_name + "']";
            break;

          case 'contains':
            var search_query = "player[contains(name,'" + search_name + "')]";
            break;  
        }
        $(modifiedXsl).find('[select="player"]').each(function(){
           $(this).attr('select', search_query);
        });
      }

      // Part 2(c) filter by number of sets



      // Part 2(d) filter by round



      // Part 2(e) change sort by round, default is ascending so only need to run this if the user has chosen desc
      if($('#filterForm select[name="sort"]').val()=='desc'){
        $(modifiedXsl).find('[select="round"]').each(function(){
           $(this).attr('order', 'descending');
        });
      }

      console.log(modifiedXsl);

      
  
      // attach the stylesheet; the required format is a DOM object, and not a string
      var xslProc = new XSLTProcessor();
      xslProc.importStylesheet(modifiedXsl);
      
      // perform the transformation
      var tmpDoc = document.implementation.createDocument("", "test", null);
      var fragment = xslProc.transformToFragment(xmlData, tmpDoc);
      //console.log(fragment);

      $('#results tbody').remove();

      // create a DOM container and insert offline
      if(fragment !== null){
        var tmpDiv = document.createElement("div");
        tmpDiv.appendChild(fragment);
        $('#results thead').after(tmpDiv.innerHTML);
        $('#debug').html('<pre><table>'+tmpDiv.innerHTML+'</table></pre>');
      }else{
        $('#results thead').after('<tbody><tr><td colspan="7">No results found</td></tr></tbody>');
      }
  }
}


$(document).ready(function(){ // ready document to be loaded

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
          resultsXmlMens = data;
        },
        error: function(data) {
          alert('Could not load the xml file!');
        }
    });

    $.ajax({
        type: "GET",
        url: "wimbledon-women-2013.xml",
        dataType: "xml",
        success: function(data) {
          // console.log(data);
          resultsXmlWomens = data;
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
          resultsXsl = data;
        },
        error: function(data) {
          alert('Could not load the xml file!');
        }
    });
});
