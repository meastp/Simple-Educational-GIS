/*
 * Application window/dialog definitions
 * 
 *
 */

// generic window object
function Window(paper_context,x,y,width,height,title){
    var self = this;
    this.context = paper_context; //raphael/paper object
    this.title = title;
    this.width = width;
    this.height = height;
    
    this.frame = {
        object : this.context.set
                    (
                    // outer frame
                    this.context.rect(x,y,width,height).attr({stroke : "none", fill : "#ddd"}),
                    
                    // inner frame
                    this.context.rect(x+2,y+2,width-4,height-4).attr({stroke : "none", fill : "#eee"}),
                    
                    // title bar
                    this.context.rect(x+4,y+3,width-8,20).attr({stroke : "none", fill : "#e9e9e9"})
                    )
    };
    
    this.title = {
        object : this.context.set
                    (
                    this.context.text(x+(width/2.0),y+13,title)
                    )
    };
    /*
    this.closebutton = {
        events : 
        {
            onmouseover : function(){ this.attr({fill : "#ddd"}); },
            onmouseout : function(){ this.attr({fill : "#555"}); }
        }
    };
    
    this.closebutton.object = this.context.set
                    (
                    this.context.circle(x+width-20,y+13,8)
                                .attr({stroke : "none", fill : "#ddd"}),
                    
                    this.context.text(x+width-20,y+13,"X")
                                .attr({fill : "#555"})
                                .data("parent",this)
                                .mouseover(this.closebutton.events.onmouseover)
                                .mouseout(this.closebutton.events.onmouseout)
                                .click(function(){
                                        this.unmouseover(this.data("parent").closebutton.events.onmouseover);
                                        this.unmouseout(this.data("parent").closebutton.events.onmouseout);
                                        this.data("parent").destroy();
                                        })
                    );
    */
    
    this.window = this.context.set(this.frame.object,this.title.object);//,this.closebutton.object);
    
    
    this.destroy = function(){ this.window.remove(); };
    
}


//var win = new Window(paper,800,50,500,600,"Title");

// select data layer menu
function MenuSelectDataLayer(obj, paper_context)
{
    this.x = 100;
    this.y = 100;
    
    this.win = new Window(paper_context,this.x,this.y,400,300,"Select data layer for this object");
    
    // create a single tile
    function DataLayerIcon(paper_context, parent, raster_layer, x, y) {
        
        this.x = x;
        this.y = y;
        
        this.raster_layer = raster_layer;
        
        this.layer_name = paper_context.text(this.x+(5*5),this.y+(5*12),raster_layer.name);
        
        this.layer_background = paper_context.rect(this.x,this.y,5*12,5*16);
        
        this.layer_foreground = paper_context.rect(this.x,this.y,5*12,5*16);
        
        this.layer_foreground.attr({fill: "#fff", stroke : "none", opacity : 0});
        
        this.objects = paper_context.set(this.layer_name, this.layer_background, this.layer_foreground);
        
        // TODO: color values
        
        for (var i = 0; i<10; i++)
        {
            for (var j = 0; j<10; j++)
            {
                var re = paper_context.rect(this.x+5+5*i,this.y+5+5*j,4,4);
                if(raster_layer.data[i][j]==1)
                {
                    re.attr({fill: "#999"});
                }
                this.objects.push(re);
            }
        }
        
        this.layer_foreground.toFront();
        this.layer_foreground.data("parent", parent);
        this.layer_foreground.data("raster_layer", raster_layer);
        
        
        
        this.layer_foreground.click(function(){
            var parent = this.data("parent");
            var raster_layer = this.data("raster_layer");
            parent.destroy();
            
            //console.log("Clicked on :"+raster_layer.name);
            eve("object-data-layer-changed", obj, raster_layer); // notify listers that the selected data layer changed
            });
        
        this.destroy = function(){this.objects.remove();}
        
    }
    
    // create tiles
    this.items = [];
    for(var i = 0; i<obj.raster_layers.length;i++)
    {
        var item = new DataLayerIcon(paper_context, this, obj.raster_layers[i], this.x+40+100*i, this.y+10+50);
        this.items.push(item);
    }
    
    this.destroy = function()
    {
        for(i in this.items)
        {
            this.items[i].destroy();
        }
        this.win.destroy();
    };
    
}
eve.on("menu-select-data-layer-create", MenuSelectDataLayer); // bind event to function

