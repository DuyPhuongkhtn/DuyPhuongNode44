import {v2 as cloudinary} from 'cloudinary';

export const CloudinaryProvider = {
    provide: "CLOUDINARY",
    useFactory: () => cloudinary
};