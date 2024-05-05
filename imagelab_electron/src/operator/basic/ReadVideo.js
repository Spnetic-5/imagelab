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
    let src = new cv2.Mat(video.height, video.width, cv2.CV_8UC4);
    let dst = new cv2.Mat(video.height, video.width, cv2.CV_8UC1);
    let cap = new cv2.VideoCapture(video);
    const FPS = 30;
    while (
        (video.duration === Infinity || isNaN(video.duration)) &&
        video.readyState < 2
      ) {
        await new Promise((r) => setTimeout(r, 1000));
      }
      let currentTime = 0;
      let outputVideoFrame = null;
      const frame_name = "frame";
      let i = 0;
      let streaming = true;
      const openCVInstance = cv2;
      // OpenCV implementation
      if (openCVInstance) {
        // anonymize the video virtually in DOM so that it does not get tainted with //cross origin blobs and hence keeps on painting the received video frames.
        // Refer https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
        video.crossOrigin = "Anonymous";
        const canvas = document.getElementById('image-preview');
        canvas.width = video.width;
        canvas.height = video.height;
        const sourceMatrix = new openCVInstance.Mat(
          video.height,
          video.width,
          openCVInstance.CV_8UC4
        );
        const destinationMatrix = new openCVInstance.Mat(
          video.height,
          video.width,
          openCVInstance.CV_8UC4
        );
        const openCVCaptureInstance = new openCVInstance.VideoCapture(video);
        const intervalPerFrame = 1 / FPS; // 0.1 sec
        const processingDelayPerFrame = 1000 / FPS;
        currentTime = intervalPerFrame; // reset the currentTime to the first interval so that the video starts capturing from the 0.1 second(or exact first frame), otherwise if it starts capturing from 0 seconds, it often takes the last frame into account first and hence messes up the sequence of frames.
    
        async function processVideo() {
          try {
            if (!streaming) {
              // shut down the process if streaming is complete.
              return;
            }
            let delay = 0;
            const begin = FPS === 30 ? Date.now() : null;
            // start processing.
            video.currentTime = currentTime; // seek video to next frame and wait until seeked to current time.
            // await once(video, "seeked");
    
            /*** 
            We use read (image) to get each frame of the video.
            For performance reasons, the image material should be constructed with cv.CV_8UC4 type and same size as the video.
            OpenCV material types can be read the following:
            CV_
             8U: Unsigned int 8-bit
            C4: Four channels.
            Thus mRgba = new Mat(height, width, CvType.CV_8UC4); creates a Matrix with four color channels and values in the range 0 to 255
            These channels are the colour components. E.g. an ordinary RGB image has 3 channels, an RGBA (RGB + alpha) image has four channels, and a CMYK image has four channels.
            
            Refer here https://docs.opencv.org/2.4/doc/tutorials/core/mat_the_basic_image_container/mat_the_basic_image_container.html#creating-a-mat-object-explicitly
            for more explanation as to why we need to create the image material instance as a fourier channel instance.***/
    
            openCVCaptureInstance.read(sourceMatrix); // read frame into the source matrix
            sourceMatrix.copyTo(destinationMatrix);
            openCVInstance.imshow(canvas, destinationMatrix); // draw the current source frame matrix into the destination frame matrix
            i++;
            canvas.toBlob((blob) => {
              const rawUrl = URL.createObjectURL(blob);
              currentTime += intervalPerFrame;
              console.log(rawUrl, i);
    
              if (i == 500) {
                // streaming of video completes
                console.log("stream done");
                streaming = false;
                // clear the material from memory on stream complete
                console.log("Clear memory");
                sourceMatrix.delete();
                destinationMatrix.delete();
                video.remove();
              } else {
                if (streaming) {
                  // per docs if the fps is 30, the delay should be 1000/fps - processing time of each frame.
                  FPS === 30
                    ? (delay = 100 / FPS - (Date.now() - begin))
                    : (delay = processingDelayPerFrame);
                  setTimeout(processVideo, 0); // schedule the next frame and so on
                }
              }
            });
          } catch (err) {
            console.log(err); //silently log error and move ahead
          }
        }
        // schedule the first one.
        setTimeout(processVideo, 0);
        return;
      }
  }
}

module.exports = ReadVideo;


