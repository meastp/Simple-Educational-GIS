/*
 * Initialize the application
 * 
 * container - the html-object's #id name
 * properties - a dictionary with configuration parametres. example for END node -- { endnode : { correct_result : correct_result_layer } }
 *
 */
function UserInterface(container, properties)
{
    var paper_context = Raphael(container, "100%", "100%"); // create raphael object in html object
    this.paper_context = paper_context;
    
    // create icons
    
    this.data = new addCreateOperationIcon(paper_context, 100,50,"data layer");

    this.operation = new addCreateOperationIcon(paper_context, 200,50, "raster operation");

    this.reclassify = new addCreateOperationIcon(paper_context, 300,50, "reclassify");

    this.buffer = new addCreateOperationIcon(paper_context, 400,50, "buffer");
    
    // configure properties
    
    if(properties != null)
    {
        
        if((properties.endnode != null))
        {
            this.end_node = new addEndNode(paper_context, 500, 50);
            
            if(properties.endnode.correct_result != null)
            {
                this.end_node.correct_result = properties.endnode.correct_result;
            }
            
        }
    }
    
    // add event handlers for clicks on the icons
    
    this.data.add.click(function(){
        var children_set = this.data("children");
        
        var child = new addDataIcon(paper_context, 100,250);
        
        child.container.drag(DragNodeMove, DragNodeStart, DragNodeEnd);
        
        child.root.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        
        child.root.thisnode.onDragOver(onDragLinkNodeOver);
        
        children_set.push(child);
        
        });

    this.operation.add.click(function(){
        var children_set = this.data("children");
        
        var child = new addOperationIcon(paper_context, 200,250);
        
        child.container.drag(DragNodeMove, DragNodeStart, DragNodeEnd);
        
        child.root.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        child.left.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        child.right.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        
        child.root.thisnode.onDragOver(onDragLinkNodeOver);
        child.left.thisnode.onDragOver(onDragLinkNodeOver);
        child.right.thisnode.onDragOver(onDragLinkNodeOver);
        
        children_set.push(child);
        
        });

    this.reclassify.add.click(function(){
        var children_set = this.data("children");
        
        var child = new addReclassifyIcon(paper_context, 300,250);
        
        
        child.container.drag(DragNodeMove, DragNodeStart, DragNodeEnd);
        
        child.output.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        child.input.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        
        child.output.thisnode.onDragOver(onDragLinkNodeOver);
        child.input.thisnode.onDragOver(onDragLinkNodeOver);
        
        children_set.push(child);
        
        });

    this.buffer.add.click(function(){
        var children_set = this.data("children");
        
        var child = new addBufferIcon(paper_context, 400,250);
        
        
        child.container.drag(DragNodeMove, DragNodeStart, DragNodeEnd);
        
        child.output.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        child.input.thisnode.drag(DragLinkNodeMove, DragLinkNodeStart, DragLinkNodeEnd);
        
        child.output.thisnode.onDragOver(onDragLinkNodeOver);
        child.input.thisnode.onDragOver(onDragLinkNodeOver);
        
        children_set.push(child);
        
        });
}
