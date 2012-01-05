/*
 * Application icon definitions
 *
 */

// create raster operation icon
function addCreateOperationIcon(paper_context, x, y, name) 
{
    
    this.container = paper_context.circle(30, 30, 25);
    this.container.attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    this.name = paper_context.text(30, 30, name);
    
    var name_bbox = this.name.getBBox();
    
    var name_center = {
        x : (name_bbox.x + (name_bbox.width/2.0)),
        y : (name_bbox.y + (name_bbox.height/2.0))
    };
    
    // plus icon
    this.add = paper_context.path("M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z").attr({fill: "#fff", stroke: "solid"});
    
    var plus_bbox = this.add.getBBox();
    
    var plus_center = {
        x : (plus_bbox.x + (plus_bbox.width/2.0)),
        y : (plus_bbox.y + (plus_bbox.height/2.0))
    };
    
    this.add.translate(x-plus_center.x,y-plus_center.y);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.name.translate(x-name_center.x,y-name_center.y-35);
    
    this.group = paper_context.set(this.add, this.container, this.name);
    
    this.children = paper_context.set();
    
    this.container.data("root", this.group);
    this.container.data("children", this.children);
    
    this.add.data("root", this.group);
    this.add.data("children", this.children);
}

// end node icon
function addEndNode(paper_context, x, y)
{
    this.x = x;
    this.y = y;
    
    this.container = paper_context.circle(30, 30, 25).attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    
    this.layer_name = paper_context.text(30,30,"END");
    
    var layer_name_bbox = this.layer_name.getBBox();
    
    var layer_name_center = {
        x : (layer_name_bbox.x + (layer_name_bbox.width/2.0)),
        y : (layer_name_bbox.y + (layer_name_bbox.height/2.0))
    };
    
    // object for linking nodes
    this.root = {
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.root.thisnode = paper_context.circle(30, 30, 5).attr("fill", "#fff");
    
    var root_link_bbox = this.root.thisnode.getBBox();
    
    var root_link_center = {
        x : (root_link_bbox.x + (root_link_bbox.width/2.0)),
        y : (root_link_bbox.y + (root_link_bbox.height/2.0))
    };
    
    
    this.layer_name.translate(x-layer_name_center.x,y-layer_name_center.y-5);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.root.thisnode.translate(x-root_link_center.x,y-root_link_center.y-25);
    
    this.group = paper_context.set(this.layer_name, this.container, this.root.thisnode);
    
    this.correct_result = null;
    
    this.container.data("root", this);
    this.container.data("type", "background");
    
    this.layer_name.data("root", this);
    
    this.root.thisnode.data("root", this);
    this.root.thisnode.data("type", "link");
    this.root.thisnode.data("node", "root");
    
    // check answer and visualize data
    this.container.dblclick(function(){
            
            var parent = this.data("root");
            
            if(parent.root.othernode_id!=null)
            {
                var root_node = paper_context.getById(parent.root.othernode_id); // get object by id
                var root = root_node.data("root");
                
                if ((root.left != null) & (root.right != null))
                {
                    var operation_node = new OperationNode(root, paper_context);
                    var result = operation_node.RasterLayerResult;
                    root.layer = result.data;
                    eve("raster-layer-view-create", null, root, paper_context);
                }
                
                if(root.layer.equalTo(parent.correct_result)==true)
                {
                    console.log("Congratulations -- the result is correct");
                    alert("Congratulations -- the result is correct");
                }
                else
                {
                    console.log("Sorry -- the result is not correct");
                    alert("Sorry -- the result is not correct");
                }
            }
            else
            {
                console.log("Error: No data layers linked to the end node!");
                alert("Error: No data layers linked to the end node!");
            }
        });
    
}

// "add data layer" icon
function addDataIcon(paper_context, x, y)
{
    this.x = x;
    this.y = y;
    
    this.container = paper_context.circle(30, 30, 25);
    this.container.attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    
    this.layer_name = paper_context.text(30,30,"select");
    
    var layer_name_bbox = this.layer_name.getBBox();
    
    var layer_name_center = {
        x : (layer_name_bbox.x + (layer_name_bbox.width/2.0)),
        y : (layer_name_bbox.y + (layer_name_bbox.height/2.0))
    };
    
    this.root = { // object used for linking nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.root.thisnode = paper_context.circle(30, 30, 5);
    this.root.thisnode.attr("fill", "#fff");
    
    var root_link_bbox = this.root.thisnode.getBBox();
    
    var root_link_center = {
        x : (root_link_bbox.x + (root_link_bbox.width/2.0)),
        y : (root_link_bbox.y + (root_link_bbox.height/2.0))
    };
    
    
    this.layer_name.translate(x-layer_name_center.x,y-layer_name_center.y-5);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.root.thisnode.translate(x-root_link_center.x,y-root_link_center.y+25);
    
    this.group = paper_context.set(this.layer_name, this.container, this.root.thisnode);
    this.layer = null;
    this.raster_layers = raster_data_layers;
    
    this.children = paper_context.set();
    
    this.container.data("root", this);
    this.container.data("type", "background");
    this.container.data("children", this.children);
    
    this.layer_name.data("root", this);
    
    this.layer_name.click(function(){
        eve("menu-select-data-layer-create", null, this.data("root"), paper_context); // create the select data layer menu
        eve.once("object-data-layer-changed", ChangeLayerName); // register: listen for a changed layer once
        });
    
    this.container.dblclick(function(){
            
            
            if(this.data("root").layer!=null)
            {
                eve("raster-layer-view-create", null, this.data("root"), paper_context); // visualize layer
            }
        });
    
    // set new data layer
    function ChangeLayerName(raster_layer)
    {
        //console.log("changed layer");
        this.layer = raster_layer;
        this.layer_name.attr("text", this.layer.name);
        //console.log(this.layer);
        
    }
    
    this.root.thisnode.data("root", this);
    this.root.thisnode.data("type", "link");
    this.root.thisnode.data("node", "root");
    this.root.thisnode.data("children", this.children);
}

// reclassify node
function addReclassifyIcon(paper_context, x, y)
{
    
    this.x = x;
    this.y = y;
    
    this.container = paper_context.circle(30, 30, 25);
    this.container.attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    
    this.layer_name = paper_context.text(30,30,"reclassify");
    
    var layer_name_bbox = this.layer_name.getBBox();
    
    var layer_name_center = {
        x : (layer_name_bbox.x + (layer_name_bbox.width/2.0)),
        y : (layer_name_bbox.y + (layer_name_bbox.height/2.0))
    };
    
    this.input = { // link nodes object
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.input.thisnode = paper_context.circle(30, 30, 5);
    this.input.thisnode.attr("fill", "#fff");
    
    var input_link_bbox = this.input.thisnode.getBBox();
    
    var input_link_center = {
        x : (input_link_bbox.x + (input_link_bbox.width/2.0)),
        y : (input_link_bbox.y + (input_link_bbox.height/2.0))
    };
    
    
    this.output = { // link nodes object
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.output.thisnode = paper_context.circle(30, 30, 5);
    this.output.thisnode.attr("fill", "#fff");
    
    var output_link_bbox = this.output.thisnode.getBBox();
    
    var output_link_center = {
        x : (output_link_bbox.x + (output_link_bbox.width/2.0)),
        y : (output_link_bbox.y + (output_link_bbox.height/2.0))
    };
    
    //this.root = this.output;
    
    this.layer_name.translate(x-layer_name_center.x,y-layer_name_center.y-5);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.input.thisnode.translate(x-input_link_center.x,y-input_link_center.y-25);
    this.output.thisnode.translate(x-output_link_center.x,y-output_link_center.y+25);
    
    this.group = paper_context.set(this.layer_name, this.container, this.input.thisnode, this.output.thisnode);
    
    this.reclassify_keymap = null; // keymap for configuring reclassification
    
    this.original_layer = null; // the original data layer (linked from previous node)
    this.layer = null; // generated layer based on the configuration
    
    
    this.children = paper_context.set();
    
    this.container.data("root", this);
    this.container.data("type", "background");
    this.container.data("children", this.children);
    
    this.layer_name.data("root", this);
    
    // configure reclassification
    this.layer_name.click(function(){
        
        var input = this.data("root").input;
        if(input.othernode_id!=null) // if there is a node linked to this node
        {
            var original_obj = paper_context.getById(input.othernode_id);
            var original_obj_root = original_obj.data("root");
            
            if(original_obj_root.layer!=null) // check if the linked node has data
            {
                this.data("root").original_layer = original_obj_root.layer;
                eve("raster-layer-reclassify-create", null, this.data("root"), paper_context); // create configuration menu
                eve.once("raster-layer-reclassify-changed", ChangeLayer); // listen once for a change in configuration
            }
            else
            {
                console.log("Error: no (selected) data layer in input node!")
            }
        }
        });
    
    // function for creating a new layer based on the objects configuration
    function ChangeLayer()
    {
        
        this.layer = new RasterLayer(this.original_layer.name+" (reclassified)", null);
        
        for(var i=0;i<10;i++)
        {
            for(var j=0;j<10;j++)
            {
                var original_value = this.original_layer.data[i][j];
                
                var reclassify_zero = $.inArray(original_value,this.reclassify_keymap[0]);
                var reclassify_one = $.inArray(original_value,this.reclassify_keymap[1]);
                
                if(reclassify_zero!=-1)
                {
                    this.layer.data[i][j] = 0;
                }
                if(reclassify_one!=-1)
                {
                    this.layer.data[i][j] = 1;
                }
            }
        }
        
        
    }
    
    // visualize layer
    this.container.dblclick(function(){
            
            
            if(this.data("root").layer!=null)
            {
                eve("raster-layer-view-create", null, this.data("root"), paper_context);
            }
            
        });
    
    this.input.thisnode.data("root", this);
    this.input.thisnode.data("type", "link");
    this.input.thisnode.data("node", "input");
    this.input.thisnode.data("children", this.children);
    
    this.output.thisnode.data("root", this);
    this.output.thisnode.data("type", "link");
    this.output.thisnode.data("node", "output");
    this.output.thisnode.data("children", this.children);
}

// buffer icon
function addBufferIcon(paper_context, x, y)
{
    
    this.x = x;
    this.y = y;
    
    this.container = paper_context.circle(30, 30, 25);
    this.container.attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    
    this.layer_name = paper_context.text(30,30,"buffer");
    
    var layer_name_bbox = this.layer_name.getBBox();
    
    var layer_name_center = {
        x : (layer_name_bbox.x + (layer_name_bbox.width/2.0)),
        y : (layer_name_bbox.y + (layer_name_bbox.height/2.0))
    };
    
    this.input = { // object for linking nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.input.thisnode = paper_context.circle(30, 30, 5);
    this.input.thisnode.attr("fill", "#fff");
    
    var input_link_bbox = this.input.thisnode.getBBox();
    
    var input_link_center = {
        x : (input_link_bbox.x + (input_link_bbox.width/2.0)),
        y : (input_link_bbox.y + (input_link_bbox.height/2.0))
    };
    
    
    this.output = {// object for linking nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.output.thisnode = paper_context.circle(30, 30, 5);
    this.output.thisnode.attr("fill", "#fff");
    
    var output_link_bbox = this.output.thisnode.getBBox();
    
    var output_link_center = {
        x : (output_link_bbox.x + (output_link_bbox.width/2.0)),
        y : (output_link_bbox.y + (output_link_bbox.height/2.0))
    };
    
    this.layer_name.translate(x-layer_name_center.x,y-layer_name_center.y-5);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.input.thisnode.translate(x-input_link_center.x,y-input_link_center.y-25);
    this.output.thisnode.translate(x-output_link_center.x,y-output_link_center.y+25);
    
    this.group = paper_context.set(this.layer_name, this.container, this.input.thisnode, this.output.thisnode);
    
    this.buffer_amount = 0; // the buffer amount to add to the layer
    
    this.original_layer = null; // the original data layer
    this.layer = null; // the generated layer with the buffer
    
    
    this.children = paper_context.set();
    
    this.container.data("root", this);
    this.container.data("type", "background");
    this.container.data("children", this.children);
    
    this.layer_name.data("root", this);
    
    // create buffer configuration menu
    this.layer_name.click(function(){
        
        var input = this.data("root").input;
        if(input.othernode_id!=null)
        {
            var original_obj = paper_context.getById(input.othernode_id);
            var original_obj_root = original_obj.data("root");
            
            if(original_obj_root.layer!=null)
            {
                this.data("root").original_layer = original_obj_root.layer;
                eve("raster-layer-buffer-create", null, this.data("root"), paper_context); // create configuration window
                eve.once("raster-layer-buffer-changed", ChangeLayer); // listen once for changes
            }
            else
            {
                console.log("Error: no (selected) data layer in input node!")
            }
        }
        });
    
    // create a RasterLayer from the linked node based on the configuration
    function ChangeLayer()
    {
        
        this.layer = new RasterLayer(this.original_layer.name+" (buffer)", null);
        
        // loop once through every tile
        
        for(var i=0;i<10;i++)
        {
            for(var j=0;j<10;j++)
            {
                
                var value = this.original_layer.data[i][j];
                
                if (value == 1)
                {
                    // loop through the surrounding tiles according to the buffer amount.
                    
                    var x_max = i+this.buffer_amount, 
                        x_min = i-this.buffer_amount,
                        
                        y_max = j+this.buffer_amount,
                        y_min = j-this.buffer_amount; 
                    
                    
                    for(var x = x_min; x<=x_max; x++)
                    {
                        for(var y = y_min; y<=y_max; y++)
                        {
                            if( (x>=0) & (y>=0) & (x<10) & (y<10) )
                            {
                                //console.log(x + " " + y);
                                this.layer.data[x][y] = 1;
                            }
                        }
                    }
                    
                }
                
            }
        }
        
        
    }
    
    //visualize the data layer
    this.container.dblclick(function(){
            
            
            if(this.data("root").layer!=null)
            {
                eve("raster-layer-view-create", null, this.data("root"), paper_context);
            }
            
        });
    
    this.input.thisnode.data("root", this);
    this.input.thisnode.data("type", "link");
    this.input.thisnode.data("node", "input");
    this.input.thisnode.data("children", this.children);
    
    this.output.thisnode.data("root", this);
    this.output.thisnode.data("type", "link");
    this.output.thisnode.data("node", "output");
    this.output.thisnode.data("children", this.children);
}

// raster operation node
function addOperationIcon(paper_context, x, y)
{
    this.container = paper_context.circle(30, 30, 25);
    this.container.attr("fill", "#fff");
    
    var circle_bbox = this.container.getBBox();
    
    var circle_center = {
        x : (circle_bbox.x + (circle_bbox.width/2.0)),
        y : (circle_bbox.y + (circle_bbox.height/2.0))
    };
    
    
    this.operation_name = paper_context.text(30,30,"select");
    
    var operation_name_bbox = this.operation_name.getBBox();
    
    var operation_name_center = {
        x : (operation_name_bbox.x + (operation_name_bbox.width/2.0)),
        y : (operation_name_bbox.y + (operation_name_bbox.height/2.0))
    };
    
    this.root = { // rootnode for linking other nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.root.thisnode = paper_context.circle(30, 30, 5);
    this.root.thisnode.attr("fill", "#fff");
    
    var root_link_bbox = this.root.thisnode.getBBox();
    
    var root_link_center = {
        x : (root_link_bbox.x + (root_link_bbox.width/2.0)),
        y : (root_link_bbox.y + (root_link_bbox.height/2.0))
    };
    
    this.left = { // left node for linking other nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.left.thisnode = paper_context.circle(30, 30, 5);
    this.left.thisnode.attr("fill", "#fff");
    
    var left_link_bbox = this.left.thisnode.getBBox();
    
    var left_link_center = {
        x : (left_link_bbox.x + (left_link_bbox.width/2.0)),
        y : (left_link_bbox.y + (left_link_bbox.height/2.0))
    };
    
    this.right = { // right node for linking other nodes
        thisnode : null,
        path_id : null,
        othernode_id : null
    };
    
    this.right.thisnode = paper_context.circle(30, 30, 5);
    this.right.thisnode.attr("fill", "#fff");
    
    var right_link_bbox = this.right.thisnode.getBBox();
    
    var right_link_center = {
        x : (right_link_bbox.x + (right_link_bbox.width/2.0)),
        y : (right_link_bbox.y + (right_link_bbox.height/2.0))
    };
    
    //plus.translate(x-plus_center.x,y-plus_center.y-5);
    this.operation_name.translate(x-operation_name_center.x,y-operation_name_center.y-5);
    this.container.translate(x-circle_center.x,y-circle_center.y);
    this.root.thisnode.translate(x-root_link_center.x,y-root_link_center.y+25);
    this.left.thisnode.translate(x-root_link_center.x-15,y-root_link_center.y-20);
    this.right.thisnode.translate(x-root_link_center.x+15,y-root_link_center.y-20);
    
    this.group = paper_context.set(this.operation_name, this.container, this.root.thisnode, this.left.thisnode, this.right.thisnode);
    
    this.operation = null; // selected raster operation
    this.operations = operations; // list of available operations
    
    this.layer = null; // the data for this layer, after the operation is applied
    
    var children = paper_context.set();
    
    this.container.data("root", this);
    this.container.data("type", "background");
    this.container.data("children", children);
    
    this.operation_name.data("root", this);
    
    
    this.operation_name.click(function(){
        eve("menu-select-operation-create", null, this.data("root"), paper_context); //create select operation menu
        eve.once("object-operation-changed", ChangeOperationName); // listen for changed operation
        });
    
    // visualize data layer
    this.container.dblclick(function(){
            
            var root = this.data("root");
            
            if ((root.left != null) & (root.right != null) & (root.operation != null))
            {
                
                // go through the tree with depth-first search, generating the new data layer
                
                var operation_node = new OperationNode(root, paper_context);
                var result = operation_node.RasterLayerResult;
                root.layer = result.data;
                
                // create visualization
                eve("raster-layer-view-create", null, root, paper_context);
            }
            else
            {
                console.log("Error: Can not do operation when left node, right node is empty, or no operation is selected!");
            }
        });
    
    // change the selected operation
    function ChangeOperationName(operation)
    {
        //console.log("changeop:"+operation.name);
        this.operation = operation;
        this.operation_name.attr("text", this.operation.name);
    }
    
    
    this.root.thisnode.data("root", this);
    this.root.thisnode.data("type", "link");
    this.root.thisnode.data("node", "root");
    this.root.thisnode.data("children", children);
    
    this.left.thisnode.data("root", this);
    this.left.thisnode.data("type", "link");
    this.left.thisnode.data("node", "left");
    this.left.thisnode.data("children", children);
    
    this.right.thisnode.data("root", this);
    this.right.thisnode.data("type", "link");
    this.right.thisnode.data("node", "right");
    this.right.thisnode.data("children", children);
}
