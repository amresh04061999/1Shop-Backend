import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath:any) => {
    try {
        if (!localFilePath) throw new Error('No file path provided');

        // Check if file exists
        if (!fs.existsSync(localFilePath)) throw new Error('File does not exist');

        console.log('File upload data:', localFilePath);

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Uncomment if you want to delete the local file after successful upload
        await fs.promises.unlink(localFilePath);
        return response;
    } catch (error) {
        console.error('File upload failed:', error);
        fs.unlinkSync(localFilePath);
        // Uncomment if you want to delete the local file after an error occurs
        return null;
    }
}

export { uploadOnCloudinary };