// select (raster) operation menu
function MenuSelectOperation(obj, paper_context)
{
    this.x = 100;
    this.y = 100;
    
    this.win = new Window(paper_context, this.x, this.y, 400, 300, "Select operation for this object");
    
    // single operation icon/button
    function OperationIcon(paper_context, parent, operation, x, y){
        this.x = x;
        this.y = y;
        
        this.operation = operation;
        
        this.text = paper_context.text(this.x, this.y,this.operation.name);
        
        this.objects = paper_context.set(this.text);
        
        this.text.data("parent", parent);
        this.text.data("operation", operation);
        
        this.text.click(function(){
            var parent = this.data("parent");
            var operations = this.data("operation");
            parent.destroy();
            
            //console.log("Clicked on : "+ operation.name);
            eve("object-operation-changed", obj, operation); // notify listeners that the selected operation changed
            });
        
        this.destroy = function(){ this.objects.remove();}
    }
    
    // create operation icons
    this.items = [];
    for(var i=0;i<obj.operations.length;i++)
    {
        var item = new OperationIcon(paper_context, this, obj.operations[i], this.x+(5*5)+i*50, this.y+(5*12));
        items.push(item);
    }
    
    this.destroy = function()
    {
        for(i in this.items)
        {
            this.items[i].destroy();
        }
        this.win.destroy();
    }
    
    
}
eve.on("menu-select-operation-create", MenuSelectOperation) // bind event to function

// visualization of RasterLayer object (data in node(s))
function RasterLayerView(obj, paper_context)
{
    this.x = 200;
    this.y = 100;
    
    this.win = new Window(paper_context, this.x-100, this.y-55, 400, 300, "Data Visualization");
    
    // create/draw a single tile
    function SinglePixel(paper_context, parent, x, y, data_value)
    {
        this.x = x;
        this.y = y;
        
        this.pixel = paper_context.rect(this.x, this.y, 18, 18);
        
        if(data_value==1)
        {
            this.pixel.attr({fill: "#999"});
        }
        
        this.pixel.data("parent", parent);
        
        this.destroy = function(){ this.pixel.remove();}
    }
    
    // draw all tiles
    this.items = [];
    for (var i = 0; i<10; i++)
    {
        for (var j = 0; j<10; j++)
        {
            var item = new SinglePixel(paper_context, this, this.x+20*i, this.y+20*j, obj.layer.data[i][j]);
            items.push(item);
        }
    }
    
    
    
    this.layer_foreground = paper_context.rect(this.x-100, this.y-55, 400, 300);
    this.layer_foreground.data("parent", this);
    this.layer_foreground.attr({fill: "#fff", stroke : "none", opacity : 0});
    this.layer_foreground.toFront();
    this.layer_foreground.click(function(){
        this.data("parent").destroy();
    });
    
    this.destroy = function()
    {
        for(i in this.items)
        {
            this.items[i].destroy();
        }
        this.win.destroy();
        this.layer_foreground.remove();
    }
    
    
}
eve.on("raster-layer-view-create", RasterLayerView); // bind event to function

