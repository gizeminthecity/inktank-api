const mongoose = require("mongoose");
require("dotenv/config");

const Artist = require("../models/Artist.model");

const artistsArr = [
    {
        name: "Gizem",
        city: "Berlin",
        country: "Germany",
        picture:
            "https://res.cloudinary.com/gizemella/image/upload/v1619214966/new-change-org/wprpr4zckpzvnztpg9qq.jpg",
        price: 70,
        consultation: 30,
        works: "",
        about: "Hey, I'm from Delaware",
    },
    {
        name: "Süleyman",
        city: "Ankara",
        country: "Turkey",
        picture:
            "https://res.cloudinary.com/gizemella/image/upload/v1619214966/new-change-org/wprpr4zckpzvnztpg9qq.jpg",
        price: 100,
        consultation: 40,
        works: "",
        about: "Hey, I'm from Ankara",
    },
    {
        name: "Ezgi",
        city: "Milan",
        country: "Italy",
        picture:
            "https://res.cloudinary.com/gizemella/image/upload/v1619214966/new-change-org/wprpr4zckpzvnztpg9qq.jpg",
        price: 120,
        consultation: 50,
        works: "",
        about: "Hey, I'm from Bursa",
    },
];

mongoose.connect("mongodb://localhost/inktank").then(() => {
    console.log("DATABASE CONNECTED");
    Artist.insertMany(artistsArr).then(() => {
        console.log("ARTISTS ADDED");
        mongoose.disconnect();
        console.log("DISCONNECTED");
    });
});
