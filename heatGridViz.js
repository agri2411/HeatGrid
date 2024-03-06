  // Validation for number only
  function getNum(s) {
        var n = false;
        if (s.length) {
            n = parseInt(s, 10);
        }
        return n;
    }

    // Generating color based on mean and ratio
    function getColor(color1, color2, ratio) {
        var hex = function(x) {
            x = x.toString(16);
            return (x.length == 1) ? '0' + x : x;
        }
        color1 = (color1.charAt(0) == "#") ? color1.slice(1) : color1
        color2 = (color2.charAt(0) == "#") ? color2.slice(1) : color2
        var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
        var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
        var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
        return "#" + (hex(r) + hex(g) + hex(b)+'8C').toUpperCase();
        //return "rgba(" + [r,g,b,(per)].join(',')+')';
    }
    
    // checking the readability of background color if black text color is not readable on top of red bg color then change it to white text color.
    function getContrastYIQ(hexcolor) {
        var hex = (hexcolor.charAt(0) == "#") ? hexcolor.slice(1) : hexcolor;
        var r = parseInt(hex.substr(0,2),16);
        var g = parseInt(hex.substr(2,2),16);
        var b = parseInt(hex.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'black';
    }


//generating array for each individual rows
function getRowData(t) {
        var r = [],
            n;
        // if(tab6Param == 'more_analytics62' && drillLevel == 'Level1')
        //      domSelectorTD="td:nth-child(1),td:nth-child(2),td:last-child";
        // else
        //      domSelectorTD="td:first-child,td:last-child";
        //  var domSelectorTD="td:first-child,td:last-child"    
        $("td", t).not(domSelectorTD).each(function (i, el) {
            n = getNum($(el).text().replaceAll(",", ""));
            if (i > 0 && n) {
                r.push(n);
            }
        });
        return r;
    }
    
    // Default Properties    
    var center= (function () { return; })();
    var min= (function () { return; })();
    var max= (function () { return; })();
    var percent= false;
    var readable = true;
    var themes= {
            "default": {
                color_min: "#F46D43",
                color_mid: "#FCE08C",
                color_max: "#66BD63"
            },
            "blue-white-red": {
              color_min: "#312F9D",
              color_mid: "#FFFFFF",
              color_max: "#C80000"
            }
        };
       var theme= "default";
    
    // if(tab6Param == 'more_analytics62' && drillLevel == 'Level1')
    //          domSelectorTD="td:nth-child(1),td:nth-child(2),td:last-child";
    //     else
    //          domSelectorTD="td:first-child,td:last-child";

   var domSelectorTD="td:first-child,td:last-child"


    /* 
        Main calculation for row wise min, max and mean
        based on mean center number of each row we are deciding the bg color of each row
        we are checking text color readability as well
    */
    $("#table6Table tbody tr").not(domSelectorTD).each(function (ind, row) {
        var values = getRowData($(row));
         min = Math.min.apply(Math, values);
         max = Math.max.apply(Math, values);
         var rowSum=values.reduce((a,b) => a+b,0);
         mean=rowSum/values.length;
         var cellPercentage = values.map( val => (val/rowSum *100).toFixed(2))

        console.log(values, min, max, mean);
       // console.log(cellPercentage, min, max, mean);
        
         if (center === undefined) center = mean;
            var adj = center - min; 
            var ratio,color1, color2;
            
            // if(tab6Param == 'more_analytics62' && drillLevel == 'Level1')
            //     var domSelectorTD="td:not(:nth-child(1),:nth-child(2),:last-child)"
            // else
            //     var domSelectorTD="td:not(:first-child,:last-child)"
       var domSelectorTD="td:not(:nth-child(1),:nth-child(2),:last-child)"     
       $(domSelectorTD, row).each(function (ind, row) {
           var elemPer=+cellPercentage[ind]/10;
           var domPer=+cellPercentage[ind];
            var value =parseInt($(row).html().replaceAll(",", ""));
            var ratio =(center - value) / adj;
            
            if (!percent && value <= min) {
                color1 = themes[theme].color_min;
                color2 = themes[theme].color_min;
            } else if (!percent && value >= max) {
                color1 = themes[theme].color_max;
                color2 = themes[theme].color_max;
            } else if (percent && ratio <= min) {
                color1 = themes[theme].color_min;
                color2 = themes[theme].color_min;
            } else if (percent && ratio >= max) {
                color1 = themes[theme].color_max;
                color2 = themes[theme].color_max;
            } else if (value < center) {
                ratio = Math.abs(ratio);
                if (ratio < -1) ratio = -1;
                color1 = themes[theme].color_min;
                color2 = themes[theme].color_mid;
            } else {
                ratio = Math.abs(ratio);
                if (ratio > 1) ratio = 1;
                color1 = themes[theme].color_max;
                color2 = themes[theme].color_mid;
            }
            
            var color = getColor(color1, color2,ratio);
                $(this).css("cssText", "background-color:"+ color+"!important;");
            if (readable) 
                $(this).not(":nth-child(1)").css('color', getContrastYIQ(color));
            
          });
