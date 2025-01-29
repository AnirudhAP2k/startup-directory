"use server"

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileContent } = body;

    if (!fileName || !fileContent) {
      return NextResponse.json(
        { error: "File name and content are required" },
        { status: 400 }
      );
    }

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileContent, "base64"),
      ContentType: "application/octet-stream",
      ACL: "public-read",
    });

    const res = await s3.send(command);
    
    return NextResponse.json({ message: "File uploaded successfully!" });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json(
      { error: "Error uploading file to S3" },
      { status: 500 }
    );
  }
}