// reclassify configuration window
function RasterLayerReclassify(obj, paper_context)
{
    this.x = 200;
    this.y = 100;
    
    this.win = new Window(paper_context, this.x-100, this.y-55, 400, 300, "Reclassify data");
    
    this.close_button = paper_context.rect(this.x+280,this.y-53,18,18).attr({fill:"#666"});
    this.close_button.data("root", this);
    
    this.description = paper_context.text(this.x+100, this.y-25, "Click on any tile to toggle the new value (white is 0, black/grey is 1)");
    
    // fix the keymap if not defined
    if(obj.reclassify_keymap==null)
    {
        obj.reclassify_keymap = { 0 : [], 1 : [] };
    }
    
    // create single tile
    function SinglePixel(paper_context, parent, x, y, data_value)
    {
        this.x = x;
        this.y = y;
        this.root = parent;
        this.value = data_value;
        
        this.pixel = paper_context.rect(this.x, this.y, 18, 18).attr({fill: "#fff"});
        this.value_vis = paper_context.text(this.x+9, this.y+9, this.value);
        
        this.pixel.data("parent", this);
        
        // modify the keymap when clicking on this tile
        this.pixel.click(function(){
            var parent = this.data("parent");
            
            
            // check keymap and swap the value in this tile
            var keymap_zero = obj.reclassify_keymap[0];
            var in_zero = $.inArray(parent.value,keymap_zero);
            
            var keymap_one = obj.reclassify_keymap[1];
            var in_one = $.inArray(parent.value,keymap_one);
            
            
            if(in_zero!=-1)
            {
                keymap_zero.splice(in_zero,1); // remove value from keymap_zero
                keymap_one.push(parent.value); // add value to keymap_one
            }
            if(in_one!=-1)
            {
                keymap_one.splice(in_one,1);
                keymap_zero.push(parent.value);
            }
            
            // redraw tiles
            parent.root.update();
            
            });
        
        this.destroy = function(){ this.pixel.remove(); this.value_vis.remove();}
    }
    
    // create and draw all tiles
    this.items = [];
    for (var i = 0; i<10; i++)
    {
        for (var j = 0; j<10; j++)
        {
            var item = new SinglePixel(paper_context, this, this.x+20*i, this.y+20*j, obj.original_layer.data[i][j]);
            
            var exists_zero = $.inArray(item.value,obj.reclassify_keymap[0]);
            var exists_one = $.inArray(item.value,obj.reclassify_keymap[1]);
            
            if(exists_zero!=-1)
            {
                item.pixel.attr({fill: "#fff"});
            }
            else if(exists_one!=-1)
            {
                item.pixel.attr({fill: "#999"});
            }
            else
            {
                obj.reclassify_keymap[0].push(item.value);
            }
            
            items.push(item);
        }
    }
    
    // update/redraw tiles
    this.update = function()
    {
        for (var i = 0; i<10; i++)
        {
            for (var j = 0; j<10; j++)
            {
                //var item = new SinglePixel(this, this.x+20*i, this.y+20*j, obj.layer.data[i][j]);
                
                var item = this.items[10*i+j];
                
                var exists_zero = $.inArray(item.value,obj.reclassify_keymap[0]);
                var exists_one = $.inArray(item.value,obj.reclassify_keymap[1]);
                
                if(exists_zero!=-1)
                {
                    item.pixel.attr({fill: "#fff"});
                }
                if(exists_one!=-1)
                {
                    item.pixel.attr({fill: "#999"});
                }
                
            }
        }
    }
    
    
    this.destroy = function()
    {
        eve("raster-layer-reclassify-changed", obj); // notify listeners that the reclassification changed
        
        for(i in this.items)
        {
            this.items[i].destroy();
        }
        this.description.remove();
        this.close_button.remove();
        this.win.destroy();
    }
    
    this.close_button.click(function(){
        self = this.data("root");
        self.destroy();
    });
}
eve.on("raster-layer-reclassify-create", RasterLayerReclassify); // bind event to function

// window for configuring a buffer layer
function RasterLayerBuffer(obj, paper_context)
{
    this.x = 200;
    this.y = 200;
    
    this.win = new Window(paper_context, this.x-100, this.y-55, 400, 300, "Buffer data");
    
    this.close_button = paper_context.rect(this.x+280,this.y-53,18,18).attr({fill:"#666"});
    this.close_button.data("root", this);
    
    this.description = paper_context.text(this.x+100, this.y-25, "Choose buffer amount :");
    
    this.increase_button = paper_context.rect(this.x+80, this.y, 50, 30).attr("fill", "#fff");
    this.increase_text = paper_context.text(this.x+105, this.y+15, "up");
    
    this.buffer_amount_value = paper_context.text(this.x+105, this.y+45, "buffer: "+obj.buffer_amount);
    
    this.decrease_button = paper_context.rect(this.x+80, this.y+60, 50, 30).attr("fill", "#fff");
    this.decrease_text = paper_context.text(this.x+105, this.y+75, "down");
    
    this.increase_button.data("root", this);
    this.increase_button.click(function(){
        var root = this.data("root");
        
        if(obj.buffer_amount<10) // the buffer should not go higher than 10
        {
            obj.buffer_amount += 1; // increase value in object directly
            root.buffer_amount_value.attr("text", "buffer: "+obj.buffer_amount); // update text
        }
        });
    
    
    this.decrease_button.data("root", this);
    this.decrease_button.click(function(){
        var root = this.data("root");
        
        if(obj.buffer_amount>0) // buffer amount can not be negative
        {
            obj.buffer_amount -= 1; // increase value in object directly
            root.buffer_amount_value.attr("text", "buffer: "+obj.buffer_amount);
        }
        });
    
    this.destroy = function()
    {
        eve("raster-layer-buffer-changed", obj); // notify listeners that the buffer configuration changed
        
        this.description.remove();
        this.close_button.remove();
        this.increase_button.remove();
        this.increase_text.remove();
        this.buffer_amount_value.remove();
        this.decrease_button.remove();
        this.decrease_text.remove();
        
        this.win.destroy();
    }
    
    this.close_button.click(function(){
        self = this.data("root");
        self.destroy();
    });
}
eve.on("raster-layer-buffer-create", RasterLayerBuffer); // bind event to function



