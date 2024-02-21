import connectDB from "@/lib/mongodb/connectDB";
import { NextMeetUser } from "@/template/User";
import { NextApiRequest, NextApiResponse } from "next";

export enum REGISTER_FAIL_ERR { "NO_ERROR" = 0, "EXISTING_USERID", "EXISTING_EMAIL" };

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const { userID, email } = await req.body;
    let existingUser = await NextMeetUser.findOne({ userID }).select("_id");
    if(existingUser){
      return res.json({ message: REGISTER_FAIL_ERR.EXISTING_USERID });
    }
    existingUser = await NextMeetUser.findOne({ email }).select("_id");
    if(existingUser){
        return res.json({ message: REGISTER_FAIL_ERR.EXISTING_EMAIL });
    }
    return res.json({ message: REGISTER_FAIL_ERR.NO_ERROR });
  } catch (error) {
    console.error(error);
  }
};

export default POST;