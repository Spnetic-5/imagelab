const OpenCvOperator = require("../OpenCvOperator");
const cv2 = require("../../opencv");

/**
 * This class contains the main logic to read the video
 */
class ReadVideo extends OpenCvOperator {
    constructor(type, id) {
        super(type, id);
    }

    /**
     * This function reads the given video
     * @param {HTMLVideoElement} video
     * @returns processed video
     */
    async compute(video) {

        console.log("In video", video)
    }


}

module.exports = ReadVideo;