import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongoconnect";
import info from "../../../../mongo/Schema";

export async function GET() {
  await connectMongoDB();

  try {
    const events = await info.find({});
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load events" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectMongoDB();

  const body = await req.json();
  const { person, second, title, start, end } = body;

  if (!person || !second || !title || !start || !end) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newEvent = new info({
      person,
      second, // Ensure this is set
      title,
      start: new Date(start),
      end: new Date(end),
    });
    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error saving event:", error); // Log any errors
    return NextResponse.json(
      { message: "Failed to save event" },
      { status: 500 }
    );
  }
}
