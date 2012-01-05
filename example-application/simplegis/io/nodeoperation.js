/*
 * Operations and algorithms on tree nodes
 * 
 */

// Object for tree-like operations on RasterLayer and RasterOperation objects linked together
function OperationNode(root_node, paper_context)
{
    this.root = root_node; // a node that has left and right links need to be root
    this.operation = this.root.operation;
    this.paper_context = paper_context;
    
    //var grey = []; // discovered nodes
    //var black = []; // processed nodes
    
    // Depth-first search through the binary tree
    function DFS(paper_context, node, grey, black)
    {
        var self = node;
        //console.log("Root node: ");
        //console.log(self);
        
        if((node.left==null) & (node.right==null))
        {
            //console.log("Reached end node: ");
            //console.log(self);
            black.push(self.id);
            return {id : self.id, data : self.layer};
        }
        
        var left = null;
        if(node.left!=null)
        {
            var left_node = paper_context.getById(self.left.othernode_id);
            grey.push(left_node.id);
            //console.log("Found left node :");
            //console.log(left_node);
            left = DFS(paper_context, left_node.data("root"), grey, black);
            //console.log("END left");
        }
        
        var right = null;
        if(node.right!=null)
        {
            var right_node = paper_context.getById(self.right.othernode_id);
            grey.push(right_node.id);
            //console.log("Found right node :");
            //console.log(right_node);
            right = DFS(paper_context, right_node.data("root"), grey, black);
            //console.log("END right");
        }
        
        
        
        var operation_result = new RasterLayer("result", null);
        self.operation.apply(left.data, right.data, operation_result.data);
        
        //console.log("END root");
        return { id : self.id, data : operation_result };
    }
    
    // Run DFS to get the data for this node (this.root)
    this.RasterLayerResult = DFS(this.paper_context,this.root,[],[]);  
    
}
