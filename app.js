const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const json = require("body-parser/lib/types/json");

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/ab30329e1e"

    const options = {
        method: "POST",
        auth: "psalmuel:cdbbd1d777c81e1e0a1ac34a0e060469-us6"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            
            if(response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html")
            } else {
                res.sendFile(__dirname + "/failure.html")
            }

            console.log(response.statusCode);
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})







