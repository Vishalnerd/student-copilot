import bcrypt from "bcryptjs";
import User from "../../models/user";

export const createUser = async () => {

    const password =
        await bcrypt.hash(
            "Password123",
            10
        );

    return await User.create({

        name:"Vishal",

        email:"vishal@test.com",

        password,

        provider:"local",

    });

};

export const createGoogleUser = async () => {

    return await User.create({

        name:"Google User",

        email:"google@test.com",

        googleId:"google-user-id",

        provider:"google",


    });

};

export const createLocalUserWithGoogleEmail = async () => {

    const password =
        await bcrypt.hash(
            "Password123",
            10
        );

    return await User.create({

        name:"Local User",

        email:"local@test.com",

        password,

        provider:"local",

        googleId:"google-user-id",

    });

};