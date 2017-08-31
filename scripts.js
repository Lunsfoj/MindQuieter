$(function(){
    //set canvas and context
    var my_canvas = document.getElementById("canvas");
    var ctx = my_canvas.getContext("2d");

    var rad = document.getElementById("rad");
    var rc = document.getElementById("rc");
    var space = document.getElementById("spacing");
    var bred = document.getElementById("br");
    var bgreen = document.getElementById("bg");
    var bblue = document.getElementById("bb");
    var background = document.getElementById("background");
    var rvariance = document.getElementById("rvariance");
    var gvariance = document.getElementById("gvariance");
    var bvariance = document.getElementById("bvariance");
    var variance = document.getElementById("variance");

    //set center coordinates of canvas
    var width = my_canvas.width;
    var height = my_canvas.height;
    
    //declare global variables
    //x-y axis coordinates
    var x, y;
    
    //variables to store movement in cardinal directions
    var n, e, s, w;
    
    var color;

    //set red green blue variables for color generator
    var tempr = 255;
    var tempg = 255;
    var tempb = 255;
    var r, g, b;
    
    //set variables for change in foreground color
    var rvar = 0;
    var gvar = 0;
    var bvar = 0;
    
    //set red green blue variable for background color
    var br = 0;
    var bg = 0;
    var bb = 0;
    
    var radius = 100;
    //set amount of radial change
    var rChange = 0;
    //set spacing between circles
    var spc;
    
    //variable to stop animation
    var stop;
    
    //var used by animate to determine if vars should shrink or grow
    var shrink, rc_shrink, spc_shrink;
    
    //var to check for fullscreen
    var fullscreen = false;
    
    //initialize tooltips
    $('button').tooltip();
    $('[data-toggle="tab"]').tooltip();
    $('[class="nav active"]').click(function(){
        $('nav-tab').tooltip('hide');
    });
    
    
    //reset variables with each redraw (when input received from user or with each call of requestanimationframe)
    function resetVars(){
        x = width/2;
        y = height/2;

        n = y;
        e = x;
        s = y;
        w = x;
        
        spc = parseFloat(space.value);
        rChange = parseFloat(rc.value);
        radius = parseFloat(rad.value);
        rvar = parseFloat(rvariance.value);
        gvar = parseFloat(gvariance.value);
        bvar = parseFloat(bvariance.value);
        
        r = tempr;
        g = tempg;
        b = tempb;
        
       
        
    }


    //draws a cricle
    function draw(x,y,radius){
        if(radius > 0){
            color = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.beginPath();
            ctx.arc(x,y,radius,0,2*Math.PI);
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
    

    //recursive function to create pattern of 8 circles per recursion - calls draw function
    function pattern(){
        e = e + spc;
        s = s + spc;
        w = w - spc;
        n = n - spc;
        radius = radius + rChange;
        //change color values ensuring values remain within 0 - 255 range
        if((r + rvar <= 255) && (r + rvar >= 0)){
            r = r + rvar;
        }
        if((g + gvar <= 255) && (g + gvar >= 0)){
            g = g + gvar;
        }
        if((b + bvar <= 255) && (b + bvar >= 0)){
            b = b + bvar;
        }
    
        //check if coordinates are on canvas
        if(e < width){
            draw(e,s,radius);
            draw(x,s,radius);
            draw(x,n,radius);
            draw(e,y,radius);
            draw(w,y,radius);
            draw(w,n,radius);
            draw(e,n,radius);
            draw(w,s,radius);
            pattern();
        }
    }
    
    //redraws after user input and during animation
    function redraw(){
    
        ctx.clearRect(0,0,canvas.width,canvas.height);
        resetVars();
        my_canvas.style.background = 'rgb(' + br + ',' + bg + ',' + bb + ')';
        pattern();
        
    }
    

    
    
    //listen for user input to radius
    rad.addEventListener('input', function(){
        if(parseFloat(rad.value) + parseFloat(rc.value) > 0.01){
            radius = parseFloat(rad.value);
          //  radius = temprad;
            redraw();
        }
        
    });
    
    //listen for user input to radial change
    rc.addEventListener('input', function(){
        if(parseFloat(rad.value) + parseFloat(rc.value) > 0.01){
            rChange = parseFloat(rc.value);
            redraw();
        }
        
    });
    
    //listen for user input to space
    space.addEventListener('input', function(){
            redraw();
    });
    
    //listen for fullscreen button
    $('button[id="fullscreen"]').click(function(){
        
        if (my_canvas.requestFullscreen){
            my_canvas.requestFullscreen();
        }else if (my_canvas.webkitRequestFullscreen){
            my_canvas.webkitRequestFullscreen();
        }else if (my_canvas.mozRequestFullScreen){
            moz = true;
            my_canvas.mozRequestFullScreen();
        }else if (my_canvas.MSRequestFullscreen){
            my_canvas.MSRequestFullscreen();
        }
        this.blur();
        
    });
    
    //listen for fullscreen change
    my_canvas.addEventListener('fullscreenchange', fshandler);
    my_canvas.addEventListener('webkitfullscreenchange', fshandler);
    document.addEventListener('mozfullscreenchange', fshandler);
    my_canvas.addEventListener('MSfullscreenChange', fshandler);
    
    function fshandler(){
        if(fullscreen == false){
                my_canvas.width = window.innerWidth;
                my_canvas.height = window.innerHeight;
            width = my_canvas.width;
            height = my_canvas.height;
            fullscreen = true;
            resetVars();
            redraw();
        }
        else{
            my_canvas.width = "500";
            my_canvas.height = "500";
            width = my_canvas.width;
            height = my_canvas.height;
            fullscreen = false;
            resetVars();
            redraw();
        }
    };
    
    
    
    //listen for change in color selector
    $('input[name=color-selector]').click(function(){
        colswitch();
    });
    
    function colswitch(){
        //toggle between background and foreground radio buttons
        if(background.checked){
            variance.style.visibility = "hidden";
            bred.value = br.toString();
            bgreen.value = bg.toString();
            bblue.value = bb.toString();
        }
        else{
            variance.style.visibility = "visible";
            resetVars();
            bred.value = r.toString();
            bgreen.value = g.toString();
            bblue.value = b.toString();
        }
    }
    
    //listen for reset button and reset to default variables
    $('button[name=reset]').click(function(){
        tempr = 255;
        tempg = 255;
        tempb = 255;
        br = 0;
        bg = 0;
        bb = 0;
        rad.value = "100";
        radius = 100;
        rc.value = "0";
        rChange = 0;
        space.value = "11";
        bred.value = "0";
        bgreen.value = "0";
        bblue.value = "0";
        rvariance.value = "0";
        gvariance.value = "0";
        bvariance.value = "0";
        stop = true;
        colswitch();
        redraw();
        this.blur();
    });
    
    
    //listen for animate button
    $('button[name=animate]').click(function(){
        //determine if radius should increase or decrease 
        if(radius < 100){
            shrink = true;
        }
        else{
            shrink = false;
        }
        //determine if rChange should increase or decrease
        if(rChange < 0){
            rc_shrink = true;
        }
        else{
            rc_shrink = false;
        }
        //determine if space should increase or decrease
        if(spc <= 11){
            spc_shrink = true;
        }
        else{
            spc_shrink = false;
        }
        stop = false;
        $('button[name=animate]').tooltip('hide');
        animate();
    });
    
    //listen for animate stop button
    $('button[name=stop]').click(function(){
        stop = true;
        this.blur();
    });
    
    //animate canvas
    function animate(){
        radius = parseFloat(rad.value);
        rChange = parseFloat(rc.value);
        // check to be sure stop button has not been pressed
        if(stop == false){
            //animate
            //determine if radius should shrink or grow
            if(shrink == true){
                radius = radius - 0.08;
                //reverse if lower limits reached
                if((radius <= 1.01)||(radius + rChange <= 0.01)){
                    shrink = false;
                }
            }
            else{
                radius = radius + 0.08;
                //reverse if upper limits reached
                if(radius >= 198.99){
                    shrink = true;
                }    
            }
            rad.value = radius.toString();
            //determine if radial change should shrink or grow
            if(rc_shrink == true){
                rChange = rChange - 0.01;
                //reverse if lower limits reached
                if(rChange <= -14.97){
                    rc_shrink = false;
                }
            }
            else{
                rChange = rChange + 0.01;
                //reverse if upper limits reached
                if(rChange >= 14.97){
                    rc_shrink = true;
                }
            }
            rc.value = rChange.toString();
            //determine if spacing should shrink or grow
            if(spc_shrink == true){
                spc = spc - 0.01;
                //reverse if lower limits reached
                if(spc <= 1.01){
                    spc_shrink = false;
                }
            }
            else{
                spc = spc + 0.02;
                //reverse if upper limits reached
                if(spc >= 20.99){
                    spc_shrink = true;
                }
            }
            space.value = spc.toString();
            redraw();
            requestAnimationFrame(animate);
        }
        else{
            //stop animation when stop button is pressed
            cancelAnimationFrame(animate);
            return;
        }
        //make slider bars reflect current values
       // rad.value = radius.toString();
      //  rc.value = rChange.toString();
        //space.value = spc.toString();
    }
    
    bred.addEventListener('input', function(){
        if(background.checked){
            br = parseFloat(bred.value);
        }
        else{
            tempr = parseFloat(bred.value);
            r = tempr;
        }
        redraw();
    });
    
    bgreen.addEventListener('input', function(){
        if(background.checked){
           bg = parseFloat(bgreen.value); 
        }
        else{
            tempg = parseFloat(bgreen.value);
            g = tempg;
        }
        redraw();
    });
    
    bblue.addEventListener('input', function(){
        if(background.checked){
            bb = parseFloat(bblue.value);
        }
        else{
            tempb = parseFloat(bblue.value);
            b = tempb;
        }
        redraw();
    });
    
    rvariance.addEventListener('input', function(){
        rvar = parseFloat(rvariance.value);
        redraw();
    });
    
    gvariance.addEventListener('input', function(){
        gvar = parseFloat(gvariance.value);
        redraw();
    });
    
    bvariance.addEventListener('input', function(){
     
        bvar = parseFloat(bvariance.value);
        redraw();
    });
    
    //draw initial pattern on canvas when page opened
    resetVars();
    colswitch();
    my_canvas.style.background = 'rgb(' + br + ',' + bg + ',' + bb + ')';
    pattern();
    
    
})