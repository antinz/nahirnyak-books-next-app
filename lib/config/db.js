import mongoose from "mongoose";

export const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://antoninzhirov:rMUnOnLEfIGMaSV7@cluster0.6dmroaj.mongodb.net/nahirnyak-books"
  );
  console.log("DB connected");
};
