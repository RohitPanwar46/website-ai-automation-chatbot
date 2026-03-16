import Lead from "@/models/Lead";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let data = await req.json();
    data = JSON.parse(data);
    console.log("Received lead info:", data);
    await connectDB();
    const lead = new Lead({ name: data.name, email: data.email, phone: data.phone });
    await lead.save();
    return NextResponse.json({ message: "Lead saved successfully" });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}