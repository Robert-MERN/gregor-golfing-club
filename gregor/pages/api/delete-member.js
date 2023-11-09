import connectMongo from "@/utils/functions/connectMongo"
import Users from "@/models/userModel";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */




export default async function handler(req, res) {
    try {

        await connectMongo();
        // new slot

        const { userId, adminId } = req.query;
        const user = await Users.findById(adminId);

        if (!user) return res.status(404).json({ status: false, message: "User doesn't exist!" })

        if (!user.isAdmin) return res.status(401).json({ status: false, message: "You're not allowed!" })

        const delete_user = await Users.findById(userId);
        if (!delete_user) return res.status(404).json({ status: false, message: "Member is not found!" });
        await Users.findByIdAndDelete(userId);
        return res.status(200).json({ status: true, message: "Member is deleted!" })

    } catch (err) {
        return res.status(501).json({ status: false, message: err.message });
    }
}

