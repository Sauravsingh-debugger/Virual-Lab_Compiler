let input;
let size;
const isComment = () =>{
    input=$("#inp1").val();
    size=input.length;
    console.log({input});
    if (input[0] == '/' && input[1] == '/'
        && input[2] != '/') {
 
        console.log("It is a single-line comment");
        $('h6').html("It is a single-line comment")
        return;
    }
 
    if (input[size - 2] == '*'
        && input[size - 1] == '/' && input[0] == '/' && input[1] == '*') {
 
        $('h6').html("It is a multi-line comment")
        return;
    }
    $('h6').html("It is not a comment")
}
