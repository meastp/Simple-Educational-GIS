/*
 * Operations on data layers (i.e. RasterLayer objects)
 * 
 */

var RasterOperationAND = new RasterOperation("AND");

RasterOperationAND.apply = function(RasterLayer1, RasterLayer2, RasterLayerResult)
{
    for (var i = 0; i<10; i++)
    {
        for (var j = 0; j<10; j++)
        {
            RasterLayerResult[i][j] = (RasterLayer1.data[i][j] & RasterLayer2.data[i][j]) ? 1 : 0; // if 1 in both, return 1, else 0
        }
    }
};

var RasterOperationOR = new RasterOperation("OR");

RasterOperationOR.apply = function(RasterLayer1, RasterLayer2, RasterLayerResult)
{
    for (var i = 0; i<10; i++)
    {
        for (var j = 0; j<10; j++)
        {
            RasterLayerResult[i][j] = (RasterLayer1.data[i][j] | RasterLayer2.data[i][j]) ? 1 : 0; // if 1 in either, return 1, else 0
        }
    }
};

var RasterOperationNOT = new RasterOperation("NOT");

RasterOperationNOT.apply = function(RasterLayer1, RasterLayer2, RasterLayerResult)
{
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
            
            RasterLayerResult[i][j] = result;
        }
    }
};

var RasterOperationXOR = new RasterOperation("XOR");

RasterOperationXOR.apply = function(RasterLayer1, RasterLayer2, RasterLayerResult)
{
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
            
            RasterLayerResult[i][j] = result;
        }
    }
};

// operations in this list will be available as raster operations in the application
var operations = [
    RasterOperationAND,
    RasterOperationOR,
    RasterOperationNOT,
    RasterOperationXOR
];
