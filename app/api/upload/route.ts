import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    const uploadAll = async (file: File) => {
      const buffer = await file.arrayBuffer();

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      });
      return client.send(command);
    };

    files.forEach(async (file) => {
      await uploadAll(file);
    });

    return NextResponse.json(
      { message: "Files uploaded successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error uploading files", error: err },
      { status: 500 }
    );
  }
}
