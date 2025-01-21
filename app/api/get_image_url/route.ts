import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  request: NextRequest,
  { params }: { params: { namefile: string } }
) {
  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const filename = request.nextUrl.searchParams.get("namefile");

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename as string,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log(signedUrl);
    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to Fetch Image from S3", error: err },
      { status: 500 }
    );
  }
}
