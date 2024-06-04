const OpenCvOperator = require("../OpenCvOperator");

/**
 * This class contains the main logic to read the video
 */
class WriteVideo extends OpenCvOperator {
    constructor(type, id) {
        super(type, id);
    }

    /**
     * This function reads the given video
     * @param {HTMLVideoElement} video
     * @returns processed video
     */
    async compute(video) {


        let input_canvas = document.getElementById('input-video')

        let videoElement = document.getElementById('output-video')
        videoElement.controls = true;
        videoElement.height = 200
        videoElement.width = 400
        videoElement.setAttribute('src', input_canvas.src)
    }
}

module.exports = WriteVideo;
