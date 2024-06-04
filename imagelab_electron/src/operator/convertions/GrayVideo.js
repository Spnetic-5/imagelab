const OpenCvOperator = require("../OpenCvOperator");
const cv2 = require("../../opencv");

/**
 * This class contains the main logic to gray the image
 */
class GrayVideo extends OpenCvOperator {
    constructor(type, id) {
        super(type, id);
    }

    /**
     * @param {Mat} image
     * @returns
     * This function grays the image
     */
    compute(video1) {
        let video = document.getElementById("input-video");
        let output = document.getElementById("output-image");
        let cap = new cv2.VideoCapture(video);
        let streaming = true;
        let i = 0;

        const FPS = 30;
        output.width = video.width;
        output.height = video.height;

        const sourceMatrix = new cv2.Mat(
            video.height,
            video.width,
            cv2.CV_8UC4
        );
        const destinationMatrix = new cv2.Mat(
            video.height,
            video.width,
            cv2.CV_8UC1
        );

        function processVideo() {
            try {

                if (!streaming) {
                    sourceMatrix.delete();
                    destinationMatrix.delete();
                    return;
                }
                let begin = Date.now();
                // start processing.
                cap.read(sourceMatrix); // read frame into the source matrix
                cv2.cvtColor(sourceMatrix, destinationMatrix, cv2.COLOR_RGBA2GRAY);
                console.log("sdjodfjos", sourceMatrix);
                // sourceMatrix.copyTo(destinationMatrix);
                cv2.imshow(output, destinationMatrix);
                // schedule the next one.
                let delay = 1000 / FPS - (Date.now() - begin);
                setTimeout(processVideo, 0);
                i++;
                if(i==500){
                    streaming=false
                }
            } catch (err) {
                console.log("error", err)
            }
        };

        // schedule the first one.
        setTimeout(processVideo, 0);

    }
}

module.exports = GrayVideo;