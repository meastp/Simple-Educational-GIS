/*
 * Handlers for events and interaction
 * 
 * - drag and drop event handlers
 *
 */

//
// Handlers for drag and dropping a node
//

function DragNodeStart()
{
        this.ox = 0;
        this.oy = 0;
}

// redraw a path, for use when e.g. a node is moved
function updatePathLink(nodea, nodeb, path)
{
    var nodea_bb = nodea.getBBox();
    
    var nodeb_bb = nodeb.getBBox();
    
    var nodea_center = {
        x : (nodea_bb.x + (nodea_bb.width/2.0)),
        y : (nodea_bb.y + (nodea_bb.height/2.0))
    };
    var nodeb_center = {
        x : (nodeb_bb.x + (nodeb_bb.width/2.0)),
        y : (nodeb_bb.y + (nodeb_bb.height/2.0))
    };
    
    path.attr("path", "M"+nodea_center.x+","+nodea_center.y+"L"+nodeb_center.x+","+nodeb_center.y);
}

function DragNodeMove(dx,dy)
{
    var paper_context = this.paper;
    
        var parent = this.data("root");
        
        var trans = 
        { 
            x: dx-this.ox,
            y: dy-this.oy
        };
        
        parent.group.translate(trans.x,trans.y); // move node
        
        // update all paths connected to this node
        
        var paths_to_move = [];
        if(parent.root)
        {
            paths_to_move.push(parent.root);
        }
        if(parent.left)
        {
            paths_to_move.push(parent.left);
        }
        if(parent.right)
        {
            paths_to_move.push(parent.right);
        }
        if(parent.input)
        {
            paths_to_move.push(parent.input);
        }
        if(parent.output)
        {
            paths_to_move.push(parent.output);
        }
        
        for(var i = 0; i<paths_to_move.length; i++)
        {
            if(paths_to_move[i].path_id != null)
            {
                
                var othernode = paper_context.getById(paths_to_move[i].othernode_id);
                var path = paper_context.getById(paths_to_move[i].path_id);
                
                updatePathLink(paths_to_move[i].thisnode, othernode, path);
            }
        }
        
        this.ox = dx;
        this.oy = dy;
}

function DragNodeEnd(){}

//
// Handlers for creating links between nodes
//

function DragLinkNodeStart(x,y,event)
{
        /*
        console.log("startx: "+x+" starty: "+y+" event "+event);
        this.count = 0;
        */
        this.startx = this.attr("cx");
        this.starty = this.attr("cy");
        
        //console.log(this.getBBox());
        
        this.animate({ r : 3 }, 500, "linear"); // decrease size of circle
}

function DragLinkNodeMove(dx,dy,x,y,event)
{
        /*
        if(this.count%20 == 0)
        {
            console.log("x: "+x+" y: "+y+"dx: "+dx+" dy: "+dy+" absx:"+this.attr("x")+" absy:"+this.attr("y"));
            console.log(this.getBBox());
        }
        this.count += 1;
        */
        
        // move circle by modifying center coordinates
        this.attr("cx",this.startx+dx);
        this.attr("cy",this.starty+dy);
}

function DragLinkNodeEnd(event)
{
        // reset the circle
        this.attr("cx",this.startx);
        this.attr("cy",this.starty);
        
        this.animate({ r : 5 }, 500, "linear");
        
        // redraw the path from this node if any
        var that = this;
        
        var start_object = null;
        if(this.data("node")=="root")
        { start_object = that.data("root").root; }
        else if(this.data("node")=="left")
        { start_object = that.data("root").left; }
        else if(this.data("node")=="right")
        { start_object = that.data("root").right; }
        else if(this.data("node")=="input")
        { start_object = that.data("root").input; }
        else if(this.data("node")=="output")
        { start_object = that.data("root").output; }
        
        if((start_object.othernode_id != null) & (start_object.path_id != null))
        {
            var end_point_obj = this.paper.getById(start_object.othernode_id);
            
            var end_object = null;
            if(end_point_obj.data("node")=="root")
            { end_object = end_point_obj.data("root").root; }
            else if(end_point_obj.data("node")=="left")
            { end_object = end_point_obj.data("root").left; }
            else if(end_point_obj.data("node")=="right")
            { end_object = end_point_obj.data("root").right; }
            else if(end_point_obj.data("node")=="input")
            { end_object = end_point_obj.data("root").input; }
            else if(end_point_obj.data("node")=="output")
            { end_object = end_point_obj.data("root").output; }
            
            var path = this.paper.getById(start_object.path_id);
            
            updatePathLink(start_object.thisnode, end_object.thisnode, path);
        }

}


