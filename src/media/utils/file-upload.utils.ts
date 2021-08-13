import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Định đạng hình ảnh không cho phép'), false);
    }
    callback(null, true);
};

export const videoFileFilter = (req, file, callback) => {
    if (!file.originalname.toLowerCase().match(/\.(mp4|mov)$/)) {
        console.log(file.originalname);
        return callback(new Error('Định đạng video không cho phép'), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};