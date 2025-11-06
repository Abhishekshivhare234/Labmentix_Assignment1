import bcrypt from 'bcrypt'
import { supabase } from '../config/supabaseClient.js';


export const userSignUpHandler = async (req, res) => {
    console.log(req.body)
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const { data: fetchedUser, error: fetchedError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchedUser) {
            return res.status(401).json({
                message: "user already exists with this email"
            })

        }

        const hashedPassoword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase.from("users").insert({ name, email, password: hashedPassoword }).select();

        if (error) {
            return res.status(401).json({
                message: error.message
            })
        }
        return res.status(201).json({
            user: data,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log("Error occured during signup: ", error.message);
    }
};


export const signInHandler=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error:"Missing required fields"});
    }

    try {
        const { data: fetchedUser, error: fetchedError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchedError || !fetchedUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            })

        }

        const isPasswordValid=await bcrypt.compare(password,fetchedUser.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        return res.status(200).json({
            user: fetchedUser,
            message: "Sign in successful"
        })

    } catch (error) {
        console.log("Error occured during signin: ", error.message);
    }
}

