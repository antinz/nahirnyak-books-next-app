import EmailModel from "../../../lib/config/models/EmailModel.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  await ConnectDB();

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
  await ConnectDB();
  try {
    const emails = await EmailModel.find({});
    return NextResponse.json({ success: true, emails });
  } catch (error) {
    console.error("Ошибка при получении email-адресов:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера при получении email-адресов" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  await ConnectDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID не предоставлен" },
        { status: 400 },
      );
    }

    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Еmail успешно удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении email:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера при удалении email" },
      { status: 500 },
    );
  }
}
