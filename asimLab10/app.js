const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();
Mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-scvza.mongodb.net:27017,cluster0-shard-00-01-scvza.mongodb.net:27017,cluster0-shard-00-02-scvza.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')

const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//handling default path
app.get("/",(request,response)=>{
    response.send("end point not found!");
});

app.get("/addperson",async (request,response)=>{
    try{
        var person = new PersonModel({firstname:"Kevin", lastname: "Teran" });
        var result = await person.save();
        response.send(result);
    } catch(error){
        response.status(500).send(error);
    }
})

//create person
app.post("/person", async (request, response) => {
    try {
        var person = new PersonModel(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//read all people
app.get("/people", async (request, response) => {
    try {
        var result = await PersonModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//read person by id
app.get("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});

//update person
app.put("/person/:id", async (request, response) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//delete person
app.delete("/person/:id", async (request, response) => {
    try {
        var result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("Listening at :3000...");
});
