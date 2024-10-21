const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// const saltHex = "d2b2a1bc78c7b6d5df48a28e09417a8c";
const keyHex = "5f99d6ef37f09b818d98c6568e1304359759ac7bf2098b0721d6e5d75d02a8e8";
const ivHex = "0bd4b1d62619c9e39fe6d8837ad585b2";

function encryptFile(inputFilePath, name, type) {
    // 读取文件内容
    const data = fs.readFileSync(inputFilePath);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(keyHex, "hex"), Buffer.from(ivHex, "hex"));
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);


    // 构建加密后的文件路径，不包含原始文件的后缀名
    const outputFilePath = `${path.dirname(inputFilePath)}/${name}_${type}_encrypted`;

    // 写入加密后的内容到输出文件
    fs.writeFileSync(outputFilePath, encrypted);

    console.log(`加密完成，文件保存为：${outputFilePath}`);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const musicDirPath = path.join(__dirname, './resource/music');
// TODO 修改仓库名称
const NAME = 'music-template';

let fileList = [];

// 递归遍历目录函数
const readFiles = async (directory) => {
    const files = fs.readdirSync(directory);

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await readFiles(filePath); // 如果是目录，则递归调用
        } else {
            const fileType = file.substring(file.lastIndexOf('.') + 1);
            const name = path.basename(filePath, path.extname(filePath));

            if (fileType === "flac" || fileType === "mp3") {
                encryptFile(filePath, name, fileType === "flac" ? "1" : "0")
                const _path = `${path.dirname(filePath)}/${name}_${fileType === "flac" ? "1" : "0"}_encrypted`

                fileList.push({
                    url: `https://www.ndzy01.com/${NAME}/${path.relative(__dirname + '/resource/', _path)}`,
                    name,
                    id: generateUUID(),
                    fileType,
                });
            }
        }
    }
};

const run = async () => {
    await readFiles(musicDirPath);

    console.log('------ndzy------', '一共有:', fileList.length, '个音频文件', '------ndzy------');

    fs.writeFileSync(path.join(__dirname, './resource/data.json'), JSON.stringify(fileList, null, 2));
};

run().then()
