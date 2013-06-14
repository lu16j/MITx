/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function ($) {
  exports = {};
    
  var currentThing;

  // The root element of the inspector.
  var root = null;

  var template = ""
    + "<div class='tray'>"
    + "  <textarea class='text-editor'></textarea>"
    + "  <div class='property-editor'>"
    + "    <div class='node-lookup'>"
    + "      <input class='selector' /><input class='nth' />"
    + "      <button class='inspect'>Inspect</button><button class='search'>Search</button>"
    + "    </div>"
    + "    <div class='property-list'>"
    + "     <div></div>"
    + "    </div>" 
    + "  </div>" 
    + "</div>" 
    + "<div class='handle'></div>";
  
  var toggle = function() {
      if (root.css("top") == "0px") {
        root.animate({"top":"-300px"},500);
      }
      else {
        root.animate({"top":"0px"},500);
      }
  }
  
  var listProperties = {
      "Size": ["height", "width"],
      "Position": ["top", "left"],
      "Spacing": ["margin", "padding"],
      "Color": ["background-color", "color"]
  };
    
  var displaySearch = function(selection) {
      var html = selection.html();
      var textEditor = root.find(".text-editor");
      textEditor.val(html);
      var properties = root.find(".property-list div");
      properties.empty();
      
      properties.append($('<div class="metadata"></div>').append("Tag Name: ",selection.prop("tagName")));
      properties.append($('<div class="metadata"></div>').append("Num of Children: ",selection.children().length));
      
      for(var p in listProperties) {
          var newDiv = $('<div></div>').append(p);
          properties.append(newDiv);
          for(var e in listProperties[p]) {
              var propertyValue = selection.css(listProperties[p][e]);
              if(p == "Color") {
                var colorDiv = $('<div></div>').css({width: '20px',
                                                     height: '20px',
                                                     background: propertyValue,
                                                     border: '2px solid black',
                                                     display: 'inline-block'});
                var newDiv = $('<div class="property"></div>').append(listProperties[p][e],": ",colorDiv,propertyValue);
                properties.append(newDiv);
              }
              else {
                var newDiv = $('<div class="property"></div>').append(listProperties[p][e],": ",propertyValue);
                properties.append(newDiv);
              }
          }
      }
  }
  
  var search = function() {
      var selector = root.find(".selector");
      var selectorStr = selector.val();
      var nth = parseInt(root.find(".nth").val());
      if(!isNaN(nth)) {
          selectorStr += ":eq("+String(nth)+")";
      }
      try {
        currentThing = $(selectorStr);
        displaySearch(currentThing);
      } catch(err) {}
      
  }
  
  var update = function() {
      try {
          var selector = root.find(".selector");
          var selectorStr = selector.val();
          var nth = parseInt(root.find(".nth").val());
          if(!isNaN(nth)) {
              selectorStr += ":eq("+String(nth)+")";
          }
          currentThing = $(selectorStr);
          var textEditor = root.find(".text-editor");
          var text = textEditor.val();
          currentThing.html(text);
      }
      catch(err) {
      }
  }
  
  var inspected = function() {
      $("#wrapper *").hover(inspectIn,inspectOut);
      $("#wrapper *").on("click",inspectClick);
  }
  
  var inspectIn = function() {
      $(this).attr('data-border',$(this).css("border"));
      $(this).css({'border': 'solid 4px red'});
  }
  
  var inspectOut = function() {
      $(this).css('border', $(this).attr('data-border'));
  }
  
  var inspectClick = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $("#wrapper *").css('border', $(this).attr('data-border'));
      $("#wrapper *").off();
      var selector = root.find(".selector");
      selector.val($(this).prop('tagName'));
      search();
      
//      var copy = thing.clone();
//      var newThing = $('<div></div>').append(copy);
//      newThing.html(...);
//      thing.replaceWith(newThing);
//      thing = newThing;
  }
  
  /*
   * Construct the UI
   */
  exports.initialize = function() {
    root = $("<div class='inspector'></div>").appendTo($('body'));
    root.append(template);
    root.find(".handle").on("click",toggle);
    root.find(".selector").on("keyup",search);
    root.find(".nth").on("keyup",search);
    root.find(".search").on("click",search);
    root.find(".text-editor").on("keyup",update);
    root.find(".inspect").on("click",inspected);
  };
  
  return exports;
};

/*****************************************************************************
 * Boot up the web inspector!
 *
 * This will enable you to COPY AND PASTE this entire file into any web page
 * to inspect it.
 *
 * XXX TODO!
 *  Change the CSS link below to point to the full URL of your CSS file!
 *
 *  You shouldn't need to touch anything else below.
 *
 *****************************************************************************/
(function() {
    var createInspector = function() {
      window.inspector = Inspector(jQuery);
      window.inspector.initialize();
    }

    // Add the CSS file to the HEAD
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'file:///C:/Users/xiaochun/Desktop/MIT/6.MITx/web-inspector.css'); // XXX TODO CHANGEME!!
    document.head.appendChild(css);

    if ('jQuery' in window) {
      createInspector(window.jQuery);
    } else {
      // Add jQuery to the HEAD and then start polling to see when it is there
      var scr = document.createElement('script');
      scr.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
      document.head.appendChild(scr);
      var t = setInterval(function() {
        if ('jQuery' in window) {
          clearInterval(t); // Stop polling 
          createInspector();
        }
      }, 50);
    }
})();
