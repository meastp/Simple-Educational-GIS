Ext.define('SimpleGIS.data.RasterLayer', {
    name : 'Unknown',
    data : null,
    constructor: function(name, data){
        this.name = name;
        
        // assign data or create an empty layer
        if(data!=null) {
            this.data = data;
        }
        else {
            this.data = new Array(10);
            for (var i = 0; i<10; i++)
            {
             this.data[i] = new Array(10);
            }
        }
    }
    
    });

Ext.define('SimpleGIS.operation.RasterOperation', {
    name : 'Unknown'
    });

Ext.define('SimpleGIS.operations.RasterAND', {
    extend: 'SimpleGIS.operation.RasterOperation',
    constructor: function(){
        this.name = "AND";
    },
    applyOperation: function(RasterLayer1, RasterLayer2, RasterLayerResult) {
            for (var i = 0; i<10; i++)
            {
                for (var j = 0; j<10; j++)
                {
                    RasterLayerResult.data[i][j] = (RasterLayer1.data[i][j] & RasterLayer2.data[i][j]) ? 1 : 0; // if 1 in both, return 1, else 0
                }
            }
        }
    });

Ext.define('SimpleGIS.operations.RasterOR', {
    extend: 'SimpleGIS.operation.RasterOperation',
    constructor: function(){
        this.name = "OR";
    },
    applyOperation: function(RasterLayer1, RasterLayer2, RasterLayerResult) {
            for (var i = 0; i<10; i++)
            {
                for (var j = 0; j<10; j++)
                {
                    RasterLayerResult.data[i][j] = (RasterLayer1.data[i][j] | RasterLayer2.data[i][j]) ? 1 : 0; // if 1 in either, return 1, else 0
                }
            }
        }
    });

Ext.define('SimpleGIS.operations.RasterNOT', {
    extend: 'SimpleGIS.operation.RasterOperation',
    constructor: function(){
        this.name = "NOT";
    },
    applyOperation: function(RasterLayer1, RasterLayer2, RasterLayerResult) {
            for (var i = 0; i<10; i++)
            {
                for (var j = 0; j<10; j++)
                {
                    var aval = RasterLayer1.data[i][j];
                    var bval = RasterLayer2.data[i][j];
                    
                    var result = 0;
                    if((aval == 1) & (bval == 0))
                    {
                        result = 1;
                    }
                    
                    RasterLayerResult.data[i][j] = result;
                }
            }
        }
    });

Ext.define('SimpleGIS.operations.RasterXOR', {
    extend: 'SimpleGIS.operation.RasterOperation',
    constructor: function(){
        this.name = "XOR";
    },
    applyOperation: function(RasterLayer1, RasterLayer2, RasterLayerResult) {
            for (var i = 0; i<10; i++)
            {
                for (var j = 0; j<10; j++)
                {
                    var aval = RasterLayer1.data[i][j];
                    var bval = RasterLayer2.data[i][j];
                    
                    var result = 0;
                    if((aval == 1) & (bval == 0))
                    {
                        result = 1;
                    }
                    if((aval == 0) & (bval == 1))
                    {
                        result = 1;
                    }
                    
                    RasterLayerResult.data[i][j] = result;
                }
            }
        }
    });

Ext.define('SimpleGIS.visualization.RasterLayerVisualization', {
    
    paper : null,
    layer : null,
    objects : null,
    config : null,
    
    constructor: function(paper, RasterLayerObject, config){
        this.layer = RasterLayerObject;
        this.objects = {};
        this.paper = paper;
        this.config = config;
    },
    
    draw : function(x, y, w, h){
        
        // create/draw a single tile
        function SinglePixel(paper_context, parent, x, y, w, h, data_value)
        {
            this.x = x;
            this.y = y;
            
            this.pixel = paper_context.rect(this.x, this.y, w, h);
            
            if(data_value==1)
            {
                this.pixel.attr({fill: "#999"});
            }
            
            this.pixel.data("parent", parent);
            
            this.destroy = function(){ this.pixel.remove();}
        }
        
        // draw all tiles
        this.objects.tiles = [];
        var single_tile_width = w/10
            single_tile_height = h/10;
        for (var i = 0; i<10; i++)
        {
            for (var j = 0; j<10; j++)
            {
                var item = new SinglePixel(
                            this.paper,
                            this,
                            x+(single_tile_width)*i,
                            y+(single_tile_height)*j,
                            single_tile_width-2,
                            single_tile_height-2,
                            this.layer.data[i][j]
                            );
                
                this.objects.tiles.push(item);
            }
        }
        
        // draw name
        if(this.config)
        {
            if(this.config.drawName == true)
            {
            var name = this.paper.text(x - 25, y + (h/2.0), this.layer.name);
            this.objects.name = name;
            }
        }
        
    },
    
    remove : function(){
        for(i in this.objects.tiles)
        {
            this.objects.tiles[i].destroy();
        }
        if(this.objects.name)
        {
            this.objects.name.remove();
        }
        
    }
    
    });

