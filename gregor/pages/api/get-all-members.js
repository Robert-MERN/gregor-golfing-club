import Users from '../../models/userModel';
import connectMongo from '../../utils/functions/connectMongo';
import cryptojs from "crypto-js";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */


// decrypting password

const decrypting_password = (password) => {
    const bytes = cryptojs.AES.decrypt(password, process.env.CJS_KEY);
    const decrypted = bytes.toString(cryptojs.enc.Utf8);
    return decrypted;
}

export default async function registerUser(req, res) {
    console.log("Connecting with DB")
    try {
        // connecting with monogDB
        await connectMongo();
        console.log("Successfuly conneted with DB");


        // Validating a requester status, whther he's an admin?
        const { id, single_user } = req.query;
        const admin_user = await Users.findById(id);
        if (!admin_user || !admin_user.isAdmin) {
            return res.status(401).json({ success: false, message: "You're not allowed!" });
        }




        // Searching user in DB
        let users;
        if (single_user) {
            const { id } = req.body;
            const user_with_encryted_passwords = await Users.findById(id);
            if (!user_with_encryted_passwords) {
                return res.status(404).json({ success: false, message: "User was not found" });
            }
            users = { ...user_with_encryted_passwords.toObject(), password: decrypting_password(user_with_encryted_passwords.toObject().password) }
        } else {
            users = [];
            const users_with_encryted_passwords = await Users.find().sort({ createdAt: -1 });
            for (const each_user of users_with_encryted_passwords) {
                const userObject = each_user.toObject();
                const password = decrypting_password(userObject.password);
                users.push({ ...userObject, password });
            }
        }
        // sending success response to user
        return res.status(200).json(users);

    } catch (err) {
        // if server catches any error
        return res.status(500).json({ success: false, message: err.message });
    }

}