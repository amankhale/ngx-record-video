import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import fixWebmDuration from 'fix-webm-duration';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'ngx-record-video',
  templateUrl: './ngx-record-video.component.html',
  styleUrls: ['./ngx-record-video.component.scss']
})
export class NgxRecordVideoComponent {

  @ViewChild('recorder') videoRecorder!: any;
  @ViewChild('recordedVideo') recordedVideo!: any;

  isCameraStarted = new BehaviorSubject<boolean>(false);
  isRecording = new BehaviorSubject<boolean>(false);
  isRecordingCompleted = new BehaviorSubject<boolean>(false);

  timer: number = 0;
  startTime!: number;
  videoDuration!: number;
  timeInterval!: any;
  private readonly minimumVideoLength: number = 30; // minimum video length is 30 seconds
  private readonly maximumVideoLength: number = 90; // maximum video length is 90 seconds

  disableRecordAgainBtn: boolean = false;
  disableSubmitBtn: boolean = false;
  isMediaRecorderStopped: boolean = false;

  mediaRecorder!: any;
  recordedBlobs!: any;
  patchedBlob!: any;
  videoStream!: any;
  constraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: { exact: true },
      noiseSuppression: { exact: true }
    },
    video: {
      width: 1280,
      height: 720,
      echoCancellation: { exact: true },
      noiseSuppression: { exact: true }
    }
  };
  isVideoSubmitted: boolean = false;

  savedFileName!: string;
  bucketUrl!: string;
  introVideoScore!: number;
  initialScore!: number;
  whyScore!: number;

  constructor() {
  }

  ngOnInit(): void {
    this.getPermission();
  }

  /**
   * Get Permission to access Camera and Microphone
   */
  async getPermission() {

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.isCameraStarted.next(true);
      setTimeout(() => {
        this.startCamera(this.videoStream);
      }, 1000);
    } catch (e) {
      // console.error('navigator.getUserMedia error:', e);
    }
  }

  /**
   * Starts the webcam
   * @param {MediaStream} stream 
   */
  startCamera(stream: MediaStream) {
    this.videoRecorder.nativeElement.srcObject = stream;
    this.videoRecorder.nativeElement.muted = true;
  }

  /**
   * Starts recording
   */
  startRecording() {
    try {
      /**
       * List of all supported video codecs
       * https://stackoverflow.com/questions/41739837/all-mime-types-supported-by-mediarecorder-in-firefox-and-chrome/42307926#42307926
       */
      // let options: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp8,opus' };

      this.mediaRecorder = new MediaRecorder(this.videoStream);

      this.disableRecordAgainBtn = true;
      this.isRecording.next(true);
      this.mediaRecorder.onstop = (event: any) => {
        // console.log('Recorder stopped: ', event);
        // console.log('Recorded Blobs: ', this.recordedBlobs);
      };

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs = [];
          this.recordedBlobs.push(event.data);
        }
        this.isRecordingCompleted.next(true);
        setTimeout(() => {
          this.playRecording(this.recordedBlobs);
        }, 1000);
      }
      this.mediaRecorder.start();
      this.startTime = performance.now();
      this.startTimer();
    } catch (e) {
      // this._utility.openDialogBox(ErrorPopupComponent, { content: 'Browser is not supported !!' });
      // console.error('Exception while creating MediaRecorder:', e);
      return;
    }

    // console.log('MediaRecorder started', this.mediaRecorder);
  }

  /**
   * Starts the timer that shows recording duration
   */
  startTimer(): void {
    this.timeInterval = setInterval(() => {
      this.timer++;
      if (this.timer >= this.maximumVideoLength && !this.isMediaRecorderStopped) {
        // Stop recording if maximum duration is met
        this.stopRecording();
      }
    }, 1000);
  }

  /**
   * Stops Recording
   */
  stopRecording() {
    this.mediaRecorder.stop();
    this.isMediaRecorderStopped = true;
    this.disableRecordAgainBtn = false;
    this.switchCameraOff();
  }

  /**
   * Sets source of video tag with Object url created from Blob
   * @param blob Blob type to create url for video tag
   */
  async playRecording(blob: any) {
    const superBuffer = new Blob(blob);
    this.videoDuration = performance.now() - this.startTime;
    this.patchedBlob = await this.patchBlob(superBuffer, this.videoDuration);
    this.recordedVideo.nativeElement.srcObject = null;
    this.recordedVideo.nativeElement.src = URL.createObjectURL(this.patchedBlob);
    this.recordedVideo.nativeElement.controls = true;
  }

  /**
   * Function to add duration to Blob file
   * @param blob Blob from media recorder
   * @param duration Duration of the video file
   * @returns Promise of type Blob
   */
  patchBlob(blob: Blob, duration: number): Promise<Blob> {
    return new Promise(resolve => {
      fixWebmDuration(blob, duration, newBlob => resolve(newBlob));
    });
  }

  /**
   * Resets all variables and starts recording again
   */
  recordAgain(): void {
    clearInterval(this.timeInterval);
    this.timer = 0;
    this.startTime = 0;
    this.isRecording.next(false);
    this.isRecordingCompleted.next(false);
    this.recordedBlobs = [];
    this.patchedBlob = new Blob
    this.mediaRecorder = null;
    this.videoStream = null;
    this.isMediaRecorderStopped = false;
    this.isVideoSubmitted = false;
    this.getPermission();
  }

  submit(): void {
    console.log('called');

  }

  /**
   * Function to stop video and audio stream
   */
  switchCameraOff(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track: any) => { track.stop(); });
    }
  }

  ngOnDestroy(): void {
    this.isRecording.complete();
    this.isRecordingCompleted.complete();
    this.switchCameraOff();
  }

}
