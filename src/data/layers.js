/*
 * Data layers
 * 
 * the data layers that are included in this project -- each data layer is a 10x10 array with integer values
 * two digit values are intepreted as a tile that contains two one digit values
 */

var pollution_layer = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,1,1,1,1,1],
    [1,1,1,0,0,0,1,1,1,0],
    [1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,1,1,0,0],
    [0,0,0,0,1,1,1,0,0,0]
];

var water_layer = [
    [0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0]
];

var infrastructure_layer = [
    [0,2,0,0,1,0,0,0,0,0],
    [0,2,0,0,1,0,0,0,0,2],
    [2,2,0,0,1,0,2,0,2,0],
    [1,21,1,1,1,0,2,2,0,0],
    [0,2,0,0,1,0,2,0,0,0],
    [0,2,2,2,21,2,2,0,0,0],
    [0,2,0,0,1,0,2,0,0,0],
    [2,2,0,0,1,0,2,0,0,0],
    [1,21,1,1,1,1,1,21,1,1],
    [0,2,0,0,1,0,0,0,2,0]
];

// data layers added to this list will be available in the application
var raster_data_layers = [
    new RasterLayer("pollution", pollution_layer),
    new RasterLayer("water", water_layer),
    new RasterLayer("roadrail", infrastructure_layer)
];
