"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadSignature = createUploadSignature;
const crypto_1 = __importDefault(require("crypto"));
function assertEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
function createUploadSignature(params) {
    const cloudName = assertEnv('CLOUDINARY_CLOUD_NAME');
    const apiKey = assertEnv('CLOUDINARY_API_KEY');
    const apiSecret = assertEnv('CLOUDINARY_API_SECRET');
    const folder = (params === null || params === void 0 ? void 0 : params.folder) || process.env.CLOUDINARY_FOLDER || 'psyco/resources';
    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signed upload: signature = sha1(sorted_params + api_secret)
    // Required params for our case: folder, timestamp. (public_id, eager, etc. non utilisés ici)
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto_1.default.createHash('sha1').update(toSign).digest('hex');
    return { timestamp, signature, apiKey, cloudName, folder };
}
