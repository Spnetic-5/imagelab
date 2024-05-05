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
  compute(video) {
    console.log("Compute video")
  }
}

module.exports = WriteVideo;