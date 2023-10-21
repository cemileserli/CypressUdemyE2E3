// Create an Array
const myNumbers = [1, 2, 3, 4, -5, -1, -2, 0, 11]
const posNumbers = removeNetatives(myNumbers, (x)=> x>=0 )

function removeNetatives(myNumbers, callbackF){
	var Array = []
    for (var x in Array){
    	if(callbackF(x)){
        	Array.push(x)
        }
        
    }
    return Array
}