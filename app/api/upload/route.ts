import { NextRequest, NextResponse } from "next/server";
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export async function POST(request: NextRequest) {
  try {
    const client = new S3Client({ region: "us-west-2" });
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    const uploadAll = async (file: File) => {
      console.log(file.name);
      const buffer = await file.arrayBuffer();

      const command = new PutObjectCommand({
        Bucket: "llm-evaluator-buckets",
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
