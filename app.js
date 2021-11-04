//include package
var express = require("express");
var app = express();
var path = require('path');
var port = 8888
//app.use will allow reading from body of message, 
//impt for reading body data
app.use(express.json())


/*
//Include firebase package
var firebase = require('firebase')
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }

//Initialize your Firebase app:
firebase.initializeApp(firebaseConfig)

//Get a reference to the database service:
var database = firebase.database()
*/

var firebase_admin = require("firebase-admin");
var serviceAccount = require("./tslproj1-firebase-adminsdk-5curw-65a897bb46.json");

//const { O_NOFOLLOW } = require("constants");
//const { networkInterfaces } = require("os");

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://tslproj1-default-rtdb.asia-southeast1.firebasedatabase.app"
});

//======================== Quote Bot routes

//global var
var premium     =0;
var sum_assured ="";
var firstname   ="";
var occupation_group="";
var policy_type ="";
var pa_plan_type="";
var lastname    ="";
var email       ="";
var phone       ="";
var birthdate   ="";

app.post("/quote",function(req,res){
    console.log("---quote---");

    //check intent
    if (req.body.queryResult.intent.displayName == "sum")
    {
        console.log("sum");
        calculate_premium(req,res);
        //console.log("----premium="+premium);
        //res.send(JSON.stringify({fulfillmentText:"particulars saved"}));

    }
    else if (req.body.queryResult.intent.displayName == "get-particulars2")
    {
        console.log("get-particulars2");
        save_data(req,res);
        email_quote(req,res)        
        
    }
    else if (req.body.queryResult.intent.displayName == "get-live-agent")
    {
        console.log("get-live-agent");
        //get_live_agent(req,res);
        //res.send(JSON.stringify({fulfillmentText:"get_live_agent"}));
    }
  
  });  
  
