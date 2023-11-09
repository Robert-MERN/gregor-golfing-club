import Users from '../../models/userModel';
import connectMongo from '../../utils/functions/connectMongo';
import cryptojs from "crypto-js";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function registerUser(req, res) {
    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connectMongo();
        console.log("Successfuly conneted with DB");

        // Validating a requester status, whether he's an admin?
        const { id } = req.query;
        const admin_user = await Users.findById(id);
        if (!admin_user || !admin_user.isAdmin) {
            return res.status(401).json({ success: false, message: "You're not allowed!" });
        }


        // collecting information from request body
        const { password, ...other } = req.body;

        // encrypting password
        const encrypted = cryptojs.AES.encrypt(password, process.env.CJS_KEY).toString();

        // saving user in DB
        const user = new Users({
            ...other,
            password: encrypted,
        });
        await user.save();

        // sending success response to user
        return res.status(200).json({ success: true, message: `New member ${other.name} has been added` });

    } catch (err) {
        // if server catches any error
        return res.status(500).json({ success: false, message: err.message });
    }

}