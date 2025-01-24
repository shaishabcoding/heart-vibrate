/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const imgBB_url = `https://api.imgbb.com/1/upload?key=${
  import.meta.env.VITE_IMGBB_KEY
}`;

/**
 * Uploads an image to imgBB and returns the URL of the uploaded image.
 *
 * @param {File} image - The image file to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the URL of the uploaded image.
 * @throws {Error} - Throws an error if the upload fails.
 */
interface ImgBBResponse {
    data: {
        display_url: string;
    };
}

const imgBB = async (image: File): Promise<string> => {
    const imgBBFormData = new FormData();
    imgBBFormData.append("image", image);

    try {
        const res = await axios.post<ImgBBResponse>(imgBB_url, imgBBFormData);
        return res.data.data.display_url;
    } catch (error: any) {
        throw new Error("Image upload failed: " + error.message);
    }
};

export default imgBB;