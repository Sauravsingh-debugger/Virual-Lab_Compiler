
const isUpper = (str) => !/[a-z]/.test(str) && /[A-Z].*$/.test(str);
var first={},follow={},parseTable={},value=[],root,rootNodes;
const makeTargetVisible = () => 
{
    parseTable={};
    value=[];
    rootNodes=null;
    let array = $('#txt').val()?.split("\n");
    let temp = array?.map(i=>({first:i.split("->")[0].split(" ")[0],second:i.split("->")[1]}));
    for(let x in temp){
        let sec_array = temp[x].second.split("/");
        if(sec_array.length>1){
        for(let y in sec_array){
            value.push({first:temp[x].first,second:sec_array[y]});
        }
        }
        else
        value.push(temp[x])
    }
    let first = {};
    const recursiveCall = () => {
        let flag=false;
        for(let variable of Object.keys(first)){
            let first_array = first[variable];
            let cap = first_array?.findIndex(val=>isUpper(val));
            if(cap>=0){
                let variable = first_array[cap];
                let first_required = first[variable];
                let first_req_cap = first_required.findIndex(val=>isUpper(val));
                if(first_req_cap<0){
                    first_array.splice(cap,1);
                    for(let x of first_required){
                        let index = first_array.findIndex(val=>val==x);
                        if(index<0) first_array.push(x)
                    }
                }
                else{
                    flag=true;
                }

            }
        }
        if(flag) recursiveCall();
    }
    const calculateFirst = () =>{
        //calculating first for each of the lines 
        for(let line of value){
            //if first element is !uppercase then it is the terminal
            //just mark acheckpoint untill all of the uppercases are done
            let variable = line.first;
            let array = first[variable]?first[variable]:[]
            let rule = line.second.replace(" ","").split(" ");
            if(array.findIndex(val=>val==rule[0])<0)
                array.push(rule[0]);
            first[variable]=array;
        }
        recursiveCall()
    }
    //check if there is any uppercase
    
    calculateFirst();
    let follow = {};
    count=0;
    const recursiveCallFollow = () => {
        let flag=false;
        for(let variable of Object.keys(follow)){
            //if there is any upper case then check 
            //if there is a follow for it
            let follow_array = follow[variable];
            let cap = follow_array.findIndex(val=>isUpper(val));
            if(cap>=0){
                let item = follow_array[cap];
                let follow_item = follow[item];
                let cap_item = follow_item.findIndex(val=>isUpper(val))
                if(cap_item<0){
                    follow_array.splice(cap,1);
                    for(let x of follow_item){
                        let index = follow_array.findIndex(val=>val==x);
                        if(index<0) follow_array.push(x);
                    }
                }
                else{
                    flag=true;
                }
            }
        }
        count++;
        if(flag) recursiveCallFollow();
    }
    const calculateFollow = () => {
        follow[value[0].first]=["$"];
        for(let val of value){
            //if the right one is terminal then terminal is the follow
            //if the right one is epsilon then follow of first one will be the follow
            //if the right one is variable then first of that variable will be the follow
            let scnd = val.second.replace(" ","").split(" ");
            for(let x=0;x<scnd.length;x++){
              if(isUpper(scnd[x])){
                let array = follow[scnd[x]]?follow[scnd[x]]:[];
                if(x==scnd.length-1){
                    let index = array.findIndex(vl=>vl===val.first);
                    if(index<0&&val.first!==scnd[x]) array.push(val.first);
                }
                else{
                  //check the next element
                  if(isUpper(scnd[x+1])){
                    let first_array = first[scnd[x+1]];
                    let epsindex = first_array.findIndex(e=>e=="''");
                    for(let tr of first_array){
                        let index = array.findIndex(val=>val===tr);
                        if(index<0&&tr!=="''"){
                            array.push(tr);
                        } 
                    }
                    if(epsindex>=0){
                        let index = array.findIndex(vl=>vl===scnd[x+1]);
                        if(index<0) array.push(scnd[x+1]);
                    }
                    
                  }
                  else{
                    let index = array.findIndex(val=>val===scnd[x+1]);
                    if(index<0){
                        array.push(scnd[x+1]);
                    } 
                  }
                }
                follow[scnd[x]]=array;
              }
            }
          }
          
        recursiveCallFollow();
    }
    calculateFollow();
    $('#first-follow-id').empty();
    $("#tb2").empty()
    for(let x of Object.keys(first)){
        let first_array = first[x];
        let follow_array = follow[x]?follow[x]:[];
        let follow_array_str = '';
        let first_array_str = '';
        for(let x in first_array){
            let temp=first_array[x];
            first_array_str=`${first_array_str+temp} ${x!=first_array.length-1&&temp?", ":""}`;
        }
        for(let y in follow_array){
            let temp=follow_array[y];
            follow_array_str=`${follow_array_str+temp} ${y!=follow_array.length-1&&temp?", ":""}`;
        }
        $('#first-follow-id').append(`<tr>
        <td>${x}</td><td>${first_array_str}</td><td>${follow_array_str}</td>
        </tr>`);

    }
    let variables = Object.keys(first);
    root = variables[0];
    //for making parse table just map over variables 
    //check first of variables and if there is epsilon then fill the follow
    let terminals = ["$"];
    for(let x of array){
      let term_array =x.split(" ");
      for(let y of term_array){
        if(!isUpper(y)&&y!="''"&&y!="/"&&y!='->'){
          let index = terminals.findIndex(val=>val==y);
          if(index<0) terminals.push(y);
        }
      } 
    }
    let header = `<thead class="thead-dark"><tr><th></th>`;
    for(let x of terminals) header+=`<th>${x}</th>`;
    header+="</tr></thead><tbody>";
    $("#tb2").append(header);

    const firstAny = (val,v) =>{
        let array = [];
        if(isUpper(val[0])){
            array= first[val[0]];
        }
        else{
            if(val[0]!="''"){
                array.push(val[0]);
            }
            else{
                array= follow[v];
            }
        }
        return array;
    }
    let tellmp={};
    Object.assign(tellmp,parseTable);
    console.log({parseTable:tellmp})
    for(let x of variables){
        let str =`<tr><th>${x}</th>`
        let obj={};
        for(let y of value){
            if(y.first==x){
                let sec_array = y.second.replace(" ","").split(" ");
                let res_array= firstAny(sec_array,x);
                for(let pos of terminals){
                    let ind = res_array.findIndex(val=>val==pos);
                    if(ind>=0){
                        let tmp = obj[pos]?obj[pos]:[];
                        tmp.push(`${y.first}->${y.second}`);
                        obj[pos]=tmp;
                    } 
                }
            }
        }
        for(let pos of terminals){
            str+=`<th>${obj[pos]?obj[pos].join("<br/>"):""}</th>`
        }
        str+="</tr></tbody>";
        $("#tb2").append(str);
        parseTable[x]=obj;
        }  

}

