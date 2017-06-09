import {isBrowser, isNode} from "./env";
import {Terminal} from "./terminal";

/**
 * Created by n.vinayakan on 06.06.17.
 */
let fs = null;
let virtualFileSystem = {
    fileMap: new Map(),
    readFileSync: (path, options?) => {
        return fs.fileMap.get(path);
    },
    writeFileSync: (path, data, options?) => {
        return fs.fileMap.set(path, data);
    }
};
if (isBrowser) {
    // Terminal.write("----> Browser environment");
    fs = virtualFileSystem;
    window["Buffer"] = class NodeBuffer {
        constructor(public array) {
        }
    }
} else if (isNode) {
    // Terminal.write("----> NodeJS environment");
    fs = require("fs");
} else {
    Terminal.error("----> Unknown host environment!!!. Where are we?");
}

export class FileSystem {

    static readTextFile(path) {
        try {
            return fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
        } catch (e) {
            let virtualFile = virtualFileSystem.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
            return virtualFile === undefined ? null : virtualFile;
        }
    }

    static writeTextFile(path, contents, virtual = false) {
        try {
            if (virtual) {
                virtualFileSystem.writeFileSync(path, contents);
            } else {
                fs.writeFileSync(path, contents);
            }
            return true;
        } catch (e) {
            return false;
        }
    }


    static readBinaryFile(path) {
        try {
            return fs.readFileSync(path);
        } catch (e) {
            let virtualFile = virtualFileSystem.readFileSync(path);
            return virtualFile === undefined ? null : virtualFile;
        }
    }

    static writeBinaryFile(path, contents, virtual = false) {
        try {
            if (virtual) {
                virtualFileSystem.writeFileSync(path, new Buffer(contents.array.subarray(0, contents.length)));
            } else {
                fs.writeFileSync(path, new Buffer(contents.array.subarray(0, contents.length)));
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}