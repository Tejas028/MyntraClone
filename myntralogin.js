function validate(){
    var uname=document.getElementById("nameInputContainer");
    var number=document.getElementById("mobileInputContainer");
    var mail=document.getElementById("emailInputContainer");
    var pincode=document.getElementById("pincodeInputContainer");
    var pass=document.getElementById("passwordInputContainer");
    var cpass=document.getElementById("cpasswordInputContainer");
    var passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    var numregex = /^[6789]\d{9}$/;
    // var confirm = document.getElementById("cPasswordInputContainer");
    
    // var uname=document.getElementsByClassName("nameInputContainer");

    if(uname.value.trim()=="")
    {
        alert("Username cannot be blank!");
        // document.getElementById("name-error").style.visibility="visible";
        return false;
    }
    else if(number.value.trim()=="")
    {
        alert("Mobile number cannot be blank!");
        return false;
    }
    else if(!numregex.test(number.value))
    {
        alert("Invalid Mobile Number!");
        return false;
    }
    else if(mail.value.trim()=="")
    {
        alert("Mail cannot be blank!");
        return false;
    }
    else if(pincode.value.trim()=="")
    {
        alert("Pincode cannot be blank!");
        return false;
    }
    else if(pass.value.trim()=="")
    {
        alert("Password cannot be blank!");
        return false;
    }
    else if(!passregex.test(pass.value))
    {
        alert("Invalid Password!");
        return false;
    }
    else if(cpass.value.trim()=="")
    {
        alert("Please confirm password!");
        return false;
    }
    else if(pass.value.trim()!=cpass.value.trim())
    {
        alert("Please re-enter correct password!");
        return false;
    }
    else
    {
        return true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("loginForm");
    var status = document.getElementById("loginStatus");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        status.textContent = "";

        if (!validate()) {
            return;
        }

        var response = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: document.getElementById("emailInputContainer").value,
                password: document.getElementById("passwordInputContainer").value
            })
        });

        if (response.ok) {
            window.location.href = "submitted.html";
            return;
        }

        var result = await response.json();
        status.textContent = result.error || "Login failed. Please try again.";
    });
});