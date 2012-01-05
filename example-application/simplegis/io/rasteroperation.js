/*
 * RasterOperation
 * 
 * name - name of the operation (e.g. "AND", "XOR")
 *
 */

function RasterOperation(name)
{
    this.name = name;
    this.apply = null; // the actual operation function, defined in operations.js
}