const checkAllNodes= (node) =>{
    let childNodes =node.child;
    let index = childNodes.findIndex(val=>val.traversed==false);
    if(index<0){
        node.traversed=true;
        return null;
    }
    return index<0?null:childNodes[index];
}
//tree generation
class TreeNode {
    constructor(value){
        this.value=value;
        this.child = [];
        this.parent = null;
        this.traversed=false;
    }
}

const generate = ()=>{
    let canvas = document.getElementById("myCanvas").getContext('2d');
    canvas.clearRect(0, 0, 800, 800);
    let inputstr = $('#tkn').val();
    if(!inputstr){
        alert("Please provide a token stream");
        return;
    }
    $('canvas').show();
    console.log({inputstr});
    let inputarr = inputstr.split(" ");
    inputarr.push("$");
        let icnt = 0;
        let stack = [];
        let level=0;
        stack.push('$');
        stack.push(root); 
        stackptr=1;
        let rootNode = new TreeNode(root);
        let level_array={0:[{val:rootNode.value,parent:null}]};
        let tempNode = rootNode;
        rootNodes=rootNode;
        while(icnt<inputarr.length||stackptr>0){
            level++;
            if(icnt==inputarr.length-1){
                let node = parseTable[stack[stackptr]]?.[inputarr[icnt]][0];
                let production_rule=node?.split("->")[1];
                let elements = production_rule?.replace(" ","").split(" ");
                if(elements&&elements[0]=="''"){
                    stack.pop();
                    stackptr=stack.length-1;
                    let newNode = new TreeNode(inputarr[icnt]);
                    newNode.parent = tempNode;
                    newNode.traversed=true;
                    let array = tempNode.child;
                    array.push(newNode);
                    tempNode.child=array;
                    let l_array = level_array[level]?level_array[level]:[];
                    l_array.push({val:"''",parent:newNode.parent.value});
                    level_array[level]=l_array;
                    while(tempNode){
                        if(checkAllNodes(tempNode)){
                            tempNode=checkAllNodes(tempNode);
                            break;
                        }
                        else {
                            level--;
                            tempNode=tempNode.parent;
                        };
                    }
                    continue;
                }
                else {
                    break;
                };
            }
            if(stack[stackptr]==inputarr[icnt]){
                if(tempNode.value==inputarr[icnt]){
                    tempNode.traversed=true;
                }
                else{
                    let l_array = level_array[level+1]?level_array[level+1]:[];
                    let newNode = new TreeNode(inputarr[icnt]);
                    newNode.parent = tempNode;
                    newNode.traversed=true;
                    let array = tempNode.child;
                    array.push(newNode);
                    tempNode.child=array;
                    l_array.push({val:newNode.value,parent:newNode.parent.value});
                    level_array[level+1]=l_array;
                }
                stack.pop();
                icnt++;
                while(tempNode){
                    if(checkAllNodes(tempNode)){
                        tempNode=checkAllNodes(tempNode);
                        break;
                    }
                    else {

                        level--;
                        tempNode=tempNode.parent;
                    };
                }
            }
            else{
                let node = parseTable[stack[stackptr]][inputarr[icnt]][0];
                let production_rule=node.split("->")[1];
                let elements = production_rule.replace(" ","").split(" ");
                let node_parent = stack[stackptr];
                stack.pop();
                let newNode=null;
                let array=tempNode.child;
                for(let y=elements.length-1;y>=0;y--){
                    if(elements[y]=="''"){
                        let l_array = level_array[level]?level_array[level]:[];
                        let newNode = new TreeNode(elements[y]);
                        newNode.parent = tempNode;
                        let array = tempNode.child;
                        array.push(newNode);
                        l_array.push({val:newNode.value,parent:newNode.parent.value});
                        level_array[level]=l_array;
                        tempNode.child=array;
                        newNode.traversed=true;
                        while(tempNode){
                            if(checkAllNodes(tempNode)){
                                tempNode=checkAllNodes(tempNode);
                                break;
                            }
                            else {
                                level--;
                                tempNode=tempNode.parent;
                            }
                        }
                    }
                    else{
                        
                        let l_array = level_array[level]?level_array[level]:[];
                        stack.push(elements[y]);
                        newNode = new TreeNode(elements[y]);
                        newNode.parent = tempNode;
                        l_array.push({val:newNode.value,parent:newNode.parent.value});
                        level_array[level]=l_array;
                        array.push(newNode);
                    };
                }

                if(newNode) {
                    tempNode.child=array.reverse();
                    tempNode=newNode;
                };
                temp_val=node_parent;
            }
            
            stackptr=stack.length-1;
            
        }
        let keys = Object.keys(level_array);
        let level_re = {};
        let maxIndex =0;
        console.log({maxIndex,level_re});
        for(let x of keys){
            let temp={};
            for(let j=level_array[x].length-1;j>=0;j--){
                let y = level_array[x][j];
                if(y.parent==null){
                    break;
                }
                let ar = temp[y.parent]?temp[y.parent]:[];
                ar.push(y.val);
                temp[y.parent]=ar;
            }
            level_re[x]=temp;
        }
        let reobj = Object.keys(level_array);
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.font = "16px Arial";
        let pos={};
       
        reobj = Object.keys(level_re);
        console.log({level_re})
        ctx.beginPath();
        ctx.arc(400, 50, 30, 0, 2 * Math.PI);
        ctx.fillText(rootNode.value,400,50);
        ctx.stroke();
        pos[`${rootNode.value}_0`]={x:400,y:50};
        count=1;
        for(let x of reobj){

            let el = level_re[x];
            let tmpobj = Object.keys(el);
            if(tmpobj.length>0){
                let y_pos = (count*100+50);
                let element_arr = level_array[count];
                let x_pos=400-((element_arr.length/2)*50)+20;
                for(let h=tmpobj.length-1;h>=0;h--){
                    let y = tmpobj[h];
                     let array=el[y];
                     for(let z of array){
                        ctx.beginPath();
                        // !isUpper(z)&&pos[`${y}_${count-1}`]
                        // if(false){
                        //     ctx.arc(pos[`${y}_${count-1}`].x, y_pos, 30, 0, 2 * Math.PI);
                        //     x_pos=pos[`${y}_${count-1}`].x;
                        // }
                        // else{
                        // }
                        if(z){
                        ctx.arc(x_pos, y_pos, 30, 0, 2 * Math.PI);
                        ctx.fillText(z=="''"?"ε":z,x_pos,y_pos);
                        pos[`${z}_${count}`]={x:x_pos,y:y_pos};
                        ctx.stroke();
                        }
                        x_pos=x_pos+100;
                     }
                }
            count++;
            }
        }
        count=1;
        for(let x of reobj){

            let el = level_re[x];
            let tmpobj = Object.keys(el);
            if(tmpobj.length>0){
                let y_pos = (count*100+50);
                let element_arr = level_array[count];
                let x_pos=400-((element_arr.length/2)*50)+20;
                for(let h=tmpobj.length-1;h>=0;h--){
                    let y = tmpobj[h];
                     let array=el[y];
                     for(let z of array){
                        //  if(false){
                        //     x_pos=pos[`${y}_${count-1}`].x;
                        // }
                        let parent_pos = pos[`${y}_${count-1}`];
                        if(z){
                            ctx.beginPath();
                        ctx.moveTo(x_pos,y_pos-30);
                        ctx.lineTo(parent_pos.x, parent_pos.y+30);
                        ctx.stroke();
                        }
                        x_pos=x_pos+100;
                    }
                }
            count++;
            }
        }
        
 
}


