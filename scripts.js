
/**
 * Define globals required for initialisation on doc ready
 */
var resultsXmlMens, resultsXmlWomens, resultsXsl, filesLoaded = 0;

/**
 * Abstract function to return the operator, only returns valid operators and prevents injection of invalid operators into the xsl
 */
function getOperator(operatorWord)
{
  switch(operatorWord)
  {
    case 'equals':
      return '=';
      
    case 'greater':
      return '>';
      
    case 'less':
      return '<';
  }
}

/**
 *  The main Xsl processor run on submit 
 *     see: $(document).ready at the bottom of this file for trigger of this function
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
      
      // Setup a new Dom parser instance and create a copy of the results xsl with which we can run modification on
      var parser = new DOMParser();
      modifiedXsl = parser.parseFromString(resultsXsl, "text/xml");
      
      // Now lets modify the Xsl according to the users choice of filters
      
      // Part 2(b) filter by name of player, either using contains or equals
      var search_name = $('#filterForm input[name="search_name"]').val();
      if(search_name !== '')
      {
        switch($('#filterForm select[name="search_name_comparison"]').val())
        {
          case 'equals':
            var search_query = "player[name='" + search_name + "' or following-sibling::player[name='" + search_name + "'] or preceding-sibling::player[name='" + search_name + "']]";
            break;

          case 'contains':
            var search_query = "player[contains(name,'" + search_name + "') or following-sibling::player[contains(name,'" + search_name + "')]  or preceding-sibling::player[contains(name,'" + search_name + "')]]";
            break;  
        }

        $(modifiedXsl).find('[select="player"]').each(function(){
           $(this).attr('select', search_query);
        });
      }

      // Part 2(c) filter by number of sets
      var num_sets = $('#filterForm input[name="num_sets"]').val();
      if(num_sets!=='')
      {
        num_sets = parseInt(num_sets);

        if($.isNumeric(num_sets))
        {
          if(Math.floor(num_sets) == num_sets && num_sets > 0 && num_sets < 6)
          {
            var operator = getOperator($('#filterForm select[name="sets_comparison"]').val());
            $(modifiedXsl).find('[test="count(set)>0"]').each(function(){
               $(this).attr('test', "count(set)" + operator + num_sets);
            });
          }
          else
          {
            alert('Error: Number of sets must be a number between 1 and 5');   
          }
        }
        else
        {
          alert('Error: Number of sets must be a numeric value');
        }
      }

      // Part 2(d) filter by round
      var round = $('#filterForm input[name="round"]').val();
      if(round!=='')
      {
        round = parseInt(round);

        if($.isNumeric(round))
        {
          if(Math.floor(round) == round && round > 0 && round < 8)
          {
            var operator = getOperator($('#filterForm select[name="round_comparison"]').val());
            $(modifiedXsl).find('[test="round>0"]').each(function(){
               $(this).attr('test', "round" + operator + round);
            });
          }
          else
          {
            alert('Error: Round must be a number between 1 and 7');   
          }
        }
        else
        {
          alert('Error: Round must be a numeric value');
        }
      }

      // Part 2(e) change sort by round, default is ascending so only need to run this if the user has chosen desc
      if($('#filterForm select[name="sort"]').val()=='desc')
      {
        $(modifiedXsl).find('[select="round"]').each(function(){
           $(this).attr('order', 'descending');
        });
      }

      //console.log(modifiedXsl);

      // Setup the Xslt processor and import the dynamically modified version of the stylesheet
      var xslProc = new XSLTProcessor();
      xslProc.importStylesheet(modifiedXsl);
      
      // perform the transformation
      var tmpDoc = document.implementation.createDocument("", "test", null);
      var filteredResults = xslProc.transformToFragment(xmlData, tmpDoc);
      
      //console.log(filteredResults);

      // Clear out the old results from the last search
      $('#results tbody').remove();

      
      var result_count = 0;

      if(filteredResults !== null)
      {
        var tmpDiv = document.createElement("div");
        tmpDiv.appendChild(filteredResults);

        $(tmpDiv.innerHTML).each(function(){
            //console.log(this);
            if( $.trim($( this ).text()) !== '')
            {
              result_count++;
              $('#results').append(this);
            }
        });
      }

      if(result_count === 0){
        $('#results thead').after('<tbody class="no-results"><tr><td colspan="7">No results found, please try adjusting the filters.</td></tr></tbody>');
      }
  }
}

function init()
{
  // increment filesLoaded counter
  filesLoaded++;
  if(filesLoaded===3){
    // wait until all 3 required files have loaded then initialise by auto submitting the form to run a default search
    $('#filterForm').submit();
  }
}

$(document).ready(function(){ 

    /**
     * Override the default submit action and run the Xsl processor function above
     */    
    $('#filterForm').submit(function(e)
    {
        e.preventDefault();
        processXsl();
    });

    /**
     * Preloading the xml data sets and the raw markup contents of the xsl into the global variables
     * (only need to run this once, on document ready)
     */
    $.ajax({
        type: "GET",
        url: "thirdparty/xml/wimbledon-men-2013.xml",
        dataType: "xml",
        success: function(data) {
          resultsXmlMens = data;
          init();
        },
        error: function(data) {
          alert('Could not load xml file!');
        }
    });

    $.ajax({
        type: "GET",
        url: "thirdparty/xml/wimbledon-women-2013.xml",
        dataType: "xml",
        success: function(data) {
          resultsXmlWomens = data;
          init();
        },
        error: function(data) {
          alert('Could not load xml file!');
        }
    });

    $.ajax({
        type: "GET",
        url: "results.xsl",
        dataType: "html",
        success: function(data) {
          resultsXsl = data;
          init();
        },
        error: function(data) {
          alert('Could not load xsl file!');
        }
    });
});
