import { Mongoose } from "mongoose";

/* eslint-disable no-var */
declare global
{
    var mongoose: 
    {
        promise: Promise<Mongoose> | null;
        connection: Mongoose | null;
    };
}
