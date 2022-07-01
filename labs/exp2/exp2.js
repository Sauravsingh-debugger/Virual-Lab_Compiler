let input;
let size;



const isValidIdentifier = () =>{
    input=$("#inp1").val();
    size=input.length;
    console.log({input});
    
let c=0,flagv;

  //input any inputtring
//check whether it iinput a valid identifier or not
if( (input[0]>='a'&&input[0]<='z')
    ||
    (input[0]>='A'&&input[0]<='Z')
    ||
    (input[0]=='_') )
 {
   for(let i=1;i<size;i++)
   {
     if((input[i]>='a'&& input[i]<='z')
     ||
       (input[i]>='A' && input[i]<='Z')
     ||
     (input[i]>='0'&& input[i]<='9')
     ||
     (input[i]=='_') )
     {
 c++;
     }  }
    if(c==size)
    {
      flagv=0;
    }
 }
 else
 {
  flagv=1;
 } 
if(flagv==1)
 $("h6").html("input is not valid identifier")
else
$("h6").html(" input is valid identifier")
}