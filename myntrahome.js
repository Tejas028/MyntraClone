const images=document.querySelectorAll(".slide");
var counter=2;
setInterval(function(){
    document.getElementById('radio'+counter).checked=true;
    counter++;
    if(counter>6)
    {
        counter=1;
    }
    console.log(counter);
},5000);

