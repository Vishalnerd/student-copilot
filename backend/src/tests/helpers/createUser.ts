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

        password

    });

};