Ext.define('SimpleGIS.widget.OperationWidget', {
    
    paper : null,
    operation : null,
    objects : null,
    
    constructor: function(paper, RasterLayerOperation){
        this.operation = RasterLayerOperation;
        this.paper = paper;
        this.objects = {};
    },
    
    draw : function(x, y, w, h){
        
        var box = this.paper.rect(x,y,w,h).attr({fill:'white'});
        var name = this.paper.text(x+(w/2),y+(h/2),this.operation.name);
        
        var foreground_box = this.paper.rect(x,y,w,h);
        foreground_box.attr({fill: "#fff", stroke : "none", opacity : 0});
        foreground_box.toFront();
        
        this.objects.box = box;
        this.objects.name = name;
        this.objects.foreground_box = foreground_box;
        
        var self = this;
        this.objects.foreground_box.click(function(){eve("OperationWidget.click."+this.id, self);})
        
        this.objects.foreground_box.hover(
            function(){
                this.box.attr({fill:'black'});
                this.name.attr({fill:'white'});
                },
            function(){
                this.box.attr({fill:'white'});
                this.name.attr({fill:'black'});
                },
            this.objects,
            this.objects
            );
    },
    
    remove : function(){
        this.objects.box.remove();
        this.objects.name.remove();
        this.objects.foreground_box.remove();
    }
    
    });

function main()
{
    
    
    var layerA_data = [
        [1,1,0,0,1,1,1,1,1,1],
        [1,1,0,0,1,1,1,1,1,1],
        [1,1,0,0,1,1,1,1,1,1],
        [1,1,0,0,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];
    var layerA = Ext.create('SimpleGIS.data.RasterLayer', "A", layerA_data);
    
    
    var layerB_data = [
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0],
        [1,1,1,0,0,0,1,1,1,0]
    ];
    var layerB = Ext.create('SimpleGIS.data.RasterLayer', "B", layerB_data);
    
    
    var opAND = Ext.create('SimpleGIS.operations.RasterAND');
    var opOR = Ext.create('SimpleGIS.operations.RasterOR');
    var opNOT = Ext.create('SimpleGIS.operations.RasterNOT');
    var opXOR = Ext.create('SimpleGIS.operations.RasterXOR');
    
    var paper = Raphael("operations", "100%", "100%"); // create raphael object in html object
    
    var current_result = null;
    eve.on("CurrentResult.set", function(new_result){current_result=new_result;})
    eve.on("CurrentResult.destroy", function(){
        if(current_result!=null)
        {
            current_result.remove();
        }
        })
    
    eve.on("OperationWidget.click.*", function(){
        
        eve("CurrentResult.destroy");
        
        var result = Ext.create('SimpleGIS.data.RasterLayer', "result", null);
        
        this.operation.applyOperation(layerA, layerB, result);
        
        var visResult = Ext.create('SimpleGIS.visualization.RasterLayerVisualization', paper, result);
        
        eve("CurrentResult.set", null, visResult);
        
        visResult.draw(260, 10, 450, 450);
        
        });
    
    var widgetOpAND = Ext.create('SimpleGIS.widget.OperationWidget', paper, opAND);
    var widgetOpOR = Ext.create('SimpleGIS.widget.OperationWidget', paper, opOR);
    var widgetOpNOT = Ext.create('SimpleGIS.widget.OperationWidget', paper, opNOT);
    var widgetOpXOR = Ext.create('SimpleGIS.widget.OperationWidget', paper, opXOR);
    
    widgetOpAND.draw(15, 225, 40, 20);
    widgetOpOR.draw(65, 225, 40, 20);
    widgetOpNOT.draw(115, 225, 40, 20);
    widgetOpXOR.draw(165, 225, 40, 20);
    
    var visLayerA = Ext.create('SimpleGIS.visualization.RasterLayerVisualization', paper, layerA, {drawName : false});
    var visLayerB = Ext.create('SimpleGIS.visualization.RasterLayerVisualization', paper, layerB, {drawName : false});
    
    visLayerA.draw(10,10, 200, 200);
    visLayerB.draw(10,260, 200, 200);
}
