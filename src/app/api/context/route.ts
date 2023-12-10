import { NextResponse } from "next/server";
import { getContext } from "@/utils/context";
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";

export async function POST(req: any, res: any) {
  const MessagingResponse = require('twilio').twiml.MessagingResponse; 
  var messageResponse = new MessagingResponse();
  try {
    const { messages } = await req.json()
    const lastMessage = messages.length > 1 ? messages[messages.length - 1] : messages[0]
    const context = await getContext(lastMessage.content, '', 10000, 0.7, false) as ScoredPineconeRecord[]
    messageResponse.context
    res.writeHead(200, {
      'Content-Type': 'text/xml' });
      res.end(messageResponse.toString()); 
    
    return NextResponse.json({ context })
  } catch (e) {
    console.log(e)
    return NextResponse.error()
  }
}
