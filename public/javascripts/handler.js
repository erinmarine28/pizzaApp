$(document).on("pagecontainershow", function (event, ui) {
    pageId = $("body").pagecontainer("getActivePage").prop('id');
    switch (pageId) {
        case "sign-in-page":
            $("#sign-in-form").submit(function (e) {
                e.preventDefault();
                
                var request = $.ajax({
                    url: '/authenticate',
                    data: $(this).serialize(),
                    method: "POST"
                });
                
                request.done(function (response) {
                    if(response.status === "ERROR"){
                        alert("INTERNAL SERVER ERROR" + response.message);
                    } else {
                        alert(response.message);
                        if(response.message === "Authorized!"){
                          sessionStorage.setItem("user_id", response.user_id);
                          
                          

                         $.mobile.navigate("/home.html");
                        }
                    }
                });
            });
            break;
        case "sign-up-page":
            $("#sign-up-form").submit(function (e) {
                e.preventDefault();

                var request = $.ajax({
                    url: "/do-register",
                    data: $(this).serialize(),
                    method: "POST"
                });
                request.done(function (response) {
                    if(response.status === "ERROR"){
                        alert("INTERNAL SERVER ERROR" + response.message);
                    } else {
                        alert(response.message);
                    }
                });
             });
            let url = new URL(window.location.href);
            let searchParam = new URLSearchParams(url.search);
             if (searchParam.has("facebook_id")) {
                let id = searchParam.get('facebook_id');
                $('#facebook_id').val(id);
            }
             break;
        case "rate-us-page":
             $("#rate-us-form").submit(function (e){
                 e.preventDefault();
                
                 var request = $.ajax({
                     url: "/rate",
                     data: $(this).serialize(),
                     method: "POST"
                 });
                request.done(function(response){
                    if(response.status === "ERROR"){
                        alert("INTERNAL SERVER ERROR" + response.message);
                    } else {
                        alert(response.message);
 
                    }
                });
             });

    }
});

function logout(){
    sessionStorage.removeItem("user_id");
    $.mobile.navigate("/index.html");
}