//======================== Quote Bot functions
/*


/*
{
  "responseId": "4dccde94-fc4b-4616-b325-d8dfdce95fab-b8cc4930",
  "queryResult": {
    "queryText": "30sep 2000",
    "parameters": {
      "email": "23dsa2@sdfasd.com",
      "lastname": "Tan",
      "phone": "93844440",
      "birthdate": "2000-09-30T12:00:00+08:00"
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "Thank you for providing us with your particulars, Fanny. Your quotation for PA policy for SELF for sum assured of $ 100k has been emailed to your email address 23dsa2@sdfasd.com  together with the Product Summary and Policy Wordings for your review. Our financial adviser will contact you at 93844440  within 3 working days. Thank you for using our Get-A-Quote service. It has been a pleasure to serve you. Have a Good Day!",
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            "Thank you for providing us with your particulars, Fanny. Your quotation for PA policy for SELF for sum assured of $ 100k has been emailed to your email address 23dsa2@sdfasd.com  together with the Product Summary and Policy Wordings for your review. Our financial adviser will contact you at 93844440  within 3 working days. Thank you for using our Get-A-Quote service. It has been a pleasure to serve you. Have a Good Day!"
          ]
        }
      }
    ],
    "outputContexts": [
      {
        "name": "projects/tslquotationagent-mugd/agent/sessions/fb58abf5-0351-f0a2-252a-c81dbe96b338/contexts/get-occupation-group1",
        "lifespanCount": 3,
        "parameters": {
          "email": "23dsa2@sdfasd.com",
          "lastname": "Tan",
          "policy-type.original": "pa",
          "pa-plan-type.original": "",
          "phone": "93844440",
          "phone.original": "93844440",
          "pa-plan-type": "SELF",
          "occupation_group": "Skilled/Semi-Skilled worker",
          "sum": "100k",
          "birthdate.original": "30sep 2000",
          "sum.original": "100k",
          "policy-type": "PA",
          "firstname": "Fanny",
          "email.original": "23dsa2@sdfasd.com",
          "lastname.original": "tan",
          "occupation_group.original": "skilled",
          "birthdate": "2000-09-30T12:00:00+08:00",
          "firstname.original": "fanny"
        }
      },
      {
        "name": "projects/tslquotationagent-mugd/agent/sessions/fb58abf5-0351-f0a2-252a-c81dbe96b338/contexts/pa-type",
        "lifespanCount": 5,
        "parameters": {
          "firstname.original": "fanny",
          "pa-plan-type": "SELF",
          "occupation_group.original": "skilled",
          "phone.original": "93844440",
          "firstname": "Fanny",
          "occupation_group": "Skilled/Semi-Skilled worker",
          "lastname.original": "tan",
          "pa-plan-type.original": "",
          "sum.original": "100k",
          "lastname": "Tan",
          "policy-type.original": "pa",
          "policy-type": "PA",
          "email": "23dsa2@sdfasd.com",
          "phone": "93844440",
          "birthdate": "2000-09-30T12:00:00+08:00",
          "sum": "100k",
          "email.original": "23dsa2@sdfasd.com",
          "birthdate.original": "30sep 2000"
        }
      },
      {
        "name": "projects/tslquotationagent-mugd/agent/sessions/fb58abf5-0351-f0a2-252a-c81dbe96b338/contexts/pa-type-self",
        "lifespanCount": 2,
        "parameters": {
          "sum": "100k",
          "occupation_group.original": "skilled",
          "lastname.original": "tan",
          "phone": "93844440",
          "email": "23dsa2@sdfasd.com",
          "occupation_group": "Skilled/Semi-Skilled worker",
          "pa-plan-type": "SELF",
          "policy-type": "PA",
          "firstname": "Fanny",
          "firstname.original": "fanny",
          "lastname": "Tan",
          "phone.original": "93844440",
          "pa-plan-type.original": "",
          "birthdate.original": "30sep 2000",
          "policy-type.original": "pa",
          "email.original": "23dsa2@sdfasd.com",
          "sum.original": "100k",
          "birthdate": "2000-09-30T12:00:00+08:00"
        }
      },
      {
        "name": "projects/tslquotationagent-mugd/agent/sessions/fb58abf5-0351-f0a2-252a-c81dbe96b338/contexts/get-sum-assured",
        "lifespanCount": 4,
        "parameters": {
          "firstname": "Fanny",
          "sum": "100k",
          "lastname.original": "tan",
          "email": "23dsa2@sdfasd.com",
          "policy-type": "PA",
          "firstname.original": "fanny",
          "pa-plan-type.original": "",
          "pa-plan-type": "SELF",
          "phone.original": "93844440",
          "birthdate.original": "30sep 2000",
          "lastname": "Tan",
          "policy-type.original": "pa",
          "email.original": "23dsa2@sdfasd.com",
          "occupation_group": "Skilled/Semi-Skilled worker",
          "sum.original": "100k",
          "phone": "93844440",
          "occupation_group.original": "skilled",
          "birthdate": "2000-09-30T12:00:00+08:00"
        }
      }
    ],
    "intent": {
      "name": "projects/tslquotationagent-mugd/agent/intents/50abfb42-5534-4890-abaf-2b0ba8f35ad6",
      "displayName": "get-particulars2",
      "endInteraction": true
    },
    "intentDetectionConfidence": 1,
    "diagnosticInfo": {
      "end_conversation": true
    },
    "languageCode": "en",
    "sentimentAnalysisResult": {
      "queryTextSentiment": {
        "score": 0.2,
        "magnitude": 0.2
      }
    }
  }
}}*/
function calculate_premium(req,res)
{
    console.log("---calculate_premium---");

    //read parameters
    sum_assured     = req.body.queryResult.parameters.sum;
    //var occupation_group   = req.body.queryResult.parameters.occupation_group;

    var outputContexts_array = req.body.queryResult.outputContexts

    console.log("---outputContexts_array="+outputContexts_array);

    for (var i=0;i<outputContexts_array.length;i++)
    {
      val=outputContexts_array[i].parameters["pa-plan-type"]
      console.log("---val="+val);
      if (val !=null)
        //pa_plan_type=val
        pa_plan_type=val.toLowerCase()
      console.log("---pa_plan_type="+pa_plan_type);

      val=outputContexts_array[i].parameters["firstname"]
      console.log("---val="+val);
      if (val !=null)
        firstname=val
      console.log("---firstname="+firstname);

      val=outputContexts_array[i].parameters["occupation_group"]
      console.log("---val="+val);
      if (val !=null)
        occupation_group=val
      console.log("---occupation_group="+occupation_group);

      val=outputContexts_array[i].parameters["policy-type"]
      console.log("---val="+val);
      if (val !=null)
        policy_type=val
      console.log("---policy_type="+policy_type);       
      
      val=outputContexts_array[i].parameters["sum"]
      console.log("---val="+val);
      if (val !=null)
        sum_assured=val
      console.log("---sum_assured="+sum_assured);       

    }
    

    console.log('--> pa_plan_type='+pa_plan_type);
    console.log('--> sum_assured='+sum_assured);
    console.log('--> occupation_group='+occupation_group);
    console.log('--> firstname='+firstname);
    console.log('--> policy_type='+policy_type);

    occupation_group=JSON.stringify(occupation_group);

    //replace space and / with "-"
    occupation_group = occupation_group.replace(/ /g, "_");
    occupation_group = occupation_group.replace(/\//g, "_").toLowerCase();
    occupation_group = JSON.parse(occupation_group);
    console.log('calculate_premium --> occupation_group='+occupation_group);
   
    //remove k
    sum_assured=JSON.stringify(sum_assured);
    sum_assured=sum_assured.toLowerCase().replace(/k/g, "")
    sum_assured = JSON.parse(sum_assured);
    console.log('calculate_premium --> sum_assured='+sum_assured);

    //specify location/reference you want to read from 
    //var read_ref = firebase_admin.database().ref("/pa/types/family/"+occupation_group+"/annual_premium_per_1000");
    var read_ref = firebase_admin.database().ref("/pa/types/"+pa_plan_type+"/"+occupation_group);
    console.log('calculate_premium --> read_ref='+read_ref);

    //read value at that reference
    read_ref.on('value',function(snapshot){
        var premium_1000 =snapshot.val().annual_premium_per_1000;
        console.log("premium_1000="+premium_1000);
        //how to return the data read from firebase 
        //converting snapshot object to a string
        //var premium_string= JSON.stringify(premium);

        //calculate premium
        premium=premium_1000*sum_assured
           
        var result="Thank you for providing us with the information required for the quotation, " + firstname + "! The annual premium for "+
                   policy_type + " policy for " + pa_plan_type + " for sum assured of $ " + sum_assured + 
                   "k is $" +premium+ ". If you would like us to email the quotation with Product Summary and Policy Wordings to you for your review. "+
                   "Please type ‘yes’ to continue or 'no' to end."
         
        console.log("result="+result);
        res.send(JSON.stringify({fulfillmentText:result}));
        
        //cannot return because it a asynch read of firebase
    });
};

function save_data(req,res)
{
    console.log("---save_data---");

    //read parameters
    lastname    = req.body.queryResult.parameters.lastname;
    email       = req.body.queryResult.parameters.email;
    phone       = req.body.queryResult.parameters.phone;
    birthdate   = req.body.queryResult.parameters.birthdate;
  
    console.log("save_data --> premium="+premium);
    console.log('save_data --> firstname='+firstname);
    console.log('save_data --> lastname='+lastname);
    console.log('save_data --> email='+email);
    console.log('save_data --> phone='+phone);
    console.log('save_data --> birthdate='+birthdate);
    console.log('save_data --> pa_plan_type='+pa_plan_type);
    console.log('save_data --> sum_assured='+sum_assured);
    console.log('save_data --> occupation_group='+occupation_group);
    console.log('save_data --> policy_type='+policy_type);    

    //specify location/referece you want to write to 
    //add to db
    var write_ref = firebase_admin.database().ref("/contact_details/");

    write_ref.push({"firstname":firstname,
                    "lastname":lastname,
                    "email":email,
                    "phone":phone,
                    //"birthdate":(new Date(birthdate)).toString(),
                    "premium":premium,
                    "pa_plan_type": pa_plan_type,
                    "sum_assured":sum_assured,
                    "occupation_group":occupation_group,
                    "policy_type":policy_type
                  });                 

    console.log('particulars and quotation saved to firebase');   
    
    //Create a reference to your custom path at which you want to write your JSON object (mentioned as "obj" in the snippet below).
    //Then you set that object on the path:
    /*
    database.ref("customPath").set(obj, function(error) {
        if (error) {
          // The write failed...
          console.log("Failed with error: " + error)
        } else {
          // The write was successful...
          console.log("success")
        }
    });
    */
};


function email_quote(req,res)
{
    console.log("---email_quote---");
    console.log("email_quote --> premium="+premium);
    console.log('email_quote --> firstname='+firstname);
    console.log('email_quote --> lastname='+lastname);
    console.log('email_quote --> email='+email);
    console.log('email_quote --> phone='+phone);
    console.log('email_quote --> birthdate='+birthdate);
    console.log('email_quote --> pa_plan_type='+pa_plan_type);
    console.log('email_quote --> sum_assured='+sum_assured);
    console.log('email_quote --> occupation_group='+occupation_group);
    console.log('email_quote --> policy_type='+policy_type);     

    email_text='Dear '+ firstname + ',\nThank you for using our Get-A-Quote service.' + 
              'The annual premium for '+  policy_type + ' policy for ' + pa_plan_type + 
              ' for sum assured of $ " + sum_assured + "k is $" +premium+ ". The Product Summary ' +
              'and Policy Wordings are as attached for your review. Our financial adviser will contact you at ' +
              phone + ' within 3 working days. Have a Good Day!'

    console.log('email_quote --> email_text='+email_text); 

    const request = require('request');

    const options = {
      method: 'POST',
      url: 'https://email-sender1.p.rapidapi.com/',
      qs: {
        txt_msg: ''+email_text,
        to: ''+email,
        from: 'Get-A-Quote Bot',
        subject: 'Policy Quotation',
        bcc: 'ztsl1234@gmail.com',
        reply_to: 'customer-service@abc-insurance.com',
        html_msg: '<html><body><b>test of the body</b></body></html>',
        cc: 'ztsl1234@gmail.com'
      },
      headers: {
        'x-rapidapi-key': '1e7e9484b9msh9635d86606ac1fbp13c606jsn9329bd3ae436',
        'x-rapidapi-host': 'email-sender1.p.rapidapi.com',
        useQueryString: true
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

    console.log("---email send---");
    var result="Thank you for providing us with your particulars, " + firstname + "! The annual premium for "+
    policy_type + " policy for " + pa_plan_type + " for sum assured of $ " + sum_assured + 
    "k is $" +premium+ ". The quotation has been emailed to your email address " +email+ " together with the Product Summary " +
    "and Policy Wordings for your review. Our financial adviser will contact you at " +
    phone + " within 3 working days. Thank you for using Get-A-Quote service. It has been " +
    "a pleasure to serve you. Have a Good Day!"

    console.log("result="+result);
    res.send(JSON.stringify({fulfillmentText:result}));

    
}
//=====================others
app.post("/chat",function(req,res){
    console.log("chat")
    if (req.body.queryResult.intent.displayName=="get-Map")
    {
        get_map(req,res)
    }
   
});

function get_map(req,res)
{
    console.log("showmap")
    var place= req.body.queryResult.parameters.place;
    var country = req.body.queryResult.parameters.country;

    console.log("place="+place + "   country="+country );

    image="https://maps.googleapis.com/maps/api/staticmap?center=Star vista,Singapore&zoom=18&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyCouKBzbVKTuOplP-aAaJb9Wsk3mC6AQaM"
    var result="place is " + place + "   country="+country + "\n" + image;
    res.send(JSON.stringify({fulfillmentText:result}));    

};

app.post("/chat4",function(req,res){
    console.log("chat")
    //read params
    var amount = req.body.queryResult.parameters.amount;
    var toC = req.body.queryResult.parameters.toCurrency;
    var fromC = req.body.queryResult.parameters.fromCurrency;
    console.log("amount="+amount)
    console.log("toC="+toC)
    console.log("fromC="+fromC)

    var request = require('request');
    var url="http://data.fixer.io/api/latest?access_key=6f58c045f2f0f9ae28985f8c8643e12e&base=EUR&symbols="
    + fromC + "," + toC
    console.log("url="+url)
    request(url,function(error,response,body){
        // callback wll be triggered once the api responds back with
        // json
        console.log("inside request")
        console.log("body is "+body)
        res.send(JSON.stringify({fulfillmentText: "body is "+body}));
    })
});

app.post("/chat3",function(req,res){
    //read parameters
    var term = req.body.queryResult.parameters.term;
    console.log('term='+term);

    //specify location/referece you want to read from 
    var ref = firebase_admin.database().ref("/definitions/"+term);

    //read value at that reference
    ref.on('value',function(snapshot){
        var definition =snapshot.val();
        console.log("definition="+definition);
        //converting snapshot object to a string
        var def= JSON.stringify(definition);
        res.send(JSON.stringify({fulfillmentText: "The definition is "+def}));
    })
});

app.post("/chat2",function(req,res){
    //read parameters
    var term = req.body.queryResult.parameters.term;
    console.log('chat2 term='+term);

    //specify location/referece you want to read from 
    var ref = firebase_admin.database().ref("/defintion2/"+term);
  
    //read value at that reference
    ref.on('value',function(snapshot){
        var definition =snapshot.val().definition;
        var image =snapshot.val().image;
        console.log("definition="+definition);
        console.log("image="+image);
        //converting snapshot object to a string
        var result="definition is " + definition + "\n" + image;
        res.send(JSON.stringify({fulfillmentText:result}));     
    })

    //add to db
    var ref2 = firebase_admin.database().ref("/log/");
    ref2.push({"search_term":term,
                "date":(new Date()).toString()});
  
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.get("/",function(req,res){
    res.send('<h1>This is my web app');
});

var listener =
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started");
    console.log('Listening on port ' +   listener.address().port);
});

app.get("/temp/:celsius",function(req,res){
    var request = require('request');

    if (req.params.celsius!= NaN){
        res.send("Sorry wrong input!")
    }
    var celsius = parseFloat(req.params.celsius);//string to float
    var fahr = (celsius * 9/5) + 32;
    res.send(celsius + '<h3>' + ' celsius to fahrenheit is ' + fahr + '</h3>');
    });


app.get("/temp2/",function(req,res){
        var request = require('request');
        console.log("temp2 triggered");
        var celsius = parseFloat(req.query.cel);
        var fahr = (celsius * 9/5) + 32;
        //format for diaglogflow chatbox response
        var chatbotresponse={fullfillmentText:"value is " + fahr};
        //convert string to json
        res.send(JSON.stringify(chatbotresponse))
        //res.send(celsius + '<h3>' + ' the celsius to fahrenheit is ' + fahr + '</h3>');
    });
        
app.get("/grade/:score",function(req,res) {
    console.log('grade route is triggered');
    var score = parseFloat(req.params.score);
    grade=""

    if (score >= 80) {
        grade="A"
    } else if (score >= 70) {
        grade="B"
    } else if (score >= 60) {
        grade="C"
    } else if (score >= 50) {
        grade="D"
    }
    else {
        grade="F"
    }

    res.send("grade is " + grade)

});


app.post("/post",function(req,res){
    console.log("post route was triggered");
    var fname = req.body.fname ;
    var lname = req.body.lname;
    res.send('POST request to the homepage ' +'<br>firstname: ' + fname + '<br>lastname: ' +   lname );
});

app.get("/test.html", function(req, res) {
   console.log('directory:' + __dirname);
   console.log(path.join(__dirname +   '/test.html'));
   res.sendFile(path.join(__dirname +   '/test.html'));
});

//another route
//connect dialog flow via post (data is in body instead of url which is a get)
app.post("/dialogflow",function(req,res) {

    res.send(JSON.stringify({"fullfillment text": "this is fullfillment text"}));
});