//
// Handle the event when a link-circle is dragged over another link-circle, and link the nodes together
//
function onDragLinkNodeOver(other)
{
    /*
        this.attr("cx",this.startx);
        this.attr("cy",this.starty);
        
        var end_point_obj = paper_context.getElementByPoint(this.posx,this.posy)
        
        console.log("startx: "+this.startx+" starty: "+this.starty+" dx:"+this.dx+" dy:"+this.dy+" posx:"+this.posx+"posy:"+this.posy);
        console.log(this.getBBox());
    */
        
        var end_point_obj = other;
        var paper_context = this.paper;
        
        //console.log(end_point_obj);
        if(end_point_obj!=null)
        {
            //console.log(end_object.data("type"));
            if(end_point_obj.data("type")=="link"){ // make sure we are connecting nodes of type "link"
                
                var that = this;
                
                var start_object = null;
                if(this.data("node")=="root")
                { start_object = that.data("root").root; }
                else if(this.data("node")=="left")
                { start_object = that.data("root").left; }
                else if(this.data("node")=="right")
                { start_object = that.data("root").right; }
                else if(this.data("node")=="input")
                { start_object = that.data("root").input; }
                else if(this.data("node")=="output")
                { start_object = that.data("root").output; }
                
                
                
                var end_object = null;
                if(end_point_obj.data("node")=="root")
                { end_object = end_point_obj.data("root").root; }
                else if(end_point_obj.data("node")=="left")
                { end_object = end_point_obj.data("root").left; }
                else if(end_point_obj.data("node")=="right")
                { end_object = end_point_obj.data("root").right; }
                else if(end_point_obj.data("node")=="input")
                { end_object = end_point_obj.data("root").input; }
                else if(end_point_obj.data("node")=="output")
                { end_object = end_point_obj.data("root").output; }
                
                //console.log("start ("+that.data("node")+") :");
                //console.log(start_object);
                //console.log("end ("+that.data("node")+") :");
                //console.log(end_object);
                
                // unlink existing link in start_object
                if(start_object.othernode_id!=null){
                    var old_obj_raw = paper_context.getById(start_object.othernode_id);
                    var old_path = paper_context.getById(start_object.path_id);
                    
                    var old_obj = null;
                    if(old_obj_raw.data("node")=="root")
                    { old_obj = old_obj_raw.data("root").root; }
                    else if(old_obj_raw.data("node")=="left")
                    { old_obj = old_obj_raw.data("root").left; }
                    else if(old_obj_raw.data("node")=="right")
                    { old_obj = old_obj_raw.data("root").right; }
                    else if(old_obj_raw.data("node")=="input")
                    { old_obj = old_obj_raw.data("root").input; }
                    else if(old_obj_raw.data("node")=="output")
                    { old_obj = old_obj_raw.data("root").output; }
                    
                    
                    //console.log(old_obj_raw.data("node"));
                    //console.log(old_obj);
                    //console.log(old_path);
                    
                    old_obj.path_id = null;
                    old_obj.othernode_id = null;
                    
                    start_object.othernode_id = null;
                    start_object.path_id = null;
                    
                    old_path.remove();
                }
                // end
                
                start_object.othernode_id = end_object.thisnode.id;
                
                // unlink existing link in end_object
                if(end_object.othernode_id!=null){
                    var old_obj_raw = paper_context.getById(end_object.othernode_id);
                    var old_path = paper_context.getById(end_object.path_id);
                    
                    var old_obj = null;
                    if(old_obj_raw.data("node")=="root")
                    { old_obj = old_obj_raw.data("root").root; }
                    else if(old_obj_raw.data("node")=="left")
                    { old_obj = old_obj_raw.data("root").left; }
                    else if(old_obj_raw.data("node")=="right")
                    { old_obj = old_obj_raw.data("root").right; }
                    else if(old_obj_raw.data("node")=="input")
                    { old_obj = old_obj_raw.data("root").input; }
                    else if(old_obj_raw.data("node")=="output")
                    { old_obj = old_obj_raw.data("root").output; }
                    
                    old_obj.path_id = null;
                    old_obj.othernode_id = null;
                    
                    end_object.othernode_id = null;
                    end_object.path_id = null;
                    
                    old_path.remove();
                }
                // end
                
                
                end_object.othernode_id = start_object.thisnode.id; // update object references
                
                var that_bb = start_object.thisnode.getBBox();
                var other_bb = end_object.thisnode.getBBox();
                
                var that_center = {
                    x : (that_bb.x + (that_bb.width/2.0)),
                    y : (that_bb.y + (that_bb.height/2.0))
                };
                var other_center = {
                    x : (other_bb.x + (other_bb.width/2.0)),
                    y : (other_bb.y + (other_bb.height/2.0))
                };
                
                
                // create path between nodes
                var link = paper_context.path("M"+that_center.x+","+that_center.y+"L"+other_center.x+","+other_center.y).attr({fill: "#FFF", stroke: "solid"});
                
                // reference link object in nodes
                start_object.path_id = link.id;
                end_object.path_id = link.id;
                
                
                
                /*
            console.log("this,other,path;other.this,other.other,other.path");
            console.log(parent.root.thisnode);  
            console.log(parent.root.othernode);
            console.log(parent.root.path);
            
            console.log(parent.root.othernode.thisnode);
            console.log(parent.root.othernode.othernode);
            console.log(parent.root.othernode.path);
            console.log("END");
                */
                //console.log(link);
                //console.log(link.id+" "+start_object.path_id+" "+end_object.path_id);
            }
        }
}
