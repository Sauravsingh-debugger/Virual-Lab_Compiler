var value = "";
const generateToken = () => {
    var obj={};
    let input_value = $("#inp1").val();
    value = input_value;
    detectToken(value,obj);
    renderToken(obj)
}
function isValidDelimiter(ch) {
    if (ch == ' ' || ch == '+' || ch == '-' || ch == '*' ||
    ch == '/' || ch == ',' || ch == ';' || ch == '>' ||
    ch == '<' || ch == '=' || ch == '(' || ch == ')' ||
    ch == '[' || ch == ']' || ch == '{' || ch == '}')
    return (true);
    return (false);
 }
function isValidOperator(ch){
    if (ch == '+' || ch =='-' || ch == '*' ||
    ch == '/' || ch == '>' || ch == '<' ||
    ch == '='||ch=='&')
    return (true);
    return (false);
 }
 function isvalidIdentifier(str){
    let tmp = parseInt(str[0]);
    if ((str[0]==tmp.toString()) || isValidDelimiter(str[0]) == true)
    return (false);
    return (true);
 }
 const strcmp =(src,trg) =>src===trg;

 function isValidKeyword(str) {
    if (strcmp(str, "if") || strcmp(str, "else") || strcmp(str, "while") || strcmp(str, "do") ||    strcmp(str, "break") || strcmp(str, "continue") || strcmp(str, "int")
    || strcmp(str, "double") || strcmp(str, "float") || strcmp(str, "return") || strcmp(str,    "char") || strcmp(str, "case") || strcmp(str, "char")
    || strcmp(str, "sizeof") || strcmp(str, "long") || strcmp(str, "short") || strcmp(str, "typedef") || strcmp(str, "switch") || strcmp(str, "unsigned")
    || strcmp(str, "void") || strcmp(str, "static") || strcmp(str, "struct") || strcmp(str, "goto"))
    return (true);
    return (false);
 }
  function isValidInteger(str) {
     let val =str.split();
     let tmp = parseInt(str);
     if(val.length==1&&(str===tmp.toString()))
         return true;
    return false;
 }
 function isRealNumber(str){
    let val =str.split();
    if(val.length>2)
      return false;
    else{
       for(let i=0;i<val.length;i++){
        let tmp = parseInt(val[i]);
           if(tmp.toString()!==val[i])
             return false;
       }
       return true;
    }  
 }

 const checkIfOtherQuote = (left,str) => {
   for(let x =left+1;x<str.length;x++){
      if(str[x]=='"'){
        return x;
      }
   }
   return str.length;
 }

function detectToken(str,obj){
   
    let left=0,right=0;
    let length=str.length;
    while(right<length&&left<=right){
        
        if(str[left]=='"'){
          let temp = checkIfOtherQuote(left,str);
          if(temp==str.length){
            let substr = str.substring(left,temp);
            obj[substr]={count:1,type:"Invalid Identifier"}; 
            return;
          }
          else{
            let substr = str.substring(left,temp+1);
            obj[substr]={count:1,type:"Identifier"}; 
            right=temp+1;
            left=temp+1;
            // console.log({right,left})
          }
        }
        if(isValidDelimiter(str[right])==false)
           right++;
        if(isValidDelimiter(str[right])==true&&left==right){
            if(isValidOperator(str[right])==true){
                let tmp = obj[str[right]]?obj[str[right]]:{count:0};
                tmp.count+=1;
                tmp.type="Operator";
                obj[str[right]]=tmp;
            }
            else{
              let tmp = obj[str[right]]?obj[str[right]]:{count:0};
                tmp.count+=1;
                tmp.type="Delimiter";
                obj[str[right]]=tmp;
            }
            right++;
            left=right;
        }
        else if(isValidDelimiter(str[right])==true&&left!=right||(right==length&&left!=right)){
            let subStr=str.substring(left,right);
            if(isValidKeyword(subStr)==true){
           
                let tmp = obj[subStr]?obj[subStr]:{count:0};
                tmp.count+=1;
                tmp.type="Keyword";
                obj[subStr]=tmp;
            }else if(isValidInteger(subStr)){
                let tmp = obj[subStr]?obj[subStr]:{count:0};
                tmp.count+=1;
                tmp.type="Integer";
                obj[subStr]=tmp;
            }else if(isRealNumber(subStr) == true){
                let tmp = obj[subStr]?obj[subStr]:{count:0};
                tmp.count+=1;
                tmp.type="RealNumber";
                obj[subStr]=tmp;
            }
            else if(isvalidIdentifier(subStr) == true&& isValidDelimiter(str[right - 1]) == false){
                let tmp = obj[subStr]?obj[subStr]:{count:0};
                tmp.count+=1;
                tmp.type="Identifier";
                obj[subStr]=tmp;
            }
           
            else if (isvalidIdentifier(subStr) == false&& isValidDelimiter(str[right - 1]) == false){
                 let tmp = obj[subStr]?obj[subStr]:{count:0};
                tmp.count+=1;
                tmp.type="Invalid Identifier";
                obj[subStr]=tmp; 
            }
          left=right;
            
        }
  
    }
    return;
}

const renderToken = (obj) =>{
  let keys = Object.keys(obj);
  $("#Identifier").empty();
  $("#Keyword").empty();
  $("#Operator").empty();
  $("#Integer").empty();
  $("#RealNumber").empty();
  $("#Delimiter").empty();
  $("#Invalid Identifier").empty();
  for(let x of keys){
    let id = `#${obj[x].type}`;
    $(id).append(`<span class="badge bg-light text-dark">${x}</span>`)
  }
}

