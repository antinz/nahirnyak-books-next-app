import { ConnectDB } from "/lib/config/db.js";
import EmailModel from "/lib/config/models/EmailModel.js";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const emailData = {
      email: `${formData.get("email")}`,
    };
    await EmailModel.create(emailData);
    return NextResponse.json({
      success: true,
      message: "Подписка успешна",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Введите ваш Email",
    });
  }
}

export async function GET(request) {
  const emails = await EmailModel.find({});
  return NextResponse.json({
    emails,
  });
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "Еmail успешно удален" });
}
