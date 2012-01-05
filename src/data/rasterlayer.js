/*
 * RasterLayer
 * 
 * the data structure for a data layer.
 * 
 * name - name/short description of layer
 * data - 10x10 array of integer values
 */
 
function RasterLayer(name, data)
{
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
    
    // compare to other RasterLayer and check equality 
    this.equalTo = function(other)
    {
        for (var i = 0; i<10; i++)
        {
            for (var j = 0; j<10; j++)
            {
                if(this.data[i][j] != other.data[i][j]){ return false; }
            }
        }
        return true;
    }
    
    // check if there are exactly two (0 and 1) unique values in the data array
    this.isBooleanLayer = function()
    {
        var unique_values = [];
        for (var i = 0; i<10; i++)
        {
            for (var j = 0; j<10; j++)
            {
                var exists = $.inArray(this.data[i][j], unique_values);
                if(exists == -1)
                {
                    unique_values.push(this.data[i][j]);
                }
            }
        }
        
        var no_values = unique_values.length;
        var exists_zero = $.inArray(0, unique_values);
        var exists_one = $.inArray(1, unique_values);
        
        if((no_values==2) & (exists_zero!=-1) & (exists_one!=-1))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
}
