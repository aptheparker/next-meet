import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import Member from "@/template/schema/user.model";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import { NextMeetUser } from "@/template/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();
      // Check if the member is in database
      const checkQuery = await Member.find({ loginID: req.body.loginID });

      // Member already exist
      if (checkQuery.length !== 0) {
        res.status(200).json({ isNew: false });
      }

      // Register new member
      const members = Member;
      const { userName, loginID, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await members.create({
        loginID,
        password: hashedPassword,
        memberID: getID(1),
        userName,
        email,
      });

      console.log(`${userName} registered as member`);
      res.status(201).json({ isNew: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server issu occurred" });
    }
  }
};

export default handler;
