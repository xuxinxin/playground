(function(window, document, undefined) {

  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function setQuantities() {
    // TODO
    var metas = document.querySelectorAll('.meta');
    /*for( var meta of metas  ){
      var span = document.createElement('span');
      span.className = 'quantity';
      span.innerHTML = (Math.random()*20+ 1)>>0;
      meta.insertBefore(span, meta.getElementsByTagName('span')[0]);
    }*/
    for (var i=0 ; i<metas.length; i++){
    var meta = metas[i];
    var span = document.createElement('span');
      span.className = 'quantity';
      span.innerHTML = (Math.random()*20+ 1)>>0;
      meta.insertBefore(span, meta.getElementsByTagName('span')[0]);
    }
  }

  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
    // TODO
    var flavors = [],
        domFlavors = document.querySelectorAll('.flavor');
    /*
    for (var domFlavor of domFlavors){
      flavors.push({});
      flavors[flavors.length-1].element     = domFlavor;
      flavors[flavors.length-1].name        = domFlavor.getElementsByTagName('h2')[0].innerHTML;
      flavors[flavors.length-1].description = domFlavor.getElementsByTagName('p')[0].innerHTML;
      flavors[flavors.length-1].price       = +(domFlavor.querySelector('.price').innerHTML).replace(/\$/g, '');
      flavors[flavors.length-1].quantity    = +domFlavor.querySelector('.quantity').innerHTML;
    }*/
    for (var i = 0; i < domFlavors.length; i++) {
      var domFlavor = domFlavors[i];
      flavors.push({});
      flavors[flavors.length-1].element     = domFlavor;
      flavors[flavors.length-1].name        = domFlavor.getElementsByTagName('h2')[0].innerHTML;
      flavors[flavors.length-1].description = domFlavor.getElementsByTagName('p')[0].innerHTML;
      flavors[flavors.length-1].price       = +(domFlavor.querySelector('.price').innerHTML).replace(/\$/g, '');
      flavors[flavors.length-1].quantity    = +domFlavor.querySelector('.quantity').innerHTML;
    };
    return flavors;
  }

  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
    // TODO
    var totalPrice = 0 ;
    /*
    for( flavor of flavors ){
      totalPrice += flavor.price;
    }*/
    flavors.forEach(function(flavor,i){
      totalPrice += flavor.price;
    });
    return (totalPrice/flavors.length).toFixed(2);
  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {
    // TODO
    var filterFlavors = flavors.filter(function(e, i){
      return e.price < threshold;
    });
    return filterFlavors.map( function(e, i){
      return e.name+" costs "+e.price;
    });
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  function populateOptions(flavors) {
    // TODO
    var selector = document.getElementsByTagName('select')[0];
    flavors.forEach(function(e,i){
      option = document.createElement('option');
      option.innerHTML = e.name;
      option.value     = i
      selector.appendChild(option);
    })
  }

  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function processOrders(flavors) {
    // TODO
    var submit     = document.getElementsByTagName('input')[1],
        selector   = document.getElementsByTagName('select')[0],
        input      = document.getElementsByTagName('input')[0];
    submit.addEventListener('click', handle, false);
    function handle(event){
      var number = +input.value,
          index  = +selector.value;
      event.preventDefault();
      console.log(selector.value);
      if(!isNaN(number-index) && number<= flavors[index].quantity){
        flavors[index].quantity = flavors[index].quantity - number;
        flavors[index].element.querySelector('.quantity').innerHTML = flavors[index].quantity;
      }
    }
  }

  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
    // TODO
    var container = document.getElementById('container');
    container.addEventListener('click', handle, false);
    function handle(event){
        event = event || window.event;
        var target = event.target || event.srcElement;
        while(target && target != container){
            if(target.classList.contains('flavor')){
                target.classList.toggle('highlighted');
                break;
            }
            target = target.parentNode;
        }
    }
  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);
