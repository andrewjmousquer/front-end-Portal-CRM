import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileUtil {

    static formatSizeUnits(bytes) {
        if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(0) + " GB"; }
        else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(0) + " MB"; }
        else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(0) + " KB"; }
        else if (bytes > 1) { bytes = bytes + " bytes"; }
        else if (bytes == 1) { bytes = bytes + " byte"; }
        else { bytes = "0 bytes"; }
        return bytes;
    }

    static getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    static isImage(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'png':
                return true;
        }
        return false;
    }

    static isImageAndPdf(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'pdf':
                return true;
        }
        return false;
    }
}
