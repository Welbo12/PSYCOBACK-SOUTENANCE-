import crypto from 'crypto';

interface CloudinarySignature {
	timestamp: number;
	signature: string;
	apiKey: string;
	cloudName: string;
	folder: string;
}

function assertEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

export function createUploadSignature(params?: { folder?: string }): CloudinarySignature {
	const cloudName = assertEnv('CLOUDINARY_CLOUD_NAME');
	const apiKey = assertEnv('CLOUDINARY_API_KEY');
	const apiSecret = assertEnv('CLOUDINARY_API_SECRET');
	const folder = params?.folder || process.env.CLOUDINARY_FOLDER || 'psyco/resources';

	const timestamp = Math.floor(Date.now() / 1000);

	// Cloudinary signed upload: signature = sha1(sorted_params + api_secret)
	// Required params for our case: folder, timestamp. (public_id, eager, etc. non utilisés ici)
	const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
	const signature = crypto.createHash('sha1').update(toSign).digest('hex');

	return { timestamp, signature, apiKey, cloudName, folder };
}


